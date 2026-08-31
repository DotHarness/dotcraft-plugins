#!/usr/bin/env python3
"""Validate DotHarness-style Markdown specifications."""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from urllib.parse import unquote, urlsplit


ALLOWED_STATUSES = {"Draft", "Living"}
SEMVER_RE = re.compile(
    r"(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)"
    r"(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?"
    r"(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?"
)
LINK_RE = re.compile(r"\[([^\]]+)]\(([^)\n]+)\)")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*#*\s*$")
WINDOWS_ABSOLUTE_RE = re.compile(r"^[A-Za-z]:[\\/]")


@dataclass(frozen=True)
class Issue:
    path: Path
    line: int
    message: str


def _strip_markup(value: str) -> str:
    value = value.strip()
    for marker in ("**", "__", "`"):
        if value.startswith(marker) and value.endswith(marker) and len(value) > len(marker) * 2:
            value = value[len(marker) : -len(marker)].strip()
    return value


def _table_cells(line: str) -> list[str]:
    value = line.strip()
    if not value.startswith("|") or not value.endswith("|"):
        return []
    return [cell.strip() for cell in value[1:-1].split("|")]


def _metadata(lines: list[str], path: Path) -> tuple[dict[str, tuple[str, int]], list[Issue]]:
    issues: list[Issue] = []
    title_index = next((index for index, line in enumerate(lines) if line.strip()), None)
    if title_index is None or not re.fullmatch(r"#\s+\S.*", lines[title_index].strip()):
        return {}, [Issue(path, 1 if title_index is None else title_index + 1, "first content line must be one H1 title")]

    table_index = title_index + 1
    while table_index < len(lines) and not lines[table_index].strip():
        table_index += 1
    if table_index >= len(lines) or [_strip_markup(cell) for cell in _table_cells(lines[table_index])] != ["Field", "Value"]:
        return {}, [Issue(path, table_index + 1, "metadata table must appear immediately after the H1 title")]

    if table_index + 1 >= len(lines):
        return {}, [Issue(path, table_index + 1, "metadata table is missing its separator row")]
    separators = _table_cells(lines[table_index + 1])
    if len(separators) != 2 or any(not re.fullmatch(r":?-{3,}:?", cell) for cell in separators):
        return {}, [Issue(path, table_index + 2, "metadata table separator must contain two columns")]

    metadata: dict[str, tuple[str, int]] = {}
    row_index = table_index + 2
    while row_index < len(lines) and lines[row_index].strip().startswith("|"):
        cells = _table_cells(lines[row_index])
        if len(cells) != 2:
            issues.append(Issue(path, row_index + 1, "metadata rows must contain exactly Field and Value columns"))
            row_index += 1
            continue
        field = _strip_markup(cells[0])
        value = _strip_markup(cells[1])
        if field in metadata:
            issues.append(Issue(path, row_index + 1, f"duplicate metadata field: {field}"))
        elif field:
            metadata[field] = (value, row_index + 1)
        row_index += 1
    return metadata, issues


def _slug(text: str) -> str:
    text = re.sub(r"\[([^\]]+)]\([^)]+\)", r"\1", text)
    text = re.sub(r"[`*_~]", "", text).lower()
    text = "".join(character for character in text if character.isalnum() or character in " -_")
    return re.sub(r"[\s_]+", "-", text).strip("-")


def _anchors(path: Path) -> set[str]:
    try:
        lines = path.read_text(encoding="utf-8-sig").splitlines()
    except (OSError, UnicodeError):
        return set()
    anchors: set[str] = set()
    counts: dict[str, int] = {}
    for line in lines:
        match = HEADING_RE.match(line.strip())
        if not match:
            continue
        base = _slug(match.group(2))
        count = counts.get(base, 0)
        counts[base] = count + 1
        anchors.add(base if count == 0 else f"{base}-{count}")
    for line in lines:
        anchors.update(re.findall(r"(?:id|name)=[\"']([^\"']+)[\"']", line, re.IGNORECASE))
    return anchors


def _repo_root(path: Path) -> Path:
    for candidate in (path.parent, *path.parents):
        if (candidate / ".git").exists():
            return candidate.resolve()
    for candidate in (path.parent, *path.parents):
        if candidate.name.lower() == "specs":
            return candidate.parent.resolve()
    return path.parent.resolve()


def _link_target(raw_target: str) -> str:
    target = raw_target.strip()
    if target.startswith("<") and ">" in target:
        return target[1 : target.index(">")]
    return target.split(maxsplit=1)[0]


def _local_link(path: Path, raw_target: str, repo_root: Path, line: int) -> tuple[Path | None, list[Issue]]:
    target = _link_target(raw_target)
    parsed = urlsplit(target)
    if parsed.scheme in {"http", "https", "mailto"}:
        return None, []
    if parsed.scheme or target.startswith(("//", "\\\\")) or WINDOWS_ABSOLUTE_RE.match(target) or target.startswith("/"):
        return None, [Issue(path, line, f"link must be repository-relative: {target}")]

    target_path = unquote(parsed.path)
    resolved = path.resolve() if not target_path else (path.parent / target_path).resolve()
    try:
        resolved.relative_to(repo_root)
    except ValueError:
        return None, [Issue(path, line, f"link leaves repository root: {target}")]
    if not resolved.exists():
        return resolved, [Issue(path, line, f"link target does not exist: {target}")]
    if parsed.fragment and resolved.is_file() and resolved.suffix.lower() == ".md":
        fragment = unquote(parsed.fragment).lower()
        if fragment not in _anchors(resolved):
            return resolved, [Issue(path, line, f"link anchor does not exist: {target}")]
    return resolved, []


def _links(text: str, path: Path, repo_root: Path) -> tuple[set[Path], list[Issue]]:
    targets: set[Path] = set()
    issues: list[Issue] = []
    fence: str | None = None
    for line_number, line in enumerate(text.splitlines(), 1):
        stripped = line.lstrip()
        if stripped.startswith(("```", "~~~")):
            marker = stripped[:3]
            fence = None if fence == marker else marker if fence is None else fence
            continue
        if fence is not None:
            continue
        visible_markdown = re.sub(r"`[^`]*`", "", line)
        for match in LINK_RE.finditer(visible_markdown):
            target, link_issues = _local_link(path, match.group(2), repo_root, line_number)
            issues.extend(link_issues)
            if target is not None:
                targets.add(target)
    return targets, issues


def validate_text(text: str, path: Path, repo_root: Path | None = None) -> list[Issue]:
    path = path.resolve()
    repo_root = (repo_root or _repo_root(path)).resolve()
    lines = text.splitlines()
    metadata, issues = _metadata(lines, path)

    h1_lines = [line_number for line_number, line in enumerate(lines, 1) if re.fullmatch(r"#\s+\S.*", line.strip())]
    for line_number in h1_lines[1:]:
        issues.append(Issue(path, line_number, "spec must contain exactly one H1 title"))

    for field in ("Version", "Status", "Date"):
        if field not in metadata:
            issues.append(Issue(path, 1, f"missing required metadata field: {field}"))

    if "Version" in metadata:
        value, line = metadata["Version"]
        if not SEMVER_RE.fullmatch(value):
            issues.append(Issue(path, line, "Version must be semantic version X.Y.Z"))
    if "Status" in metadata:
        value, line = metadata["Status"]
        if value not in ALLOWED_STATUSES:
            issues.append(Issue(path, line, "Status must be Draft or Living"))
    if "Date" in metadata:
        value, line = metadata["Date"]
        try:
            parsed_date = date.fromisoformat(value)
        except ValueError:
            parsed_date = None
        if parsed_date is None or parsed_date.isoformat() != value:
            issues.append(Issue(path, line, "Date must be a real date in YYYY-MM-DD format"))

    for field, (value, line) in metadata.items():
        if field.lower().startswith(("parent spec", "related spec")) and not LINK_RE.search(value):
            issues.append(Issue(path, line, f"{field} must contain repository-relative Markdown links"))

    for line_number, line in enumerate(lines, 1):
        if line.endswith((" ", "\t")):
            issues.append(Issue(path, line_number, "trailing whitespace"))

    _, link_issues = _links(text, path, repo_root)
    issues.extend(link_issues)
    return issues


def validate_file(path: Path) -> list[Issue]:
    path = path.resolve()
    if not path.is_file():
        return [Issue(path, 1, "spec path must be an existing file")]
    try:
        text = path.read_text(encoding="utf-8-sig")
    except (OSError, UnicodeError) as error:
        return [Issue(path, 1, f"cannot read UTF-8 spec: {error}")]
    return validate_text(text, path)


def validate_index(index: Path, specs: list[Path]) -> list[Issue]:
    index = index.resolve()
    if not index.is_file():
        return [Issue(index, 1, "index path must be an existing file")]
    try:
        text = index.read_text(encoding="utf-8-sig")
    except (OSError, UnicodeError) as error:
        return [Issue(index, 1, f"cannot read UTF-8 index: {error}")]
    targets, issues = _links(text, index, _repo_root(index))
    for spec in specs:
        if spec.resolve() not in targets:
            issues.append(Issue(index, 1, f"index does not reference spec: {spec.resolve()}"))
    return issues


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("specs", nargs="+", type=Path, help="Markdown specification files to validate")
    parser.add_argument("--index", type=Path, help="optional specification index that must reference every input spec")
    args = parser.parse_args(argv)

    specs = [path.resolve() for path in args.specs]
    issues = [issue for spec in specs for issue in validate_file(spec)]
    if args.index is not None:
        issues.extend(validate_index(args.index, specs))

    if issues:
        for issue in sorted(issues, key=lambda value: (str(value.path), value.line, value.message)):
            print(f"{issue.path}:{issue.line}: {issue.message}", file=sys.stderr)
        return 1
    print(f"[validate-spec] OK ({len(specs)} spec{'s' if len(specs) != 1 else ''})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

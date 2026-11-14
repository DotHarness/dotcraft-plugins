#!/usr/bin/env python3
"""List sentences that two specs state in near-identical words, as leads for an ownership review."""

from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

SHINGLE = 6
SENTENCE_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z`\"(])")


def sentences(path: Path) -> list[tuple[int, str]]:
    found: list[tuple[int, str]] = []
    fence = False
    for line_number, line in enumerate(path.read_text(encoding="utf-8-sig").splitlines(), 1):
        stripped = line.strip()
        if stripped.startswith(("```", "~~~")):
            fence = not fence
            continue
        if fence or not stripped or stripped.startswith(("#", "|", "---")):
            continue
        text = re.sub(r"\[([^\]]+)]\([^)]+\)", r"\1", stripped.lstrip("-*0123456789. "))
        found.extend((line_number, sentence) for sentence in SENTENCE_RE.split(text))
    return found


def words(sentence: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", sentence.lower())


def shingles(tokens: list[str]) -> set[tuple[str, ...]]:
    return {tuple(tokens[index : index + SHINGLE]) for index in range(len(tokens) - SHINGLE + 1)}


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path, help="specs directory")
    parser.add_argument("--min-words", type=int, default=12, help="ignore sentences shorter than this")
    parser.add_argument("--threshold", type=float, default=0.5, help="shared-phrase ratio that counts as a duplicate")
    args = parser.parse_args(argv)

    entries: list[tuple[Path, int, str, set[tuple[str, ...]]]] = []
    for path in sorted(args.root.resolve().rglob("*.md")):
        for line_number, sentence in sentences(path):
            tokens = words(sentence)
            if len(tokens) >= args.min_words:
                entries.append((path, line_number, sentence, shingles(tokens)))

    by_shingle: dict[tuple[str, ...], list[int]] = defaultdict(list)
    for index, entry in enumerate(entries):
        for shingle in entry[3]:
            by_shingle[shingle].append(index)

    shared: dict[tuple[int, int], int] = defaultdict(int)
    for indexes in by_shingle.values():
        if len(indexes) > 20:
            continue
        for position, first in enumerate(indexes):
            for second in indexes[position + 1 :]:
                if entries[first][0] != entries[second][0]:
                    shared[(first, second)] += 1

    pairs = 0
    for (first, second), count in sorted(shared.items(), key=lambda item: -item[1]):
        smaller = min(len(entries[first][3]), len(entries[second][3]))
        if smaller == 0 or count / smaller < args.threshold:
            continue
        pairs += 1
        for path, line_number, sentence, _ in (entries[first], entries[second]):
            print(f"{path}:{line_number}: {sentence[:160]}")
        print()
    print(f"[find-duplicates] {pairs} pair{'s' if pairs != 1 else ''}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

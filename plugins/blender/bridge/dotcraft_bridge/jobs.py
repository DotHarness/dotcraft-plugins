"""Job table for work that cannot complete inside one main-thread drain."""

import time
import uuid

_jobs = {}
MAX_RETAINED = 32


class Job:
    def __init__(self, kind, detail=None):
        self.id = uuid.uuid4().hex[:12]
        self.kind = kind
        self.state = "running"
        self.detail = detail or {}
        self.result = None
        self.error = None
        self.started = time.time()
        self.ended = None

    def complete(self, result):
        self.state = "completed"
        self.result = result
        self.ended = time.time()

    def cancel(self, message="cancelled"):
        self.state = "cancelled"
        self.error = message
        self.ended = time.time()

    def fault(self, message):
        self.state = "failed"
        self.error = message
        self.ended = time.time()

    def snapshot(self):
        return {
            "jobId": self.id,
            "kind": self.kind,
            "state": self.state,
            "detail": self.detail,
            "result": self.result,
            "error": self.error,
            "elapsedSeconds": round((self.ended or time.time()) - self.started, 3),
        }


def create(kind, detail=None):
    _prune()
    job = Job(kind, detail)
    _jobs[job.id] = job
    return job


def get(job_id):
    return _jobs.get(job_id)


def active(kind=None):
    return [j for j in _jobs.values() if j.state == "running" and (kind is None or j.kind == kind)]


def listing():
    return [j.snapshot() for j in sorted(_jobs.values(), key=lambda j: j.started)]


def _prune():
    finished = sorted(
        (j for j in _jobs.values() if j.state != "running"),
        key=lambda j: j.ended or 0,
    )
    while len(_jobs) - len(active()) > MAX_RETAINED and finished:
        _jobs.pop(finished.pop(0).id, None)

from dataclasses import dataclass, field


@dataclass
class RetrievalCandidate:
    source_id: str
    snippet: str
    score: float


@dataclass
class RetrievalTrace:
    query: str
    selected_sources: list[str] = field(default_factory=list)
    deferred_sources: list[str] = field(default_factory=list)


def rank_candidates(
    candidates: list[RetrievalCandidate],
) -> list[RetrievalCandidate]:
    return sorted(candidates, key=lambda candidate: candidate.score, reverse=True)


def build_trace(
    query: str,
    candidates: list[RetrievalCandidate],
    limit: int = 2,
) -> RetrievalTrace:
    ranked = rank_candidates(candidates)
    selected = [candidate.source_id for candidate in ranked[:limit]]
    deferred = [candidate.source_id for candidate in ranked[limit:]]
    return RetrievalTrace(
        query=query,
        selected_sources=selected,
        deferred_sources=deferred,
    )

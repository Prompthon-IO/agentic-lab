def identify_evidence_gaps(
    todo: list[str],
    evidence_count: int,
) -> list[str]:
    if evidence_count == 0:
        return todo

    gaps: list[str] = []
    if evidence_count < 2:
        gaps.append("add at least one more source before publishing")
    if any("clarify" in item.lower() for item in todo):
        gaps.append("confirm the research goal is reflected in the final draft")
    return gaps


def is_ready_to_publish(evidence_count: int, gaps: list[str]) -> bool:
    return evidence_count >= 2 and not gaps

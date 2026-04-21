def should_promote(summary: str) -> bool:
    lowered = summary.lower()
    return any(
        keyword in lowered
        for keyword in ("decision", "policy", "publish", "final")
    )


def artifact_key(topic: str) -> str:
    normalized = "".join(
        character if character.isalnum() else "-"
        for character in topic.lower()
    )
    compact_parts = [part for part in normalized.split("-") if part]
    return "-".join(compact_parts[:6]) or "artifact"

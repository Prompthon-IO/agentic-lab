def choose_route(plan: str) -> str:
    lowered = plan.lower()
    if any(keyword in lowered for keyword in ("tool", "lookup", "search", "fetch")):
        return "tool"
    return "direct"


def should_retry(error_message: str) -> bool:
    lowered = error_message.lower()
    return any(
        keyword in lowered
        for keyword in ("timeout", "temporary", "rate limit")
    )

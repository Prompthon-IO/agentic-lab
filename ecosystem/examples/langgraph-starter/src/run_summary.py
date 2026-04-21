def render_run_summary(
    question: str,
    plan: str,
    route: str,
    answer: str,
) -> str:
    return "\n".join(
        [
            f"Question: {question}",
            f"Plan: {plan}",
            f"Route: {route}",
            f"Answer: {answer}",
        ]
    )

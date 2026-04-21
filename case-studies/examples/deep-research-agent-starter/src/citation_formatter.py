def format_reference(index: int, title: str, url: str) -> str:
    return f"[{index}] {title} - {url}"


def render_reference_list(items: list[tuple[str, str]]) -> str:
    lines = ["## References", ""]
    for index, (title, url) in enumerate(items, start=1):
        lines.append(format_reference(index, title, url))
    return "\n".join(lines)

from memory_flow import MemoryItem


def normalize_imported_context(
    pairs: list[tuple[str, str]],
    source: str = "imported-summary",
) -> list[MemoryItem]:
    facts: list[MemoryItem] = []
    for category, summary in pairs:
        cleaned_category = category.strip().lower().replace(" ", "_")
        cleaned_summary = summary.strip()
        if not cleaned_category or not cleaned_summary:
            continue
        facts.append(
            MemoryItem(
                kind=cleaned_category,
                summary=cleaned_summary,
                source=source,
            )
        )
    return facts


def merge_personal_context(
    existing: list[MemoryItem],
    imported: list[MemoryItem],
) -> list[MemoryItem]:
    merged = {fact.kind: fact for fact in existing}
    for fact in imported:
        merged[fact.kind] = fact
    return list(merged.values())

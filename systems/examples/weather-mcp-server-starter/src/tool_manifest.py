from dataclasses import dataclass, field


@dataclass
class ToolManifest:
    name: str
    description: str
    input_schema: dict[str, object]
    output_fields: list[str] = field(default_factory=list)


def build_weather_manifest() -> ToolManifest:
    return ToolManifest(
        name="get_forecast",
        description="Return a short weather summary for a city and day range.",
        input_schema={
            "type": "object",
            "required": ["city"],
            "properties": {
                "city": {"type": "string"},
                "days": {"type": "integer", "minimum": 1, "maximum": 7},
            },
        },
        output_fields=["city", "summary", "source"],
    )

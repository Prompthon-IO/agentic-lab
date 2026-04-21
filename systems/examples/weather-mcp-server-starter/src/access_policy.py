from dataclasses import dataclass, field


@dataclass
class CallerContext:
    actor_id: str
    scopes: list[str] = field(default_factory=list)


def authorize_forecast(context: CallerContext, city: str) -> None:
    if "weather:read" not in context.scopes:
        raise PermissionError("weather:read scope is required")
    if city.strip().lower() == "restricted":
        raise PermissionError("restricted cities require a higher trust tier")

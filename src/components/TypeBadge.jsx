import { TYPE_COLORS, TYPE_NAMES_FR } from "../data/gameData";

export default function TypeBadge({ type, size = "sm" }) {
  const color = TYPE_COLORS[type] || "#999";
  const sizes = {
    xs: { fontSize: "9px", padding: "2px 5px", borderRadius: "3px" },
    sm: { fontSize: "11px", padding: "3px 8px", borderRadius: "4px" },
    md: { fontSize: "13px", padding: "4px 10px", borderRadius: "5px" },
  };
  return (
    <span style={{
      display: "inline-block",
      background: color,
      color: "#fff",
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      ...sizes[size],
    }}>
      {TYPE_NAMES_FR[type] || type}
    </span>
  );
}

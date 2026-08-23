import { computeTeamWeaknesses } from "../utils/typeCalc";
import { TYPE_COLORS, TYPE_NAMES_FR } from "../data/gameData";

const EFF_CONFIG = [
  { key: "immune", label: "0×", color: "#555", textColor: "#aaa", bg: "#222" },
  { key: "quarter", label: "¼×", color: "#2196F3", textColor: "#fff", bg: "#0d253f" },
  { key: "half", label: "½×", color: "#4CAF50", textColor: "#fff", bg: "#0d2e17" },
  { key: "double", label: "2×", color: "#FF9800", textColor: "#fff", bg: "#2e1e00" },
  { key: "quad", label: "4×", color: "#e74c3c", textColor: "#fff", bg: "#2e0d0d" },
];

export default function WeaknessTable({ team, genTypes }) {
  const filledTeam = team.map(slot => {
    if (!slot?.pokemon) return null;
    return {
      name: slot.pokemon.name,
      sprite: slot.pokemon.sprite,
      id: slot.pokemon.id,
      types: slot.pokemon.types,
      ability: slot.selectedAbility || null,
    };
  });

  const weaknesses = computeTeamWeaknesses(filledTeam.filter(Boolean));

  // Filter to only show types relevant to the generation
  const relevantTypes = genTypes;

  // Sort by most problematic (most pokemon weak)
  const sorted = [...relevantTypes].sort((a, b) => {
    const scoreA = (weaknesses[a]?.double?.length || 0) * 2 + (weaknesses[a]?.quad?.length || 0) * 4;
    const scoreB = (weaknesses[b]?.double?.length || 0) * 2 + (weaknesses[b]?.quad?.length || 0) * 4;
    return scoreB - scoreA;
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ fontSize: 11, color: "#888", marginBottom: 12 }}>
        Les talents sélectionnés sont pris en compte · ✦ = talent caché
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ padding: "6px 10px", textAlign: "left", color: "#666", fontWeight: 600, fontSize: 10, textTransform: "uppercase" }}>
              Type attaquant
            </th>
            {EFF_CONFIG.map(e => (
              <th key={e.key} style={{
                padding: "6px 8px", textAlign: "center", color: e.color,
                fontWeight: 700, fontSize: 13, minWidth: 36,
              }}>
                {e.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((type, i) => {
            const row = weaknesses[type] || {};
            const hasIssue = (row.double?.length || 0) + (row.quad?.length || 0) > 0;

            return (
              <tr
                key={type}
                style={{
                  background: i % 2 === 0 ? "#0d0d1a" : "#12122a",
                  borderLeft: hasIssue ? `3px solid ${TYPE_COLORS[type]}` : "3px solid transparent",
                }}
              >
                <td style={{ padding: "7px 10px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    background: TYPE_COLORS[type],
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 3,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    whiteSpace: "nowrap",
                  }}>
                    {TYPE_NAMES_FR[type]}
                  </span>
                </td>
                {EFF_CONFIG.map(e => {
                  const pokemon = row[e.key] || [];
                  return (
                    <td key={e.key} style={{ padding: "5px 4px", textAlign: "center", verticalAlign: "middle" }}>
                      {pokemon.length > 0 ? (
                        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                          {pokemon.map(p => (
                            <div key={p.id} title={p.name} style={{ position: "relative" }}>
                              {p.sprite ? (
                                <img
                                  src={p.sprite}
                                  alt={p.name}
                                  width={28}
                                  height={28}
                                  style={{
                                    imageRendering: "pixelated",
                                    filter: e.key === "immune" ? "grayscale(1) opacity(0.4)" :
                                            e.key === "quad" ? "drop-shadow(0 0 4px #e74c3c)" : "none",
                                  }}
                                />
                              ) : (
                                <span style={{
                                  display: "inline-block", width: 28, height: 28,
                                  background: e.bg, borderRadius: 4, fontSize: 9,
                                  color: e.textColor, lineHeight: "28px", textAlign: "center",
                                }}>
                                  {p.name.slice(0, 3)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: "#333", fontSize: 16 }}>·</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        {EFF_CONFIG.map(e => (
          <div key={e.key} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
            <span style={{ color: e.color, fontWeight: 700 }}>{e.label}</span>
            <span style={{ color: "#666" }}>
              {e.key === "immune" ? "Immunité" : e.key === "quarter" ? "Résistance forte" :
               e.key === "half" ? "Résistance" : e.key === "double" ? "Faiblesse" : "Faiblesse ×4"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

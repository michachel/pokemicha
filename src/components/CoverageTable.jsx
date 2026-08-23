import { computeTeamCoverage, computeMovesetCoverage } from "../utils/typeCalc";
import { TYPE_COLORS, TYPE_NAMES_FR } from "../data/gameData";

function EffCell({ value }) {
  if (value === 0) return <span style={{ color: "#555", fontSize: 14 }}>·</span>;
  const config = value >= 4 ? { color: "#a259f7", label: "4×" }
    : value >= 2 ? { color: "#4CAF50", label: "2×" }
    : value >= 1 ? { color: "#888", label: "1×" }
    : { color: "#e74c3c", label: "½×" };
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color: config.color,
      background: config.color + "22", padding: "2px 5px", borderRadius: 3,
    }}>
      {config.label}
    </span>
  );
}

export default function CoverageTable({ team, genTypes }) {
  const teamWithMoves = team.map(slot => slot?.pokemon ? {
    name: slot.pokemon.name,
    sprite: slot.pokemon.sprite,
    types: slot.pokemon.types,
    moves: slot.selectedMoves || [],
  } : null).filter(Boolean);

  if (teamWithMoves.length === 0) {
    return <div style={{ color: "#555", fontSize: 13, padding: 20, textAlign: "center" }}>
      Sélectionne des Pokémon et leurs attaques pour voir la couverture offensive.
    </div>;
  }

  const teamCoverage = computeTeamCoverage(team.map(s => s?.pokemon ? {
    moves: s.selectedMoves || [],
  } : null).filter(Boolean), genTypes);

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ padding: "6px 10px", textAlign: "left", color: "#666", fontWeight: 600, fontSize: 10, textTransform: "uppercase", minWidth: 90 }}>
              Défenseur
            </th>
            {teamWithMoves.map((m, i) => (
              <th key={i} style={{ padding: "4px 6px", textAlign: "center", minWidth: 52 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                  {m.sprite && (
                    <img src={m.sprite} alt={m.name} width={28} height={28}
                      style={{ imageRendering: "pixelated" }} />
                  )}
                  <span style={{ fontSize: 9, color: "#888", textTransform: "capitalize" }}>
                    {m.name.length > 8 ? m.name.slice(0, 7) + "…" : m.name}
                  </span>
                </div>
              </th>
            ))}
            <th style={{ padding: "4px 8px", textAlign: "center", color: "#a259f7", fontWeight: 700, fontSize: 11 }}>
              Équipe
            </th>
          </tr>
        </thead>
        <tbody>
          {genTypes.map((type, i) => {
            const memberCoverages = teamWithMoves.map(m =>
              computeMovesetCoverage(m.moves, genTypes)[type] || 0
            );
            const bestTeam = teamCoverage[type] || 0;

            return (
              <tr key={type} style={{ background: i % 2 === 0 ? "#0d0d1a" : "#12122a" }}>
                <td style={{ padding: "6px 10px" }}>
                  <span style={{
                    background: TYPE_COLORS[type], color: "#fff",
                    fontSize: 10, fontWeight: 700, padding: "2px 7px",
                    borderRadius: 3, textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    {TYPE_NAMES_FR[type]}
                  </span>
                </td>
                {memberCoverages.map((val, mi) => (
                  <td key={mi} style={{ padding: "5px 6px", textAlign: "center" }}>
                    <EffCell value={val} />
                  </td>
                ))}
                <td style={{ padding: "5px 8px", textAlign: "center" }}>
                  <EffCell value={bestTeam} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ fontSize: 11, color: "#666", marginTop: 10 }}>
        Affiche le meilleur modificateur disponible par Pokémon contre chaque type défensif.
        <span style={{ color: "#a259f7", marginLeft: 8 }}>Équipe</span> = meilleur de l'équipe.
      </div>
    </div>
  );
}

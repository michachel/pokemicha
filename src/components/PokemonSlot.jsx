import { useState, useRef, useEffect } from "react";
import TypeBadge from "./TypeBadge";
import { usePokemonSearch } from "../hooks/usePokeAPI";
import { TYPE_COLORS } from "../data/gameData";

export default function PokemonSlot({ slot, maxDex, versionGroup, onUpdate, onRemove }) {
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showMoves, setShowMoves] = useState(false);
  const { results, loading: searchLoading } = usePokemonSearch(query, maxDex);
  const inputRef = useRef(null);

  const poke = slot?.pokemon;

  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  function selectPokemon(result) {
    onUpdate({ type: "setPokemon", pokemonId: result.id });
    setQuery("");
    setShowSearch(false);
  }

  function setAbility(ability) {
    onUpdate({ type: "setAbility", ability });
  }

  function toggleMove(move) {
    const current = slot?.selectedMoves || [];
    const exists = current.find(m => m.name === move.name);
    if (exists) {
      onUpdate({ type: "setMoves", moves: current.filter(m => m.name !== move.name) });
    } else if (current.length < 4) {
      onUpdate({ type: "setMoves", moves: [...current, move] });
    }
  }

  const selectedMoves = slot?.selectedMoves || [];
  const mainColor = poke?.types?.[0] ? TYPE_COLORS[poke.types[0]] : "#444";

  return (
    <div style={{
      background: "#1a1a2e",
      border: `2px solid ${poke ? mainColor + "66" : "#333"}`,
      borderRadius: 12,
      padding: 16,
      position: "relative",
      transition: "border-color 0.2s",
    }}>
      {/* Empty state */}
      {!poke && !showSearch && (
        <button
          onClick={() => setShowSearch(true)}
          style={{
            width: "100%", height: 120, background: "transparent",
            border: "2px dashed #444", borderRadius: 8, cursor: "pointer",
            color: "#666", fontSize: 13, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <span style={{ fontSize: 28 }}>＋</span>
          <span>Choisir un Pokémon</span>
        </button>
      )}

      {/* Search bar */}
      {showSearch && (
        <div style={{ position: "relative" }}>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Escape" && setShowSearch(false)}
            placeholder="Nom du Pokémon..."
            style={{
              width: "100%", padding: "8px 12px", background: "#0d0d1a",
              border: "2px solid #4CAF50", borderRadius: 6, color: "#fff",
              fontSize: 14, boxSizing: "border-box",
            }}
          />
          {searchLoading && <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>Recherche...</div>}
          {results.length > 0 && (
            <div style={{
              position: "absolute", top: "110%", left: 0, right: 0, zIndex: 100,
              background: "#0d0d1a", border: "1px solid #333", borderRadius: 6,
              maxHeight: 200, overflowY: "auto",
            }}>
              {results.map(r => (
                <button
                  key={r.id}
                  onClick={() => selectPokemon(r)}
                  style={{
                    width: "100%", padding: "8px 12px", background: "transparent",
                    border: "none", borderBottom: "1px solid #222", cursor: "pointer",
                    color: "#ddd", textAlign: "left", fontSize: 13,
                    display: "flex", alignItems: "center", gap: 8,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1a1a3e"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${r.id}.png`}
                    alt=""
                    width={28}
                    height={28}
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span style={{ textTransform: "capitalize" }}>#{r.id} {r.name}</span>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowSearch(false)}
            style={{ marginTop: 4, fontSize: 11, color: "#888", background: "none", border: "none", cursor: "pointer" }}
          >Annuler</button>
        </div>
      )}

      {/* Pokemon card */}
      {poke && (
        <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            {poke.sprite && (
              <img
                src={poke.sprite}
                alt={poke.name}
                width={56}
                height={56}
                style={{ imageRendering: "pixelated", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
              />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", textTransform: "capitalize", marginBottom: 4 }}>
                {poke.name}
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {poke.types.map(t => <TypeBadge key={t} type={t} size="xs" />)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setShowSearch(true)}
                title="Changer"
                style={{ background: "#333", border: "none", borderRadius: 4, padding: "4px 7px", cursor: "pointer", color: "#aaa", fontSize: 13 }}
              >✎</button>
              <button
                onClick={onRemove}
                title="Retirer"
                style={{ background: "#333", border: "none", borderRadius: 4, padding: "4px 7px", cursor: "pointer", color: "#e74c3c", fontSize: 13 }}
              >✕</button>
            </div>
          </div>

          {/* Ability selector */}
          {poke.abilities?.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: "#888", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Talent</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {poke.abilities.map(a => (
                  <button
                    key={a.name}
                    onClick={() => setAbility(a)}
                    style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 4, cursor: "pointer",
                      border: `1px solid ${slot?.selectedAbility?.name === a.name ? mainColor : "#444"}`,
                      background: slot?.selectedAbility?.name === a.name ? mainColor + "44" : "#222",
                      color: slot?.selectedAbility?.name === a.name ? "#fff" : "#aaa",
                    }}
                  >
                    {a.nameFr}{a.isHidden ? " ✦" : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Moves section */}
          <div>
            <button
              onClick={() => setShowMoves(!showMoves)}
              style={{
                fontSize: 10, color: "#888", background: "none", border: "none",
                cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.08em",
                padding: 0, marginBottom: 6, display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <span>Attaques ({selectedMoves.length}/4)</span>
              <span>{showMoves ? "▲" : "▼"}</span>
            </button>

            {/* Selected moves chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: showMoves ? 8 : 0 }}>
              {selectedMoves.map(m => (
                <span
                  key={m.name}
                  onClick={() => toggleMove(m)}
                  style={{
                    fontSize: 10, padding: "2px 7px", borderRadius: 4, cursor: "pointer",
                    background: TYPE_COLORS[m.type] + "88", color: "#fff",
                    border: `1px solid ${TYPE_COLORS[m.type]}`,
                  }}
                  title="Cliquer pour retirer"
                >
                  {m.nameFr} ✕
                </span>
              ))}
              {selectedMoves.length === 0 && !showMoves && (
                <span style={{ fontSize: 10, color: "#555" }}>Aucune attaque sélectionnée</span>
              )}
            </div>

            {/* Move picker */}
            {showMoves && poke.moves?.length > 0 && (
              <div style={{
                maxHeight: 160, overflowY: "auto", background: "#0d0d1a",
                borderRadius: 6, border: "1px solid #333", padding: "4px 0",
              }}>
                {poke.moves
                  .filter(m => m.power && m.power > 0)
                  .sort((a, b) => a.nameFr.localeCompare(b.nameFr))
                  .map(m => {
                    const selected = selectedMoves.find(s => s.name === m.name);
                    return (
                      <button
                        key={m.name}
                        onClick={() => toggleMove(m)}
                        disabled={!selected && selectedMoves.length >= 4}
                        style={{
                          width: "100%", padding: "5px 10px", background: selected ? TYPE_COLORS[m.type] + "33" : "transparent",
                          border: "none", borderBottom: "1px solid #1a1a2e", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 8, textAlign: "left",
                          opacity: !selected && selectedMoves.length >= 4 ? 0.4 : 1,
                        }}
                      >
                        <TypeBadge type={m.type} size="xs" />
                        <span style={{ flex: 1, fontSize: 11, color: "#ccc" }}>{m.nameFr}</span>
                        {m.power && <span style={{ fontSize: 10, color: "#666" }}>{m.power}</span>}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

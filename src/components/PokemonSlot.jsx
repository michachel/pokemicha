import { useState, useRef, useEffect } from "react";
import TypeBadge from "./TypeBadge";
import { useVersionPokedexes, usePokedexPokemon } from "../hooks/usePokeAPI";
import { TYPE_COLORS } from "../data/gameData";

export default function PokemonSlot({ slot, maxDex, versionGroup, onUpdate, onRemove }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showMoves, setShowMoves] = useState(false);
  
  // Récupération des différents Pokédex du jeu (ex: Ultra Soleil/Lune)
  const { pokedexes, loading: pexLoading } = useVersionPokedexes(versionGroup);
  const [selectedPexId, setSelectedPexId] = useState(null);

  // Sélectionner par défaut le premier Pokédex de la liste dès qu'il est chargé
  useEffect(() => {
    if (pokedexes.length > 0 && !selectedPexId) {
      setSelectedPexId(pokedexes[0].id);
    }
  }, [pokedexes, selectedPexId]);

  const { pokemon: pexPokemon, loading: listLoading } = usePokedexPokemon(selectedPexId);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const poke = slot?.pokemon;

  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  function selectPokemon(id) {
    onUpdate({ type: "setPokemon", pokemonId: id });
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

  // Filtrage par texte (nom français ou numéro)
  const filteredGridList = pexPokemon.filter(p => 
    p.nameFr.toLowerCase().includes(query.toLowerCase()) || 
    p.id.toString() === query || 
    p.dexNumber.toString() === query
  );

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

      {/* Search & Pokedex modal/drawer view */}
      {showSearch && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "#aaa", fontWeight: 600, textTransform: "uppercase" }}>Sélection du Pokémon</span>
            <button
              onClick={() => setShowSearch(false)}
              style={{ fontSize: 11, color: "#e74c3c", background: "none", border: "none", cursor: "pointer" }}
            >Fermer ✕</button>
          </div>

          {/* Choix du sous-pokedex si plusieurs existent (ex: Alola, Îles, National) */}
          {pokedexes.length > 1 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {pokedexes.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPexId(p.id)}
                  style={{
                    fontSize: 10, padding: "4px 8px", borderRadius: 4, cursor: "pointer",
                    background: selectedPexId === p.id ? "#4CAF50" : "#16162c",
                    color: selectedPexId === p.id ? "#fff" : "#aaa",
                    border: "1px solid #333",
                  }}
                >
                  {p.nameFr}
                </button>
              ))}
            </div>
          )}

          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Filtrer par nom (FR) ou n°..."
            style={{
              width: "100%", padding: "8px 12px", background: "#0d0d1a",
              border: "2px solid #4CAF50", borderRadius: 6, color: "#fff",
              fontSize: 14, boxSizing: "border-box",
            }}
          />
          
          {/* Grille de sprites responsive */}
          <div style={{
            background: "#0d0d1a", border: "1px solid #333", borderRadius: 6,
            height: 240, overflowY: "auto", padding: 8,
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 6
          }}>
            {(pexLoading || listLoading) && (
              <div style={{ color: "#888", fontSize: 12, gridColumn: "1 / -1", textAlign: "center", margin: "auto" }}>
                Chargement du Pokédex régional...
              </div>
            )}
            
            {!listLoading && filteredGridList.map(p => (
              <button
                key={p.id}
                onClick={() => selectPokemon(p.id)}
                title={`#${p.dexNumber} ${p.nameFr}`}
                style={{
                  background: "#16162c", border: "1px solid #2a2a4a", borderRadius: 6,
                  padding: "6px 4px", cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "space-between", transition: "all 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#4CAF50"; e.currentTarget.style.background = "#222244"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a4a"; e.currentTarget.style.background = "#16162c"; }}
              >
                <span style={{ fontSize: 9, color: "#666" }}>#{p.dexNumber}</span>
                <img
                  src={p.sprite}
                  alt={p.nameFr}
                  width={44}
                  height={44}
                  style={{ imageRendering: "pixelated" }}
                />
                <span style={{ fontSize: 10, color: "#ddd", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                  {p.nameFr}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reste de la carte Pokémon (identique à avant : affichage sprite, talents, attaques...) */}
      {poke && !showSearch && (
        // ... (ton affichage habituel du slot validé)
        <div>...</div>
      )}
    </div>
  );
}
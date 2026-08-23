import { useState, useEffect, useCallback } from "react";
import { GENERATIONS, TYPES_BY_GEN } from "./data/gameData";
import { usePokemonDetails } from "./hooks/usePokeAPI";
import PokemonSlot from "./components/PokemonSlot";
import WeaknessTable from "./components/WeaknessTable";
import CoverageTable from "./components/CoverageTable";

const EMPTY_SLOT = { pokemon: null, selectedAbility: null, selectedMoves: [] };
const INITIAL_TEAM = Array(6).fill(null).map(() => ({ ...EMPTY_SLOT }));

function LoadingSpinner({ text = "Chargement..." }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#888", fontSize: 12, padding: "8px 0" }}>
      <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span>
      {text}
    </div>
  );
}

export default function App() {
  const [selectedGen, setSelectedGen] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [activeTab, setActiveTab] = useState("team");
  const [loadingSlots, setLoadingSlots] = useState({});

  const { fetchDetails } = usePokemonDetails(null, selectedGame?.pokeapi);

  const genTypes = selectedGen ? TYPES_BY_GEN[selectedGen.id] || [] : [];

  function selectGen(gen) {
    setSelectedGen(gen);
    setSelectedGame(null);
    setTeam(INITIAL_TEAM);
  }

  function selectGame(game) {
    setSelectedGame(game);
    setTeam(INITIAL_TEAM);
  }

  const updateSlot = useCallback(async (index, action) => {
    if (action.type === "setPokemon") {
      setLoadingSlots(prev => ({ ...prev, [index]: true }));
      const details = await fetchDetails(action.pokemonId);
      setTeam(prev => {
        const next = [...prev];
        next[index] = { ...EMPTY_SLOT, pokemon: details };
        return next;
      });
      setLoadingSlots(prev => ({ ...prev, [index]: false }));
    } else if (action.type === "setAbility") {
      setTeam(prev => {
        const next = [...prev];
        next[index] = { ...next[index], selectedAbility: action.ability };
        return next;
      });
    } else if (action.type === "setMoves") {
      setTeam(prev => {
        const next = [...prev];
        next[index] = { ...next[index], selectedMoves: action.moves };
        return next;
      });
    }
  }, [fetchDetails]);

  function removeSlot(index) {
    setTeam(prev => {
      const next = [...prev];
      next[index] = { ...EMPTY_SLOT };
      return next;
    });
  }

  const filledCount = team.filter(s => s?.pokemon).length;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#e0e0e0", fontFamily: "'Inter', sans-serif" }}>
      {/* Top bar */}
      <header style={{
        background: "#0d0d24",
        borderBottom: "1px solid #1a1a3e",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        height: 56,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <span style={{
          fontFamily: "'Press Start 2P'",
          fontSize: 13,
          color: "#f8d030",
          textShadow: "0 0 12px #f8d03088",
          letterSpacing: 1,
        }}>
          PokéBuilder
        </span>
        {selectedGame && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderLeft: "1px solid #333", paddingLeft: 16 }}>
            {selectedGame.logo && (
              <img
                src={selectedGame.logo}
                alt=""
                width={28}
                height={28}
                style={{ objectFit: "contain", imageRendering: "pixelated" }}
              />
            )}
            <span style={{ fontSize: 12, color: "#888" }}>
              {selectedGen?.name} · {selectedGame.name}
            </span>
          </div>
        )}
        {selectedGame && (
          <button
            onClick={() => { setSelectedGen(null); setSelectedGame(null); setTeam(INITIAL_TEAM); }}
            style={{ marginLeft: "auto", background: "none", border: "1px solid #333", borderRadius: 6,
              padding: "4px 12px", color: "#888", cursor: "pointer", fontSize: 12 }}
          >
            Changer de jeu
          </button>
        )}
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>

        {/* Game selector */}
        {!selectedGame && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 36, padding: "0 16px" }}>
              <h1 style={{
                fontFamily: "'Press Start 2P'", fontSize: "clamp(16px, 4vw, 24px)", color: "#f8d030",
                textShadow: "0 0 20px #f8d03066", marginBottom: 12,
              }}>
                PokéBuilder
              </h1>
              <p style={{ color: "#888", fontSize: "clamp(13px, 2vw, 15px)", maxWidth: 500, margin: "0 auto" }}>
                Choisis ta version pour commencer à composer ton équipe, analyser tes faiblesses et optimiser ta couverture offensive.
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 20,
              paddingBottom: 40
            }}>
              {GENERATIONS.map(gen => (
                <div key={gen.id} style={{
                  background: "#12122a",
                  border: `1px solid ${gen.color}33`,
                  borderRadius: 14,
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  transition: "border-color 0.2s",
                }}>
                  {/* Titre de la génération */}
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: gen.color,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    display: "flex", alignItems: "center", gap: 8,
                    borderBottom: `1px solid ${gen.color}22`,
                    paddingBottom: 10
                  }}>
                    <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: gen.color, boxShadow: `0 0 8px ${gen.color}` }} />
                    {gen.name}
                  </div>

                  {/* Boutons des jeux de la génération */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                    {gen.games.map(game => (
                      <button
                        key={game.id}
                        onClick={() => { selectGen(gen); selectGame(game); }}
                        style={{
                          padding: "12px 16px",
                          background: "#1a1a38",
                          border: `1px solid ${gen.color}44`,
                          borderRadius: 10,
                          cursor: "pointer",
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          transition: "all 0.2s ease",
                          textAlign: "left",
                          width: "100%",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = gen.color;
                          e.currentTarget.style.background = gen.color + "22";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = gen.color + "44";
                          e.currentTarget.style.background = "#1a1a38";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {game.logo && (
                          <div style={{
                            width: 36, height: 36, background: "#0f0f22", borderRadius: 8,
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            border: "1px solid #2a2a4a"
                          }}>
                            <img
                              src={game.logo}
                              alt=""
                              width={26}
                              height={26}
                              style={{ objectFit: "contain", imageRendering: "pixelated" }}
                            />
                          </div>
                        )}
                        <span style={{ flex: 1 }}>{game.name}</span>
                        <span style={{ color: gen.color, fontSize: 16, opacity: 0.7 }}>→</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main builder */}
        {selectedGame && (
          <>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 24, borderBottom: "1px solid #1a1a3e" }}>
              {[
                { key: "team", label: `Équipe (${filledCount}/6)` },
                { key: "weaknesses", label: "Faiblesses" },
                { key: "coverage", label: "Couverture offensive" },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "10px 20px", background: "none",
                    border: "none", borderBottom: activeTab === tab.key ? "2px solid #f8d030" : "2px solid transparent",
                    color: activeTab === tab.key ? "#f8d030" : "#666",
                    cursor: "pointer", fontSize: 13, fontWeight: activeTab === tab.key ? 700 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Team tab */}
            {activeTab === "team" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {team.map((slot, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    {loadingSlots[i] && (
                      <div style={{
                        position: "absolute", inset: 0, background: "#0a0a1a99",
                        borderRadius: 12, display: "flex", alignItems: "center",
                        justifyContent: "center", zIndex: 10,
                      }}>
                        <LoadingSpinner text="Chargement..." />
                      </div>
                    )}
                    <PokemonSlot
                      slot={slot}
                      maxDex={selectedGame.maxDex}
                      versionGroup={selectedGame.pokeapi}
                      onUpdate={(action) => updateSlot(i, action)}
                      onRemove={() => removeSlot(i)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Weaknesses tab */}
            {activeTab === "weaknesses" && (
              <div style={{ background: "#0d0d24", borderRadius: 12, padding: 20, border: "1px solid #1a1a3e" }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  Analyse des faiblesses
                </h2>
                <p style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>
                  Basée sur les types et talents sélectionnés pour chaque Pokémon.
                  Les types sont triés du plus problématique au moins problématique.
                </p>
                {filledCount === 0 ? (
                  <div style={{ color: "#555", fontSize: 13, padding: "40px 0", textAlign: "center" }}>
                    Ajoute au moins un Pokémon à ton équipe pour voir l'analyse.
                  </div>
                ) : (
                  <WeaknessTable team={team} genTypes={genTypes} />
                )}
              </div>
            )}

            {/* Coverage tab */}
            {activeTab === "coverage" && (
              <div style={{ background: "#0d0d24", borderRadius: 12, padding: 20, border: "1px solid #1a1a3e" }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  Couverture offensive
                </h2>
                <p style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>
                  Efficacité offensive de chaque Pokémon contre les types défensifs, basée sur les attaques sélectionnées.
                </p>
                <CoverageTable team={team} genTypes={genTypes} />
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a1a; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
    </div>
  );
}
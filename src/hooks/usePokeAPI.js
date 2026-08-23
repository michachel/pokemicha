import { useState, useEffect, useCallback, useRef } from "react";

const API = "https://pokeapi.co/api/v2";
const cache = {};

async function fetchCached(url) {
  if (cache[url]) return cache[url];
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  cache[url] = data;
  return data;
}

// Fetch list of pokemon available in a specific game version
export function useVersionPokemon(versionId, maxDex) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!versionId) return;
    setLoading(true);
    setError(null);

    // Use the pokedex endpoint for the version's regional dex
    // Fall back to national dex up to maxDex
    const load = async () => {
      try {
        // Try to get version-specific pokemon list
        const versionData = await fetchCached(`${API}/version/${versionId}`);
        const versionGroupUrl = versionData.version_group.url;
        const vgData = await fetchCached(versionGroupUrl);

        // Get all pokedexes for this version group
        const dexUrls = vgData.pokedexes.map(d => d.url);
        const allEntries = new Map();

        await Promise.all(dexUrls.map(async (url) => {
          const dex = await fetchCached(url);
          for (const entry of dex.pokemon_entries) {
            const num = entry.entry_number;
            if (num <= maxDex) {
              allEntries.set(num, {
                id: num,
                name: entry.pokemon_species.name,
                displayName: entry.pokemon_species.name,
              });
            }
          }
        }));

        const sorted = [...allEntries.values()].sort((a, b) => a.id - b.id);
        setPokemon(sorted);
      } catch (e) {
        // Fallback: just return all up to maxDex
        const fallback = [];
        for (let i = 1; i <= Math.min(maxDex, 151); i++) {
          fallback.push({ id: i, name: `pokemon-${i}`, displayName: `#${i}` });
        }
        setPokemon(fallback);
        setError("Impossible de charger la liste, affichage partiel.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [versionId, maxDex]);

  return { pokemon, loading, error };
}

// Search pokemon by name (with autocomplete)
export function usePokemonSearch(query, maxDex) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return; }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Fetch all species names (cached after first call)
        const all = await fetchCached(`${API}/pokemon?limit=10000`);
        const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const filtered = all.results
          .map((p, i) => ({ ...p, id: i + 1 }))
          .filter(p => {
            const name = p.name.toLowerCase();
            return name.includes(q) && (parseInt(p.url.split("/").filter(Boolean).pop()) <= maxDex);
          })
          .slice(0, 20)
          .map(p => ({
            id: parseInt(p.url.split("/").filter(Boolean).pop()),
            name: p.name,
          }));
        setResults(filtered);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query, maxDex]);

  return { results, loading };
}

// Fetch full pokemon details (types, abilities, sprite, moves)
export function usePokemonDetails(pokemonId, versionGroup) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDetails = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    try {
      const poke = await fetchCached(`${API}/pokemon/${id}`);

      // Get French name from species
      let frName = poke.name;
      try {
        const species = await fetchCached(`${API}/pokemon-species/${id}`);
        const frEntry = species.names.find(n => n.language.name === "fr");
        if (frEntry) frName = frEntry.name;
      } catch (_) {}

      // Get types
      const types = poke.types.map(t => t.type.name);

      // Get abilities with French names
      const abilities = await Promise.all(
        poke.abilities.map(async (a) => {
          let frAbilityName = a.ability.name;
          try {
            const abilityData = await fetchCached(a.ability.url);
            const frEntry = abilityData.names.find(n => n.language.name === "fr");
            if (frEntry) frAbilityName = frEntry.name;
          } catch (_) {}
          return {
            name: a.ability.name,
            nameFr: frAbilityName,
            isHidden: a.is_hidden,
          };
        })
      );

      // Get moves available in this version group
      const vgMoves = poke.moves
        .filter(m => m.version_group_details.some(
          vgd => !versionGroup || vgd.version_group.name === versionGroup
        ))
        .slice(0, 100); // Limit for perf

      const moves = await Promise.all(
        vgMoves.slice(0, 40).map(async (m) => {
          let moveType = "normal";
          let frMoveName = m.move.name;
          let power = null;
          let category = "physical";
          try {
            const md = await fetchCached(m.move.url);
            moveType = md.type.name;
            power = md.power;
            category = md.damage_class?.name || "physical";
            const frEntry = md.names.find(n => n.language.name === "fr");
            if (frEntry) frMoveName = frEntry.name;
          } catch (_) {}
          return { name: m.move.name, nameFr: frMoveName, type: moveType, power, category };
        })
      );

      return {
        id,
        name: frName,
        nameEn: poke.name,
        types,
        abilities,
        sprite: poke.sprites.front_default,
        spriteShiny: poke.sprites.front_shiny,
        moves: moves.filter(m => m.type !== "normal" || m.name !== "normal"),
        stats: poke.stats.reduce((acc, s) => {
          acc[s.stat.name] = s.base_stat;
          return acc;
        }, {}),
      };
    } catch (e) {
      return null;
    } finally {
      setLoading(false);
    }
  }, [versionGroup]);

  useEffect(() => {
    if (pokemonId) fetchDetails(pokemonId).then(setData);
    else setData(null);
  }, [pokemonId, fetchDetails]);

  return { data, loading, fetchDetails };
}

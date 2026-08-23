import { useState, useEffect, useCallback } from "react";

const apiCache = new Map();

async function cachedFetch(url) {
  if (apiCache.has(url)) return apiCache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
  const data = await res.json();
  apiCache.set(url, data);
  return data;
}

// Récupère dynamiquement la liste officielle des Pokédex associés au jeu
export function useVersionPokedexes(versionGroup) {
  const [pokedexes, setPokedexes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!versionGroup) return;
    let active = true;

    async function load() {
      setLoading(true);
      try {
        // 1. On interroge directement le groupe de versions pour obtenir ses Pokédex officiels
        const vgData = await cachedFetch(`https://pokeapi.co/api/v2/version-group/${versionGroup}`);
        const pexLinks = vgData.pokedexes || [];

        // 2. On récupère les détails de chaque Pokédex (nom français, id)
        const detailedPex = await Promise.all(
          pexLinks.map(async pex => {
            try {
              const pData = await cachedFetch(pex.url);
              const nameFr = pData.names.find(n => n.language.name === "fr")?.name || pData.name;
              return {
                name: pData.name,
                nameFr: nameFr,
                id: pData.id,
              };
            } catch (e) {
              return null;
            }
          })
        );

        if (active) {
          // On filtre les nuls et on place généralement le Pokédex National en dernier s'il est présent
          const validPex = detailedPex.filter(Boolean);
          validPex.sort((a, b) => {
            if (a.name.includes("national")) return 1;
            if (b.name.includes("national")) return -1;
            return 0;
          });

          setPokedexes(validPex);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur chargement pokedex dynamiques", err);
        // Fallback sur le Pokédex national (id: 1) en cas d'erreur réseau
        if (active) {
          setPokedexes([{ id: 1, name: "national", nameFr: "National" }]);
          setLoading(false);
        }
      }
    }

    load();
    return () => { active = false; };
  }, [versionGroup]);

  return { pokedexes, loading };
}

// Récupère la liste triée et complète des Pokémon d'un Pokédex avec leurs vrais numéros de version
export function usePokedexPokemon(pokedexId) {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pokedexId) return;
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const pexData = await cachedFetch(`https://pokeapi.co/api/v2/pokedex/${pokedexId}`);
        const entries = pexData.pokemon_entries || [];

        // Pour chaque entrée, on récupère l'espèce et le nom en français
        const list = await Promise.all(
          entries.map(async entry => {
            const speciesUrl = entry.pokemon_species.url;
            const speciesId = speciesUrl.split("/").filter(Boolean).pop();
            
            const speciesData = await cachedFetch(speciesUrl);
            const nameFr = speciesData.names.find(n => n.language.name === "fr")?.name || entry.pokemon_species.name;

            return {
              id: parseInt(speciesId, 10),
              dexNumber: entry.entry_number, // Numéro officiel dans le Pokédex de la version
              name: entry.pokemon_species.name,
              nameFr: nameFr,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`
            };
          })
        );

        // Tri strict et obligatoire par le numéro officiel du Pokédex de la version
        list.sort((a, b) => a.dexNumber - b.dexNumber);

        if (active) {
          setPokemon(list);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur chargement pokemons du pokedex", err);
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [pokedexId]);

  return { pokemon, loading };
}

// Hook de détails d'un Pokémon (avec traduction française des talents et attaques)
export function usePokemonDetails() {
  const fetchDetails = useCallback(async (pokemonIdOrName) => {
    try {
      const data = await cachedFetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIdOrName}`);
      const species = await cachedFetch(data.species.url);
      const nameFr = species.names.find(n => n.language.name === "fr")?.name || data.name;

      const types = data.types.sort((a, b) => a.slot - b.slot).map(t => t.type.name);

      const abilities = await Promise.all(
        data.abilities.map(async ab => {
          const abData = await cachedFetch(ab.ability.url);
          const abNameFr = abData.names.find(n => n.language.name === "fr")?.name || ab.ability.name;
          return {
            name: ab.ability.name,
            nameFr: abNameFr,
            isHidden: ab.is_hidden,
          };
        })
      );

      const moves = await Promise.all(
        data.moves.map(async m => {
          const moveData = await cachedFetch(m.move.url);
          const moveNameFr = moveData.names.find(n => n.language.name === "fr")?.name || m.move.name;
          return {
            name: m.move.name,
            nameFr: moveNameFr,
            type: moveData.type.name,
            power: moveData.power,
            accuracy: moveData.accuracy,
            damageClass: moveData.damage_class.name,
          };
        })
      );

      return {
        id: data.id,
        name: nameFr,
        speciesName: data.name,
        sprite: data.sprites.front_default || data.sprites.other?.["official-artwork"]?.front_default,
        types,
        abilities,
        moves,
      };
    } catch (err) {
      console.error("Erreur details pokemon", err);
      return null;
    }
  }, []);

  return { fetchDetails };
}
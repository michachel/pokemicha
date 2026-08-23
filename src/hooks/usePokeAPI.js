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

// Correspondance propre entre les identifiants de jeux de ton app et les Pokédex officiels de la PokéAPI
const GAME_TO_POKEDEX = {
  "red": [2, 1],          // Kanto / National
  "yellow": [2, 1],
  "gold": [3, 1],         // Johto / National
  "crystal": [3, 1],
  "ruby": [4, 1],         // Hoenn / National
  "emerald": [4, 1],
  "firered": [2, 1],      // Kanto / National
  "diamond": [5, 1],      // Sinnoh / National
  "platinum": [6, 1],     // Extended Sinnoh
  "heartgold": [3, 1],    // Johto
  "black": [8, 1],        // Unova / National
  "black-2": [9, 1],      // Updated Unova
  "x": [12, 13, 14, 1],   // Kalos (Central, Coastal, Mountain) + National
  "omega-ruby": [4, 1],   // Hoenn (ORAS) / National
  "sun": [21, 1],         // Alola (SM)
  "ultra-sun": [25, 1],   // Alola (USUM)
  "sword": [27, 28, 1],   // Galar, Isle of Armor, Crown Tundra
  "brilliant-diamond": [30, 1],
  "legends-arceus": [31, 1], // Hisui
  "scarlet": [32, 1],     // Paldea
};

// Récupère la liste des Pokédex disponibles pour un jeu donné
export function useVersionPokedexes(versionGroup) {
  const [pokedexes, setPokedexes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!versionGroup) return;
    let active = true;

    async function load() {
      setLoading(true);
      try {
        // On récupère la liste des IDs de Pokedex associés à ce jeu, ou le Pokedex National par défaut (id: 1)
        const pexIds = GAME_TO_POKEDEX[versionGroup] || [1];

        const detailedPex = await Promise.all(
          pexIds.map(async id => {
            try {
              const pData = await cachedFetch(`https://pokeapi.co/api/v2/pokedex/${id}`);
              const nameFr = pData.names.find(n => n.language.name === "fr")?.name || pData.name;
              return {
                name: pData.name,
                nameFr: nameFr,
                id: pData.id,
                pokemonEntries: pData.pokemon_entries
              };
            } catch (e) {
              return null;
            }
          })
        );

        if (active) {
          setPokedexes(detailedPex.filter(Boolean));
          setLoading(false);
        }
      } catch (err) {
        console.error("Erreur chargement pokedex", err);
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [versionGroup]);

  return { pokedexes, loading };
}

// Récupère la liste des Pokémon d'un Pokédex spécifique avec noms en français et sprites
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
        const entries = pexData.pokemon_entries;

        // Pour chaque entrée, on extrait l'ID national et on va chercher le nom français via l'espèce
        const list = await Promise.all(
          entries.map(async entry => {
            const speciesUrl = entry.pokemon_species.url;
            const speciesId = speciesUrl.split("/").filter(Boolean).pop();
            
            const speciesData = await cachedFetch(speciesUrl);
            const nameFr = speciesData.names.find(n => n.language.name === "fr")?.name || entry.pokemon_species.name;

            return {
              id: parseInt(speciesId, 10),
              dexNumber: entry.entry_number,
              name: entry.pokemon_species.name,
              nameFr: nameFr,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`
            };
          })
        );

        // Tri par numéro dans le Pokédex de la version
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
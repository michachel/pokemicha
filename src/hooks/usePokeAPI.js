import { useState, useEffect, useCallback } from "react";
import { ABILITY_OVERRIDES, ABILITY_NAMES_FR, TYPE_NAMES_FR } from "../data/gameData";

// Cache global pour éviter les requêtes en double
const apiCache = new Map();

async function cachedFetch(url) {
  if (apiCache.has(url)) return apiCache.get(url);
  const res = await fetch(url);
  const data = await res.json();
  apiCache.set(url, data);
  return data;
}

// Récupère les Pokédex disponibles pour un jeu donné (ex: ultra-sun-ultra-moon)
export function useVersionPokedexes(versionGroup) {
  const [pokedexes, setPokedexes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!versionGroup) return;
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const vgData = await cachedFetch(`https://pokeapi.co/api/v2/version-group/${versionGroup}`);
        // Un version-group possède une ou plusieurs pokedex (ex: alola-usum, national...)
        const pexList = vgData.pokedexes || [];
        
        // On récupère les détails de chaque Pokedex pour avoir son nom en français
        const detailedPex = await Promise.all(
          pexList.map(async p => {
            const pData = await cachedFetch(p.url);
            const nameFr = pData.names.find(n => n.language.name === "fr")?.name || pData.name;
            return {
              name: pData.name,
              nameFr: nameFr,
              id: pData.id,
              // Pokémon entries avec leur numéro de Pokédex local et l'URL de l'espèce
              pokemonEntries: pData.pokemon_entries
            };
          })
        );

        if (active) {
          setPokedexes(detailedPex);
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
        // pokemon_entries contient { entry_number, pokemon_species: { name, url } }
        const entries = pexData.pokemon_entries;

        // Pour chaque entrée, on extrait l'ID national depuis l'URL de l'espèce
        const list = await Promise.all(
          entries.map(async entry => {
            const speciesUrl = entry.pokemon_species.url;
            const speciesId = speciesUrl.split("/").filter(Boolean).pop();
            
            // On récupère les données de l'espèce pour le nom en français
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

// Hook de recherche textuelle globale (inchangé ou adapté)
export function usePokemonSearch(query, maxDex) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // ... (Garde ton implémentation existante pour la recherche par input)
  return { results, loading };
}

// Hook de détails d'un Pokémon (avec traduction française des talents et attaques)
export function usePokemonDetails() {
  const fetchDetails = useCallback(async (pokemonIdOrName) => {
    try {
      const data = await cachedFetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIdOrName}`);
      const species = await cachedFetch(data.species.url);
      const nameFr = species.names.find(n => n.language.name === "fr")?.name || data.name;

      // Traduction des types
      const types = data.types.sort((a, b) => a.slot - b.slot).map(t => t.type.name);

      // Talents
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

      // Attaques
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
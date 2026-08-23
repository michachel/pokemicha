// ── Game versions by generation with official logos ────────────────────────
export const GENERATIONS = [
  {
    id: 1, name: "Génération I", color: "#E74C3C",
    games: [
      { id: "red-blue", name: "Rouge / Bleu", pokeapi: "red", maxDex: 151, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" },
      { id: "yellow", name: "Jaune", pokeapi: "yellow", maxDex: 151, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" },
    ]
  },
  {
    id: 2, name: "Génération II", color: "#F39C12",
    games: [
      { id: "gold-silver", name: "Or / Argent", pokeapi: "gold", maxDex: 251, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png" },
      { id: "crystal", name: "Cristal", pokeapi: "crystal", maxDex: 251, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/245.png" },
    ]
  },
  {
    id: 3, name: "Génération III", color: "#27AE60",
    games: [
      { id: "ruby-sapphire", name: "Rubis / Saphir", pokeapi: "ruby", maxDex: 386, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/383.png" },
      { id: "emerald", name: "Émeraude", pokeapi: "emerald", maxDex: 386, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png" },
      { id: "firered-leafgreen", name: "Rouge Feu / Vert Feuille", pokeapi: "firered", maxDex: 386, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png" },
    ]
  },
  {
    id: 4, name: "Génération IV", color: "#2980B9",
    games: [
      { id: "diamond-pearl", name: "Diamant / Perle", pokeapi: "diamond", maxDex: 493, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/483.png" },
      { id: "platinum", name: "Platine", pokeapi: "platinum", maxDex: 493, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/487.png" },
      { id: "heartgold-soulsilver", name: "Or HeartGold / Argent SoulSilver", pokeapi: "heartgold", maxDex: 493, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png" },
    ]
  },
  {
    id: 5, name: "Génération V", color: "#8E44AD",
    games: [
      { id: "black-white", name: "Noir / Blanc", pokeapi: "black", maxDex: 649, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/643.png" },
      { id: "black2-white2", name: "Noir 2 / Blanc 2", pokeapi: "black-2", maxDex: 649, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/646.png" },
    ]
  },
  {
    id: 6, name: "Génération VI", color: "#E91E63",
    games: [
      { id: "x-y", name: "X / Y", pokeapi: "x", maxDex: 721, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/716.png" },
      { id: "oras", name: "Rubis Oméga / Saphir Alpha", pokeapi: "omega-ruby", maxDex: 721, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/383.png" },
    ]
  },
  {
    id: 7, name: "Génération VII", color: "#FF6B35",
    games: [
      { id: "sun-moon", name: "Soleil / Lune", pokeapi: "sun", maxDex: 809, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/791.png" },
      { id: "usum", name: "Ultra-Soleil / Ultra-Lune", pokeapi: "ultra-sun", maxDex: 809, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/800.png" },
    ]
  },
  {
    id: 8, name: "Génération VIII", color: "#00BCD4",
    games: [
      { id: "sword-shield", name: "Épée / Bouclier", pokeapi: "sword", maxDex: 905, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/888.png" },
      { id: "bdsp", name: "Diamant Étincelant / Perle Scintillante", pokeapi: "brilliant-diamond", maxDex: 905, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/483.png" },
      { id: "legends-arceus", name: "Légendes : Arceus", pokeapi: "legends-arceus", maxDex: 905, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/493.png" },
    ]
  },
  {
    id: 9, name: "Génération IX", color: "#FF5722",
    games: [
      { id: "scarlet-violet", name: "Écarlate / Violet", pokeapi: "scarlet", maxDex: 1025, logo: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1000.png" },
    ]
  },
];

// ── 18-type effectiveness chart (Gen VI+) ─────────────────────────────────
export const TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2, poison: 0, normal: 0.5, grass: 0.5, psychic: 0.5, bug: 0.5, dragon: 0.5, dark: 0.5, fighting: 2, ground: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5, bug: 1 },
};

export const ALL_TYPES = [
  'normal','fire','water','electric','grass','ice',
  'fighting','poison','ground','flying','psychic',
  'bug','rock','ghost','dragon','dark','steel','fairy'
];

export const TYPES_BY_GEN = {
  1: ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon'],
  2: ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel'],
  3: ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel'],
  4: ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel'],
  5: ['normal','fire','water','electric','grass','ice','fighting','poison','ground','flying','psychic','bug','rock','ghost','dragon','dark','steel'],
  6: ALL_TYPES, 7: ALL_TYPES, 8: ALL_TYPES, 9: ALL_TYPES,
};

export const ABILITY_OVERRIDES = {
  "water-absorb":     { immuneTo: ["water"], absorbTo: ["water"] },
  "dry-skin":         { immuneTo: ["water"], absorbTo: ["water"], weakTo: ["fire"] },
  "storm-drain":      { immuneTo: ["water"], absorbTo: ["water"] },
  "flash-fire":       { immuneTo: ["fire"] },
  "well-baked-body":  { immuneTo: ["fire"] },
  "volt-absorb":      { immuneTo: ["electric"], absorbTo: ["electric"] },
  "motor-drive":      { immuneTo: ["electric"] },
  "lightning-rod":    { immuneTo: ["electric"], absorbTo: ["electric"] },
  "earth-eater":      { immuneTo: ["ground"], absorbTo: ["ground"] },
  "levitate":         { immuneTo: ["ground"] },
  "air-balloon":      { immuneTo: ["ground"] },
  "sap-sipper":       { immuneTo: ["grass"] },
  "thick-fat":        { halveTo: ["fire", "ice"] },
  "heatproof":        { halveTo: ["fire"] },
  "wonder-guard":     { specialWonderGuard: true },
  "fluffy":           { halveTo: ["contact"], weakTo: ["fire"] },
  "purifying-salt":   { halveTo: ["ghost"] },
  "filter":           { halveTo: ["supereffective"] },
  "solid-rock":       { halveTo: ["supereffective"] },
  "prism-armor":      { halveTo: ["supereffective"] },
};

export const ABILITY_NAMES_FR = {
  "water-absorb": "Absorb'eau", "dry-skin": "Peau sèche", "storm-drain": "Drainorage",
  "flash-fire": "Torche", "well-baked-body": "Corps cuit", "volt-absorb": "Absorb'volt",
  "motor-drive": "Moteur Turbo", "lightning-rod": "Paratonnerre", "earth-eater": "Géophage",
  "levitate": "Lévitation", "air-balloon": "Baudrobal", "sap-sipper": "Herbivore",
  "thick-fat": "Isograisse", "heatproof": "Ignifugé", "wonder-guard": "Merveille",
  "fluffy": "Doudou", "purifying-salt": "Sel purificateur", "filter": "Filtre",
  "solid-rock": "Roc Solide", "prism-armor": "Prisme Armure", "intimidate": "Intimidation",
  "speed-boost": "Turbo", "natural-cure": "Soin Naturel", "synchronize": "Synchro",
  "trace": "Calque", "adaptability": "Adapta-Puissance", "hustle": "Dynamisme",
  "sand-stream": "Sable Volant", "drizzle": "Pluie", "drought": "Sécheresse",
  "snow-warning": "Neige",
};

export const TYPE_COLORS = {
  normal:   "#A8A878", fire:     "#F08030", water:    "#6890F0",
  electric: "#F8D030", grass:    "#78C850", ice:      "#98D8D8",
  fighting: "#C03028", poison:   "#A040A0", ground:   "#E0C068",
  flying:   "#A890F0", psychic:  "#F85888", bug:      "#A8B820",
  rock:     "#B8A038", ghost:    "#705898", dragon:   "#7038F8",
  dark:     "#705848", steel:    "#B8B8D0", fairy:    "#EE99AC",
};

export const TYPE_NAMES_FR = {
  normal: "Normal", fire: "Feu", water: "Eau", electric: "Électrik",
  grass: "Plante", ice: "Glace", fighting: "Combat", poison: "Poison",
  ground: "Sol", flying: "Vol", psychic: "Psy", bug: "Insecte",
  rock: "Roche", ghost: "Spectre", dragon: "Dragon", dark: "Ténèbres",
  steel: "Acier", fairy: "Fée",
};
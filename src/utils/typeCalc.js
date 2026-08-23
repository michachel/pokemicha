import { TYPE_CHART, ALL_TYPES, ABILITY_OVERRIDES } from "../data/gameData";

/**
 * Compute effectiveness of an attacking type against a defending pokemon's types,
 * taking ability into account.
 * Returns a multiplier: 0, 0.25, 0.5, 1, 2, 4
 */
export function getEffectiveness(attackType, defTypes, abilityId) {
  // Check ability immunity first
  if (abilityId && ABILITY_OVERRIDES[abilityId]) {
    const override = ABILITY_OVERRIDES[abilityId];
    if (override.immuneTo?.includes(attackType)) return 0;
    if (override.halveTo?.includes(attackType)) {
      // Still compute normal then halve
      const normal = computeRawEffectiveness(attackType, defTypes);
      return normal * 0.5;
    }
  }

  if (abilityId === "wonder-guard") {
    const raw = computeRawEffectiveness(attackType, defTypes);
    return raw > 1 ? raw : 0;
  }

  return computeRawEffectiveness(attackType, defTypes);
}

function computeRawEffectiveness(attackType, defTypes) {
  let multiplier = 1;
  for (const defType of defTypes) {
    const chart = TYPE_CHART[attackType];
    if (chart && chart[defType] !== undefined) {
      multiplier *= chart[defType];
    }
  }
  return multiplier;
}

/**
 * For a full team, compute for each attacking type:
 * how many pokemon are immune / resistant / neutral / weak / double-weak
 */
export function computeTeamWeaknesses(team) {
  const result = {};

  for (const type of ALL_TYPES) {
    result[type] = { immune: [], quarter: [], half: [], neutral: [], double: [], quad: [] };
  }

  for (const member of team) {
    if (!member || !member.types || member.types.length === 0) continue;
    const abilityId = member.ability?.name || null;

    for (const atkType of ALL_TYPES) {
      const eff = getEffectiveness(atkType, member.types, abilityId);
      const entry = { name: member.name, sprite: member.sprite, id: member.id };

      if (eff === 0)    result[atkType].immune.push(entry);
      else if (eff <= 0.25) result[atkType].quarter.push(entry);
      else if (eff <= 0.5)  result[atkType].half.push(entry);
      else if (eff <= 1)    result[atkType].neutral.push(entry);
      else if (eff <= 2)    result[atkType].double.push(entry);
      else                  result[atkType].quad.push(entry);
    }
  }

  return result;
}

/**
 * For a pokemon's moveset, compute which types are covered (and at what multiplier)
 * based on attacking effectiveness.
 */
export function computeMovesetCoverage(moves, genTypes) {
  // moves: [{ type, name }]
  const coverage = {};
  for (const type of genTypes) {
    coverage[type] = 0;
  }

  for (const move of moves) {
    if (!move?.type) continue;
    for (const defType of genTypes) {
      const eff = computeRawEffectiveness(move.type, [defType]);
      if (eff > coverage[defType]) coverage[defType] = eff;
    }
  }

  return coverage;
}

/**
 * Compute team-wide offensive coverage from all moves
 */
export function computeTeamCoverage(team, genTypes) {
  const coverage = {};
  for (const type of genTypes) coverage[type] = 0;

  for (const member of team) {
    if (!member?.moves) continue;
    const memberCoverage = computeMovesetCoverage(member.moves, genTypes);
    for (const type of genTypes) {
      if (memberCoverage[type] > coverage[type]) coverage[type] = memberCoverage[type];
    }
  }

  return coverage;
}

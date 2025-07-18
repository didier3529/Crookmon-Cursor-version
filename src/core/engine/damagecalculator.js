import { getTypeEffectiveness } from '../data/types.js';

function calculateCritical(attacker) {
  if (!attacker || !attacker.stats || typeof attacker.stats.speed !== 'number') {
    return { multiplier: 1, isCritical: false };
  }
  const speed = attacker.stats.speed;
  const chance = Math.min(1, speed / 512);
  const isCritical = Math.random() < chance;
  return { multiplier: isCritical ? 1.5 : 1, isCritical };
}

function calculateDamage(attacker, defender, move) {
  if (!attacker || !attacker.stats || !defender || !defender.stats || !move) {
    throw new Error('calculateDamage requires attacker, defender, and move objects');
  }
  const level = typeof attacker.level === 'number' ? attacker.level : 1;
  const power = typeof move.power === 'number' ? move.power : 0;
  if (power <= 0) {
    return 0;
  }
  const category = move.category === 'Special' ? 'special' : 'physical';
  const attackStatKey = category === 'special' ? 'specialAttack' : 'attack';
  const defenseStatKey = category === 'special' ? 'specialDefense' : 'defense';
  const attackStat = attacker.stats[attackStatKey];
  const defenseStat = defender.stats[defenseStatKey];
  if (typeof attackStat !== 'number' || typeof defenseStat !== 'number' || defenseStat <= 0) {
    throw new Error('Invalid stats for damage calculation');
  }
  const base = (((2 * level) / 5 + 2) * power * (attackStat / defenseStat)) / 50 + 2;
  const { multiplier: critMultiplier } = calculateCritical(attacker);
  const stab = Array.isArray(attacker.types) && attacker.types.includes(move.type) ? 1.5 : 1;
  const typeEffectiveness = getTypeEffectiveness(move.type, defender.types || []);
  if (typeEffectiveness === 0) {
    return 0;
  }
  const randomFactor = Math.random() * (1 - 0.85) + 0.85;
  const total = base * critMultiplier * stab * typeEffectiveness * randomFactor;
  return Math.max(1, Math.floor(total));
}

export { calculateDamage, calculateCritical };
if (typeof module !== 'undefined') {
  module.exports = { calculateDamage, calculateCritical };
}
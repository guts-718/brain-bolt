export function calculateScore(
  difficulty: number,
  streak: number,
  accuracy: number
) {
  const base = difficulty * 10;
  const streakBonus = base * Math.min(streak, 5) * 0.2;
  const accuracyBonus = base * accuracy * 0.5;
  return Math.round(base + streakBonus + accuracyBonus);
}

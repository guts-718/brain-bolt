export function updateDifficultySimple(
  difficulty: number,
  momentum: number,
  correct: boolean
) {
  momentum += correct ? 1 : -1;
  momentum = Math.max(-3, Math.min(3, momentum));

  if (momentum >= 2) difficulty++;
  if (momentum <= -2) difficulty--;

  difficulty = Math.max(1, Math.min(10, difficulty));

  return { difficulty, momentum };
}

export function updateElo(
  rating: number,
  questionDiff: number,
  correct: boolean
) {
  const K = 32;
  const expected = 1 / (1 + Math.exp(questionDiff - rating));
  rating = rating + K * ((correct ? 1 : 0) - expected);
  return rating;
}

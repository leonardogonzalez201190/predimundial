export function evaluatePrediction(
    prediction: { homeScore: number; awayScore: number },
    result: { homeScore: number; awayScore: number }
  ) {
    const correctWinner =
      (prediction.homeScore > prediction.awayScore &&
        result.homeScore > result.awayScore) ||
      (prediction.homeScore < prediction.awayScore &&
        result.homeScore < result.awayScore) ||
      (prediction.homeScore === prediction.awayScore &&
        result.homeScore === result.awayScore);
  
    const exactMatch =
      prediction.homeScore === result.homeScore &&
      prediction.awayScore === result.awayScore;
  
    if (exactMatch) return 3;
    if (correctWinner) return 1;
    return 0;
  }
  
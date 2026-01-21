/** ---------- Core domain ---------- **/

export interface Team {
  name: string;
  code: string;
  flagUrl: string;
}

/**
 * Representa el resultado de un partido.
 * `null` indica que aún no tiene resultado.
 */
export interface MatchScore {
  home: number | null;
  away: number | null;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  result: MatchScore | null;
  home: Team;
  away: Team;
}

export interface Group {
  group: string;
  matches: Match[];
}

export interface MatchesResponse {
  groups: Group[];
}

/** ---------- Session / Authentication ---------- **/

export interface SessionUser {
  id: string;
  username?: string;
  alias?: string;
}

export interface Session {
  user?: SessionUser;
}

/** ---------- Predictions ---------- **/

export interface Prediction {
  matchId: string;
  homeScore: number;
  awayScore: number;
}

export interface UserPrediction extends Prediction {}

/** Props para componentes de UI relacionados a partidos */
export interface MatchesProps {
  data: MatchesResponse;
  session: Session | null;
  predictions: Prediction[];
}

export interface MatchRowProps {
  match: Match;
  session?: Session | null;
  existingPrediction?: Prediction;
  onVote?: (matchId: string, home: number, away: number) => void;
}

/** ---------- Ranking / Resultados ---------- **/

export interface UserPredictionDrawerProps {
  username: string;
  matches: any;
  predictions: UserPrediction[];
}

/** Tipos basados en Mongoose `.lean()` */
export interface LeanUser {
  _id: unknown; // mejor desconocido que string | object
  alias: string;
}

export interface LeanPrediction {
  _id: unknown;
  userId: unknown;
  homeScore: number;
  awayScore: number;
  matchId: string;
}

export interface LeanUser {
  _id: unknown;
  username: string;
  alias: string;
}

/**
 * Resumen de partido ya completado
 * útil para rankings ya que siempre existe resultado
 */
export interface CompletedMatch {
  id: string;
  result: MatchScore;
}


export interface MatchResult {
  id: string;
  result: MatchScore;
}    
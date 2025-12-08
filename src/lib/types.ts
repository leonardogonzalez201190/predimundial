export type Team = {
  name: string;
  code: string;
  flagUrl: string;
};

export type MatchResult = {
  home?: number;
  away?: number;
} | null;

export type Match = {
  id: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  result: MatchResult;
  home: Team;
  away: Team;
};

export type Group = {
  group: string;
  matches: Match[];
};

export type MatchesResponse = {
  groups: Group[];
};

export type SessionUser = {
  id: string;
  username?: string;
  alias?: string;
};

export type Session = {
  user?: SessionUser;
} | null;

export type Prediction = {
  matchId: string;
  homeScore: number;
  awayScore: number;
};

export type MatchesProps = {
  data: MatchesResponse;
  session: Session;
  predictions: Prediction[];
};

export type MatchRowProps = {
  match: Match;
  session?: object | null;
  existingPrediction?: {
    homeScore: number;
    awayScore: number;
  };
  onVote?: (matchId: string, home: number, away: number) => void;
};
export type Driver = {
  id: number;
  name: string;
  team: Constructor;
};
export type Constructor = {
  id: number;
  name: string;
  color: string;
};

export type Competitor = {
  id: number;
  name: string;
};

export type Race = {
  position: number;
  name: string;
  id: number;
  year: number;
};

export type CutoffRace = {
  race: Race;
  cutoff: string;
};

export type Category =
  "CONSTRUCTOR" | "FLAG" | "POLE" | "FIRST" | "DRIVER" | "TENTH";

export type ScoringTables = Record<Category, Record<string, number>>;

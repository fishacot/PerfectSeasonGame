import type { Era } from "../../src/lib/types";

export type Seed = {
  name: string;
  positions: string[];
  rating: number;
  stats: Record<string, number>;
};

export type ClubEraPool = Record<string, Partial<Record<Era, Seed[]>>>;

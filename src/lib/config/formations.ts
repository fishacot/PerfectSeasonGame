export type FormationId = "433" | "442" | "352" | "343" | "532" | "4231" | "451" | "3412";

export interface FormationConfig {
  id: FormationId;
  label: string;
  positions: string[];
}

export const FORMATIONS: Record<FormationId, FormationConfig> = {
  "433": {
    id: "433",
    label: "4-3-3",
    positions: [
      "GK",
      "LB",
      "CB",
      "CB",
      "RB",
      "CM",
      "CM",
      "CM",
      "LW",
      "ST",
      "RW",
    ],
  },
  "442": {
    id: "442",
    label: "4-4-2",
    positions: [
      "GK",
      "LB",
      "CB",
      "CB",
      "RB",
      "LM",
      "CM",
      "CM",
      "RM",
      "ST",
      "ST",
    ],
  },
  "352": {
    id: "352",
    label: "3-5-2",
    positions: [
      "GK",
      "CB",
      "CB",
      "CB",
      "LM",
      "CM",
      "CM",
      "CM",
      "RM",
      "ST",
      "ST",
    ],
  },
  "343": {
    id: "343",
    label: "3-4-3",
    positions: [
      "GK",
      "CB",
      "CB",
      "CB",
      "LM",
      "CM",
      "CM",
      "RM",
      "LW",
      "ST",
      "RW",
    ],
  },
  "532": {
    id: "532",
    label: "5-3-2",
    positions: [
      "GK",
      "LB",
      "CB",
      "CB",
      "CB",
      "RB",
      "CM",
      "CM",
      "CM",
      "ST",
      "ST",
    ],
  },
  "4231": {
    id: "4231",
    label: "4-2-3-1",
    positions: [
      "GK",
      "LB",
      "CB",
      "CB",
      "RB",
      "CM",
      "CM",
      "LW",
      "AM",
      "RW",
      "ST",
    ],
  },
  "451": {
    id: "451",
    label: "4-5-1",
    positions: [
      "GK",
      "LB",
      "CB",
      "CB",
      "RB",
      "LM",
      "CM",
      "CM",
      "CM",
      "RM",
      "ST",
    ],
  },
  "3412": {
    id: "3412",
    label: "3-4-1-2",
    positions: [
      "GK",
      "CB",
      "CB",
      "CB",
      "LM",
      "CM",
      "CM",
      "RM",
      "AM",
      "ST",
      "ST",
    ],
  },
};

export const FORMATION_IDS = Object.keys(FORMATIONS) as FormationId[];

export function getFormationPositions(id: FormationId): string[] {
  return FORMATIONS[id].positions;
}

export function getFormationLabel(id: FormationId): string {
  return FORMATIONS[id].label;
}

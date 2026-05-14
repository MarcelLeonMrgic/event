export type LocationKey = "makerspace" | "zwille";

export type Shift = {
  id: string;
  time: string;
  capacity: number;
};

export type ShiftPlan = {
  key: LocationKey;
  title: string;
  eyebrow: string;
  heading: string;
  description: string;
  shifts: Shift[];
};

const makerspaceShifts: Shift[] = [
  { id: "20", time: "20:00 - 21:00", capacity: 1 },
  { id: "21", time: "21:00 - 22:00", capacity: 2 },
  { id: "22", time: "22:00 - 23:00", capacity: 2 },
  { id: "23", time: "23:00 - 00:00", capacity: 2 },
  { id: "00", time: "00:00 - 01:00", capacity: 2 },
  { id: "01", time: "01:00 - 02:00", capacity: 2 },
  { id: "02", time: "02:00 - 03:00", capacity: 2 },
  { id: "03", time: "03:00 - 04:00", capacity: 2 },
  { id: "04", time: "04:00 - 05:00", capacity: 2 },
  { id: "05", time: "05:00 - 06:00", capacity: 1 },
];

const zwilleShifts: Shift[] = [
  { id: "zwille-20", time: "20:00 - 21:00", capacity: 2 },
  { id: "zwille-21", time: "21:00 - 22:00", capacity: 2 },
  { id: "zwille-22", time: "22:00 - 23:00", capacity: 2 },
  { id: "zwille-23", time: "23:00 - 00:00", capacity: 2 },
  { id: "zwille-00", time: "00:00 - 01:00", capacity: 2 },
  { id: "zwille-01", time: "01:00 - 02:00", capacity: 2 },
  { id: "zwille-02", time: "02:00 - 03:00", capacity: 2 },
  { id: "zwille-03", time: "03:00 - 04:00", capacity: 2 },
];

export const shiftPlans: Record<LocationKey, ShiftPlan> = {
  makerspace: {
    key: "makerspace",
    title: "TuDo Makerspace",
    eyebrow: "Bar-Schichten · 22. Mai 2026",
    heading: "Schichtplan für die nächste Party.",
    description:
      "Die erste Schicht startet um 20:00 Uhr, die letzte um 05:00 Uhr. Erste und letzte Schicht haben je einen Platz, alle anderen je zwei.",
    shifts: makerspaceShifts,
  },
  zwille: {
    key: "zwille",
    title: "Zwille",
    eyebrow: "Bar-Schichten · Zwille",
    heading: "Schichtplan für die Zwille.",
    description:
      "Die Schichten laufen von 20:00 Uhr bis 04:00 Uhr. Jede Schicht dauert eine Stunde.",
    shifts: zwilleShifts,
  },
};

export const shifts = shiftPlans.makerspace.shifts;

export function getShiftPlan(location: string | null | undefined) {
  if (location === "zwille") {
    return shiftPlans.zwille;
  }

  return shiftPlans.makerspace;
}

export function getShift(location: string | null | undefined, shiftId: string) {
  return getShiftPlan(location).shifts.find((shift) => shift.id === shiftId);
}

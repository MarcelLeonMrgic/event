export type Shift = {
  id: string;
  time: string;
  capacity: number;
};

export const shifts: Shift[] = [
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

export function getShift(shiftId: string) {
  return shifts.find((shift) => shift.id === shiftId);
}

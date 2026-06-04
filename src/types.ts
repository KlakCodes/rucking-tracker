export type DistanceUnit = "miles" | "kilometres";
export type WeightUnit = "kg" | "lb";

export type RuckEntry = {
  id: string;
  date: string;
  distance: number;
  distanceUnit: DistanceUnit;
  durationHours: number;
  durationMinutes: number;
  ruckWeight: number;
  weightUnit: WeightUnit;
  notes?: string;
};

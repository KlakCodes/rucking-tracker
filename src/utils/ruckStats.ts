import { DistanceUnit, RuckEntry, WeightUnit } from "../types";

const KM_PER_MILE = 1.609344;
const LB_PER_KG = 2.2046226218;

export type PaceUnit = "km" | "mile";

export type ProgressStat = {
  label: string;
  value: string;
  supportText?: string;
};

export type ProgressStats = {
  longestRuck: ProgressStat;
  heaviestRuck: ProgressStat;
  fastestPace: ProgressStat;
  totalDistanceThisMonth: ProgressStat;
};

export function getDurationMinutes(entry: RuckEntry): number {
  return entry.durationHours * 60 + entry.durationMinutes;
}

export function distanceToMiles(distance: number, unit: DistanceUnit): number {
  return unit === "miles" ? distance : distance / KM_PER_MILE;
}

export function distanceToKilometres(distance: number, unit: DistanceUnit): number {
  return unit === "kilometres" ? distance : distance * KM_PER_MILE;
}

export function weightToKilograms(weight: number, unit: WeightUnit): number {
  return unit === "kg" ? weight : weight / LB_PER_KG;
}

export function weightToPounds(weight: number, unit: WeightUnit): number {
  return unit === "lb" ? weight : weight * LB_PER_KG;
}

export function calculatePaceMinutes(distance: number, durationMinutes: number): number | null {
  if (!Number.isFinite(distance) || !Number.isFinite(durationMinutes)) {
    return null;
  }

  if (distance <= 0 || durationMinutes <= 0) {
    return null;
  }

  return durationMinutes / distance;
}

export function isInCurrentMonth(entry: RuckEntry, currentDate: Date = new Date()): boolean {
  const entryDate = parseEntryDate(entry.date);

  if (!entryDate) {
    return false;
  }

  return (
    entryDate.getFullYear() === currentDate.getFullYear() &&
    entryDate.getMonth() === currentDate.getMonth()
  );
}

export function getCurrentMonthRucks(
  entries: RuckEntry[],
  currentDate: Date = new Date(),
): RuckEntry[] {
  return entries.filter((entry) => isInCurrentMonth(entry, currentDate));
}

export function getProgressStats(entries: RuckEntry[], currentDate: Date = new Date()): ProgressStats {
  const distanceUnit = getPreferredDistanceDisplayUnit(entries);
  const weightUnit = getPreferredWeightDisplayUnit(entries);
  const paceUnit: PaceUnit = distanceUnit === "kilometres" ? "km" : "mile";

  return {
    longestRuck: getLongestRuckStat(entries, distanceUnit),
    heaviestRuck: getHeaviestRuckStat(entries, weightUnit),
    fastestPace: getFastestPaceStat(entries, paceUnit),
    totalDistanceThisMonth: getTotalDistanceThisMonthStat(entries, currentDate, distanceUnit),
  };
}

export function getTotalDistanceMiles(entries: RuckEntry[]): number {
  return entries.reduce(
    (total, entry) => total + distanceToMiles(entry.distance, entry.distanceUnit),
    0,
  );
}

export function getTotalDistanceKilometres(entries: RuckEntry[]): number {
  return entries.reduce(
    (total, entry) => total + distanceToKilometres(entry.distance, entry.distanceUnit),
    0,
  );
}

export function getAveragePaceText(entries: RuckEntry[]): string {
  const totalMiles = getTotalDistanceMiles(entries);
  const totalMinutes = entries.reduce((total, entry) => total + getDurationMinutes(entry), 0);

  if (entries.length === 0 || totalMiles === 0 || totalMinutes === 0) {
    return "No pace yet";
  }

  const averagePaceSeconds = Math.round((totalMinutes / totalMiles) * 60);
  const minutes = Math.floor(averagePaceSeconds / 60);
  const seconds = averagePaceSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")} / mile`;
}

export function formatDistance(distance: number): string {
  return distance.toFixed(distance >= 10 ? 1 : 2);
}

export function formatDuration(hours: number, minutes: number): string {
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hr`);
  }

  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes} min`);
  }

  return parts.join(" ");
}

export function formatPace(paceMinutes: number): string {
  const paceSeconds = Math.round(paceMinutes * 60);
  const minutes = Math.floor(paceSeconds / 60);
  const seconds = paceSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getLongestRuckStat(entries: RuckEntry[], displayUnit: DistanceUnit): ProgressStat {
  const longest = entries.reduce<{ entry: RuckEntry; distance: number } | null>((best, entry) => {
    const distance = convertDistanceForDisplay(entry.distance, entry.distanceUnit, displayUnit);

    if (!Number.isFinite(distance) || distance <= 0) {
      return best;
    }

    if (!best || distance > best.distance) {
      return { entry, distance };
    }

    return best;
  }, null);

  return {
    label: "Longest ruck",
    value: longest
      ? `${formatDistance(longest.distance)} ${getDistanceUnitLabel(displayUnit)}`
      : "Not enough data",
    supportText: longest ? formatStatDate(longest.entry.date) : undefined,
  };
}

function getHeaviestRuckStat(entries: RuckEntry[], displayUnit: WeightUnit): ProgressStat {
  const heaviest = entries.reduce<{ entry: RuckEntry; weight: number } | null>((best, entry) => {
    const weight = convertWeightForDisplay(entry.ruckWeight, entry.weightUnit, displayUnit);

    if (!Number.isFinite(weight) || weight <= 0) {
      return best;
    }

    if (!best || weight > best.weight) {
      return { entry, weight };
    }

    return best;
  }, null);

  return {
    label: "Heaviest ruck",
    value: heaviest ? `${heaviest.weight.toFixed(1)} ${displayUnit}` : "Not enough data",
    supportText: heaviest ? formatStatDate(heaviest.entry.date) : undefined,
  };
}

function getFastestPaceStat(entries: RuckEntry[], displayUnit: PaceUnit): ProgressStat {
  const fastest = entries.reduce<{ entry: RuckEntry; pace: number } | null>((best, entry) => {
    const distance =
      displayUnit === "km"
        ? distanceToKilometres(entry.distance, entry.distanceUnit)
        : distanceToMiles(entry.distance, entry.distanceUnit);
    const durationMinutes = getDurationMinutes(entry);
    const pace = calculatePaceMinutes(distance, durationMinutes);

    // Lower minutes per unit is faster.
    if (pace === null) {
      return best;
    }

    if (!best || pace < best.pace) {
      return { entry, pace };
    }

    return best;
  }, null);

  return {
    label: "Fastest average pace",
    value: fastest ? `${formatPace(fastest.pace)} / ${displayUnit}` : "Not enough data",
    supportText: fastest ? formatStatDate(fastest.entry.date) : undefined,
  };
}

function getTotalDistanceThisMonthStat(
  entries: RuckEntry[],
  currentDate: Date,
  displayUnit: DistanceUnit,
): ProgressStat {
  const monthRucks = getCurrentMonthRucks(entries, currentDate);
  const validDistances = monthRucks
    .map((entry) => convertDistanceForDisplay(entry.distance, entry.distanceUnit, displayUnit))
    .filter((distance) => Number.isFinite(distance) && distance > 0);
  const totalDistance = validDistances.reduce((total, distance) => total + distance, 0);

  return {
    label: "Total distance this month",
    value:
      validDistances.length > 0
        ? `${formatDistance(totalDistance)} ${getDistanceUnitLabel(displayUnit)}`
        : "Not enough data",
    supportText: formatMonthLabel(currentDate),
  };
}

function getPreferredDistanceDisplayUnit(entries: RuckEntry[]): DistanceUnit {
  const units = new Set<DistanceUnit>(entries.map((entry) => entry.distanceUnit));

  if (units.size === 1 && units.has("miles")) {
    return "miles";
  }

  return "kilometres";
}

function getPreferredWeightDisplayUnit(entries: RuckEntry[]): WeightUnit {
  const units = new Set<WeightUnit>(entries.map((entry) => entry.weightUnit));

  if (units.size === 1 && units.has("lb")) {
    return "lb";
  }

  return "kg";
}

function convertDistanceForDisplay(
  distance: number,
  fromUnit: DistanceUnit,
  displayUnit: DistanceUnit,
): number {
  return displayUnit === "kilometres"
    ? distanceToKilometres(distance, fromUnit)
    : distanceToMiles(distance, fromUnit);
}

function convertWeightForDisplay(weight: number, fromUnit: WeightUnit, displayUnit: WeightUnit): number {
  return displayUnit === "kg" ? weightToKilograms(weight, fromUnit) : weightToPounds(weight, fromUnit);
}

function getDistanceUnitLabel(unit: DistanceUnit): string {
  return unit === "kilometres" ? "km" : "mi";
}

function parseEntryDate(date: string): Date | null {
  const parts = date.split("-").map(Number);

  if (parts.length !== 3 || parts.some((part) => !Number.isFinite(part))) {
    return null;
  }

  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

function formatStatDate(date: string): string {
  const entryDate = parseEntryDate(date);

  if (!entryDate) {
    return date;
  }

  return entryDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

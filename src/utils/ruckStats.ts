import { DistanceUnit, RuckEntry } from "../types";

const KM_PER_MILE = 1.609344;

export function getDurationMinutes(entry: RuckEntry): number {
  return entry.durationHours * 60 + entry.durationMinutes;
}

export function distanceToMiles(distance: number, unit: DistanceUnit): number {
  return unit === "miles" ? distance : distance / KM_PER_MILE;
}

export function distanceToKilometres(distance: number, unit: DistanceUnit): number {
  return unit === "kilometres" ? distance : distance * KM_PER_MILE;
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

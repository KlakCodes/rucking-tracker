import AsyncStorage from "@react-native-async-storage/async-storage";

import { RuckEntry } from "../types";

const STORAGE_KEY = "rucking-tracker:rucks";

export async function loadRuckEntries(): Promise<RuckEntry[]> {
  try {
    const savedValue = await AsyncStorage.getItem(STORAGE_KEY);
    const parsedValue: unknown = savedValue ? JSON.parse(savedValue) : [];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(isRuckEntry);
  } catch (error) {
    console.warn("Could not load saved rucks", error);
    return [];
  }
}

export async function saveRuckEntries(entries: RuckEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn("Could not save rucks", error);
  }
}

export async function deleteRuckEntries(
  id: string,
  entries: RuckEntry[],
): Promise<RuckEntry[]> {
  const nextEntries = entries.filter((entry) => entry.id !== id);
  await saveRuckEntries(nextEntries);
  return nextEntries;
}

function isRuckEntry(value: unknown): value is RuckEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<RuckEntry>;

  return (
    typeof entry.id === "string" &&
    typeof entry.date === "string" &&
    typeof entry.distance === "number" &&
    (entry.distanceUnit === "miles" || entry.distanceUnit === "kilometres") &&
    typeof entry.durationHours === "number" &&
    typeof entry.durationMinutes === "number" &&
    typeof entry.ruckWeight === "number" &&
    (entry.weightUnit === "kg" || entry.weightUnit === "lb") &&
    (entry.notes === undefined || typeof entry.notes === "string")
  );
}

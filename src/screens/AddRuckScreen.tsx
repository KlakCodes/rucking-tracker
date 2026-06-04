import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors, spacing } from "../theme";
import { DistanceUnit, RuckEntry, WeightUnit } from "../types";

type AddRuckScreenProps = {
  onCancel: () => void;
  onSave: (entry: RuckEntry) => void;
};

export function AddRuckScreen({ onCancel, onSave }: AddRuckScreenProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [distance, setDistance] = useState("");
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>("miles");
  const [durationHours, setDurationHours] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [ruckWeight, setRuckWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("lb");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    const parsedDistance = parsePositiveNumber(distance);
    const parsedHours = parseWholeNumber(durationHours || "0");
    const parsedMinutes = parseWholeNumber(durationMinutes || "0");
    const parsedWeight = parsePositiveNumber(ruckWeight);

    if (!date.trim()) {
      Alert.alert("Date is required", "Please enter the ruck date.");
      return;
    }

    if (parsedDistance === null) {
      Alert.alert("Distance is required", "Please enter a distance greater than zero.");
      return;
    }

    if (
      parsedHours === null ||
      parsedMinutes === null ||
      parsedMinutes > 59 ||
      parsedHours + parsedMinutes === 0
    ) {
      Alert.alert("Duration is required", "Please enter hours and minutes for the ruck.");
      return;
    }

    if (parsedWeight === null) {
      Alert.alert("Ruck weight is required", "Please enter the weight you carried.");
      return;
    }

    // Date.now keeps this beginner-friendly without adding a UUID dependency.
    const entry: RuckEntry = {
      id: String(Date.now()),
      date: date.trim(),
      distance: parsedDistance,
      distanceUnit,
      durationHours: parsedHours,
      durationMinutes: parsedMinutes,
      ruckWeight: parsedWeight,
      weightUnit,
      notes: notes.trim() || undefined,
    };

    onSave(entry);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardView}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Ruck</Text>
        <Text style={styles.subtitle}>Enter the details from your workout.</Text>

        <LabeledInput label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />

        <LabeledInput
          label="Distance"
          value={distance}
          onChangeText={setDistance}
          placeholder="4.5"
          keyboardType="decimal-pad"
        />
        <SegmentedControl
          options={["miles", "kilometres"]}
          selectedValue={distanceUnit}
          onChange={setDistanceUnit}
        />

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <LabeledInput
              label="Hours"
              value={durationHours}
              onChangeText={setDurationHours}
              placeholder="1"
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.rowItem}>
            <LabeledInput
              label="Minutes"
              value={durationMinutes}
              onChangeText={setDurationMinutes}
              placeholder="30"
              keyboardType="number-pad"
            />
          </View>
        </View>

        <LabeledInput
          label="Ruck weight"
          value={ruckWeight}
          onChangeText={setRuckWeight}
          placeholder="25"
          keyboardType="decimal-pad"
        />
        <SegmentedControl options={["lb", "kg"]} selectedValue={weightUnit} onChange={setWeightUnit} />

        <LabeledInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="How did it feel?"
          multiline
        />

        <Pressable style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Save Ruck</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function parsePositiveNumber(value: string): number | null {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function parseWholeNumber(value: string): number | null {
  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 0) {
    return null;
  }

  return parsedValue;
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "decimal-pad" | "number-pad";
  multiline?: boolean;
};

function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
}: LabeledInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.notesInput]}
      />
    </View>
  );
}

type SegmentedControlProps<T extends string> = {
  options: T[];
  selectedValue: T;
  onChange: (value: T) => void;
};

function SegmentedControl<T extends string>({ options, selectedValue, onChange }: SegmentedControlProps<T>) {
  return (
    <View style={styles.segmentedControl}>
      {options.map((option) => {
        const isSelected = option === selectedValue;

        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.segmentButton, isSelected && styles.segmentButtonSelected]}
          >
            <Text style={[styles.segmentText, isSelected && styles.segmentTextSelected]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontSize: 16,
    color: colors.mutedText,
  },
  field: {
    marginTop: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    fontSize: 16,
    color: colors.text,
  },
  notesInput: {
    minHeight: 96,
    paddingTop: spacing.md,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  segmentedControl: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    backgroundColor: colors.card,
  },
  segmentButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.softBlue,
  },
  segmentText: {
    color: colors.mutedText,
    fontWeight: "700",
  },
  segmentTextSelected: {
    color: colors.primary,
  },
  primaryButton: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
});

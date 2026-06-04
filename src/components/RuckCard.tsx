import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";
import { RuckEntry } from "../types";
import { formatDuration } from "../utils/ruckStats";

type RuckCardProps = {
  ruck: RuckEntry;
  onDelete?: (id: string) => void;
};

export function RuckCard({ ruck, onDelete }: RuckCardProps) {
  const notesPreview = ruck.notes?.trim() || "No notes added";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>{ruck.date}</Text>
        {onDelete && (
          <Pressable onPress={() => onDelete(ruck.id)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>
          {ruck.distance} {ruck.distanceUnit}
        </Text>
        <Text style={styles.detailText}>
          {formatDuration(ruck.durationHours, ruck.durationMinutes)}
        </Text>
        <Text style={styles.detailText}>
          {ruck.ruckWeight} {ruck.weightUnit}
        </Text>
      </View>

      <Text numberOfLines={2} style={styles.notes}>
        {notesPreview}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  date: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },
  deleteButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "700",
  },
  details: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  detailText: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    backgroundColor: colors.softBlue,
    color: colors.text,
    fontWeight: "600",
  },
  notes: {
    marginTop: spacing.md,
    color: colors.mutedText,
    lineHeight: 20,
  },
});

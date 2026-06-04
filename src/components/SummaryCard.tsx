import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../theme";

type SummaryCardProps = {
  label: string;
  value: string;
};

export function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "47%",
    padding: spacing.lg,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
    color: colors.mutedText,
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
});

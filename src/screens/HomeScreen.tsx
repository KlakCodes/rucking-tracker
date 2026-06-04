import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { RuckCard } from "../components/RuckCard";
import { SummaryCard } from "../components/SummaryCard";
import { colors, spacing } from "../theme";
import { RuckEntry } from "../types";
import {
  formatDistance,
  getAveragePaceText,
  getTotalDistanceKilometres,
  getTotalDistanceMiles,
} from "../utils/ruckStats";

type HomeScreenProps = {
  isLoading: boolean;
  rucks: RuckEntry[];
  onAddRuck: () => void;
  onViewHistory: () => void;
};

export function HomeScreen({ isLoading, rucks, onAddRuck, onViewHistory }: HomeScreenProps) {
  const mostRecentRuck = rucks[0];
  const totalMiles = getTotalDistanceMiles(rucks);
  const totalKilometres = getTotalDistanceKilometres(rucks);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rucking Tracker</Text>
      <Text style={styles.subtitle}>Track each ruck manually and watch your progress add up.</Text>

      <View style={styles.summaryGrid}>
        <SummaryCard label="Total rucks" value={isLoading ? "Loading" : String(rucks.length)} />
        <SummaryCard
          label="Total distance"
          value={`${formatDistance(totalMiles)} mi / ${formatDistance(totalKilometres)} km`}
        />
        <SummaryCard label="Average pace" value={getAveragePaceText(rucks)} />
      </View>

      <Pressable style={styles.primaryButton} onPress={onAddRuck}>
        <Text style={styles.primaryButtonText}>Add New Ruck</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={onViewHistory}>
        <Text style={styles.secondaryButtonText}>View History</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Most recent ruck</Text>
      </View>

      {mostRecentRuck ? (
        <RuckCard ruck={mostRecentRuck} />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No rucks logged yet</Text>
          <Text style={styles.emptyText}>Add your first ruck to start tracking progress.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 16,
    lineHeight: 22,
    color: colors.mutedText,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginTop: spacing.xl,
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
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  sectionHeader: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  emptyState: {
    padding: spacing.xl,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.sm,
    color: colors.mutedText,
  },
});

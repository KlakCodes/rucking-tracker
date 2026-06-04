import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { colors, spacing } from "../theme";
import { DistanceUnit, RuckEntry, WeightUnit } from "../types";
import {
  distanceToKilometres,
  distanceToMiles,
  formatDistance,
  getProgressStats,
  ProgressStat,
  weightToKilograms,
  weightToPounds,
} from "../utils/ruckStats";

type ProgressScreenProps = {
  rucks: RuckEntry[];
  onBack: () => void;
};

type ChartDetails = {
  title: string;
  legend: string;
  unit: string;
  color: string;
  values: number[];
};

export function ProgressScreen({ rucks, onBack }: ProgressScreenProps) {
  const { width } = useWindowDimensions();
  const sortedRucks = useMemo(
    () => [...rucks].sort((a, b) => a.date.localeCompare(b.date)),
    [rucks],
  );
  const chartWidth = Math.max(width - spacing.xl * 2, 280);

  const labels = buildReadableDateLabels(sortedRucks);
  const distanceChart = buildDistanceChart(sortedRucks);
  const weightChart = buildWeightChart(sortedRucks);
  const progressStats = getProgressStats(rucks);
  const statCards = [
    progressStats.longestRuck,
    progressStats.heaviestRuck,
    progressStats.fastestPace,
    progressStats.totalDistanceThisMonth,
  ];
  const shouldUseTwoColumns = width >= 380;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Progress</Text>
          <Text style={styles.subtitle}>Distance and carried weight over time.</Text>
        </View>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>

      {sortedRucks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No progress yet</Text>
          <Text style={styles.emptyText}>
            Add your first ruck to start building stats and progress charts.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.statsSection}>
            {statCards.map((stat) => (
              <StatCard key={stat.label} stat={stat} twoColumns={shouldUseTwoColumns} />
            ))}
          </View>

          <View style={styles.chartCard}>
            {sortedRucks.length === 1 && (
              <Text style={styles.helperText}>
                One ruck is logged. Add more entries to see a clear trend line.
              </Text>
            )}

            <ProgressLineChart chart={distanceChart} labels={labels} width={chartWidth} />

            <View style={styles.chartDivider} />

            <ProgressLineChart chart={weightChart} labels={labels} width={chartWidth} />
          </View>
        </>
      )}
    </ScrollView>
  );
}

function StatCard({ stat, twoColumns }: { stat: ProgressStat; twoColumns: boolean }) {
  return (
    <View style={[styles.statCard, twoColumns && styles.statCardTwoColumn]}>
      <Text style={styles.statLabel}>{stat.label}</Text>
      <Text style={styles.statValue}>{stat.value}</Text>
      {stat.supportText ? <Text style={styles.statSupport}>{stat.supportText}</Text> : null}
    </View>
  );
}

function ProgressLineChart({
  chart,
  labels,
  width,
}: {
  chart: ChartDetails;
  labels: string[];
  width: number;
}) {
  return (
    <View>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{chart.title}</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: chart.color }]} />
          <Text style={styles.legendText}>{chart.legend}</Text>
        </View>
      </View>

      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: chart.values,
              color: () => chart.color,
            },
          ],
        }}
        width={width}
        height={240}
        yAxisSuffix={` ${chart.unit}`}
        fromZero
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 1,
          color: () => chart.color,
          labelColor: () => colors.mutedText,
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: chart.color,
          },
          propsForBackgroundLines: {
            stroke: colors.border,
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

function buildDistanceChart(rucks: RuckEntry[]): ChartDetails {
  const displayUnit = getDistanceChartUnit(rucks);
  const values = rucks.map((ruck) => {
    // Mixed units are normalized to kilometres so one chart line uses one scale.
    const value =
      displayUnit === "km"
        ? distanceToKilometres(ruck.distance, ruck.distanceUnit)
        : distanceToMiles(ruck.distance, ruck.distanceUnit);

    return Number(formatDistance(value));
  });

  return {
    title: "Distance",
    legend: `Distance (${displayUnit})`,
    unit: displayUnit,
    color: colors.primary,
    values,
  };
}

function buildWeightChart(rucks: RuckEntry[]): ChartDetails {
  const displayUnit = getWeightChartUnit(rucks);
  const values = rucks.map((ruck) => {
    // Mixed units are normalized to kilograms so one chart line uses one scale.
    const value =
      displayUnit === "kg"
        ? weightToKilograms(ruck.ruckWeight, ruck.weightUnit)
        : weightToPounds(ruck.ruckWeight, ruck.weightUnit);

    return Number(value.toFixed(1));
  });

  return {
    title: "Ruck weight",
    legend: `Ruck weight (${displayUnit})`,
    unit: displayUnit,
    color: "#16a34a",
    values,
  };
}

function getDistanceChartUnit(rucks: RuckEntry[]): "mi" | "km" {
  const units = new Set<DistanceUnit>(rucks.map((ruck) => ruck.distanceUnit));

  if (units.size === 1) {
    return units.has("kilometres") ? "km" : "mi";
  }

  return "km";
}

function getWeightChartUnit(rucks: RuckEntry[]): WeightUnit {
  const units = new Set<WeightUnit>(rucks.map((ruck) => ruck.weightUnit));

  if (units.size === 1) {
    return units.has("kg") ? "kg" : "lb";
  }

  return "kg";
}

function buildReadableDateLabels(rucks: RuckEntry[]): string[] {
  const labelEvery = Math.max(1, Math.ceil(rucks.length / 4));

  return rucks.map((ruck, index) => {
    const shouldShowLabel = index === 0 || index === rucks.length - 1 || index % labelEvery === 0;

    return shouldShowLabel ? formatChartDate(ruck.date) : "";
  });
}

function formatChartDate(date: string): string {
  const parts = date.split("-");

  if (parts.length === 3) {
    return `${parts[1]}/${parts[2]}`;
  }

  return date;
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.mutedText,
  },
  backButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  backButtonText: {
    color: colors.text,
    fontWeight: "700",
  },
  statsSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: "100%",
    padding: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  statCardTwoColumn: {
    flexGrow: 1,
    flexBasis: "45%",
  },
  statLabel: {
    color: colors.mutedText,
    fontSize: 13,
    fontWeight: "700",
  },
  statValue: {
    marginTop: spacing.sm,
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  statSupport: {
    marginTop: spacing.xs,
    color: colors.mutedText,
  },
  chartCard: {
    paddingVertical: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    overflow: "hidden",
  },
  chartHeader: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: colors.mutedText,
    fontWeight: "700",
  },
  chart: {
    borderRadius: 8,
  },
  chartDivider: {
    height: 1,
    marginVertical: spacing.lg,
    backgroundColor: colors.border,
  },
  helperText: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    color: colors.mutedText,
    lineHeight: 20,
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

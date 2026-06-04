import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { RuckCard } from "../components/RuckCard";
import { colors, spacing } from "../theme";
import { RuckEntry } from "../types";

type HistoryScreenProps = {
  rucks: RuckEntry[];
  onBack: () => void;
  onDelete: (id: string) => void;
  onEdit: (ruck: RuckEntry) => void;
};

export function HistoryScreen({ rucks, onBack, onDelete, onEdit }: HistoryScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>All saved rucks are listed newest first.</Text>
        </View>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>

      <FlatList
        data={rucks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RuckCard ruck={item} onDelete={onDelete} onEdit={onEdit} />}
        contentContainerStyle={rucks.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No rucks yet</Text>
            <Text style={styles.emptyText}>Add a ruck from the home screen to see it here.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
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
  list: {
    paddingBottom: 40,
  },
  emptyList: {
    flexGrow: 1,
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

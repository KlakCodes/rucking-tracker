import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AddRuckScreen } from "./src/screens/AddRuckScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { deleteRuckEntries, loadRuckEntries, saveRuckEntries } from "./src/storage/ruckStorage";
import { colors } from "./src/theme";
import { RuckEntry } from "./src/types";

type ScreenName = "home" | "add" | "history";

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const [rucks, setRucks] = useState<RuckEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      const savedRucks = await loadRuckEntries();
      setRucks(savedRucks);
      setIsLoading(false);
    };

    loadEntries();
  }, []);

  const sortedRucks = useMemo(
    () => [...rucks].sort((a, b) => b.date.localeCompare(a.date)),
    [rucks],
  );

  const handleSaveRuck = useCallback(async (entry: RuckEntry) => {
    const nextRucks = [entry, ...rucks];
    setRucks(nextRucks);
    await saveRuckEntries(nextRucks);
    setScreen("home");
  }, [rucks]);

  const handleDeleteRuck = useCallback((id: string) => {
    Alert.alert("Delete ruck?", "This will remove the ruck from your history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const nextRucks = await deleteRuckEntries(id, rucks);
          setRucks(nextRucks);
        },
      },
    ]);
  }, [rucks]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.app}>
          {screen === "home" && (
            <HomeScreen
              isLoading={isLoading}
              rucks={sortedRucks}
              onAddRuck={() => setScreen("add")}
              onViewHistory={() => setScreen("history")}
            />
          )}

          {screen === "add" && (
            <AddRuckScreen
              onCancel={() => setScreen("home")}
              onSave={handleSaveRuck}
            />
          )}

          {screen === "history" && (
            <HistoryScreen
              rucks={sortedRucks}
              onBack={() => setScreen("home")}
              onDelete={handleDeleteRuck}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  app: {
    flex: 1,
  },
});

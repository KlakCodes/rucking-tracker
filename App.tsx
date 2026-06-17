import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, BackHandler, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AddRuckScreen } from "./src/screens/AddRuckScreen";
import { EditRuckScreen } from "./src/screens/EditRuckScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ProgressScreen } from "./src/screens/ProgressScreen";
import { deleteRuckEntries, loadRuckEntries, saveRuckEntries } from "./src/storage/ruckStorage";
import { colors } from "./src/theme";
import { RuckEntry } from "./src/types";

type ScreenName = "home" | "add" | "history" | "edit" | "progress";

export default function App() {
  const [screen, setScreen] = useState<ScreenName>("home");
  const [rucks, setRucks] = useState<RuckEntry[]>([]);
  const [selectedRuck, setSelectedRuck] = useState<RuckEntry | null>(null);
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

  const handleStartEdit = useCallback((ruck: RuckEntry) => {
    setSelectedRuck(ruck);
    setScreen("edit");
  }, []);

  const handleUpdateRuck = useCallback(async (updatedEntry: RuckEntry) => {
    const nextRucks = rucks.map((ruck) =>
      ruck.id === updatedEntry.id ? updatedEntry : ruck,
    );

    setRucks(nextRucks);
    await saveRuckEntries(nextRucks);
    setSelectedRuck(null);
    setScreen("history");
  }, [rucks]);

  const handleCancelEdit = useCallback(() => {
    setSelectedRuck(null);
    setScreen("history");
  }, []);

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (screen === "home") return false;
      if (screen === "edit") {
        handleCancelEdit();
      } else {
        setScreen("home");
      }
      return true;
    });
    return () => handler.remove();
  }, [screen, handleCancelEdit]);

  const handleDeleteRuck = useCallback((id: string) => {
    Alert.alert("Delete ruck?", "This will remove the ruck from your history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const nextRucks = await deleteRuckEntries(id, rucks);
          setRucks(nextRucks);
          if (selectedRuck?.id === id) {
            setSelectedRuck(null);
          }
        },
      },
    ]);
  }, [rucks, selectedRuck]);

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
              onViewProgress={() => setScreen("progress")}
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
              onEdit={handleStartEdit}
            />
          )}

          {screen === "edit" && selectedRuck && (
            <EditRuckScreen
              ruck={selectedRuck}
              onCancel={handleCancelEdit}
              onSave={handleUpdateRuck}
            />
          )}

          {screen === "progress" && (
            <ProgressScreen
              rucks={rucks}
              onBack={() => setScreen("home")}
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

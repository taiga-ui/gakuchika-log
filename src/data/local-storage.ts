import AsyncStorage from "@react-native-async-storage/async-storage";

export const APP_STORAGE_KEY = "gakuchika-log-state-v2";

export type StorageStatusReporter = (
  status: "saving" | "saved" | "error",
  error?: unknown,
) => void;

export const createAppStorage = (reportStatus: StorageStatusReporter) => ({
  getItem: (name: string) => AsyncStorage.getItem(name),
  setItem: async (name: string, value: string) => {
    reportStatus("saving");
    try {
      await AsyncStorage.setItem(name, value);
      reportStatus("saved");
    } catch (error) {
      reportStatus("error", error);
      throw error;
    }
  },
  removeItem: (name: string) => AsyncStorage.removeItem(name),
});

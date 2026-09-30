import AsyncStorage from "@react-native-async-storage/async-storage";

export const APP_STORAGE_KEY = "gakuchika-log-state-v2";

export type StorageStatusReporter = (
  status: "saving" | "saved" | "error",
  error?: unknown,
  operationId?: number,
) => void;

export const createAppStorage = (reportStatus: StorageStatusReporter) => {
  let nextOperationId = 0;
  let writeQueue = Promise.resolve();

  return {
    getItem: (name: string) => AsyncStorage.getItem(name),
    setItem: (name: string, value: string) => {
      const operationId = ++nextOperationId;
      reportStatus("saving", undefined, operationId);

      const write = writeQueue.then(async () => {
        try {
          await AsyncStorage.setItem(name, value);
          reportStatus("saved", undefined, operationId);
        } catch (error) {
          reportStatus("error", error, operationId);
          throw error;
        }
      });
      writeQueue = write.catch(() => undefined);
      return write;
    },
    removeItem: (name: string) => AsyncStorage.removeItem(name),
  };
};

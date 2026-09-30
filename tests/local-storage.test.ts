const mockStorage = new Map<string, string>();

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn((key: string) =>
    Promise.resolve(mockStorage.get(key) ?? null),
  ),
  setItem: jest.fn((key: string, value: string) => {
    mockStorage.set(key, value);
    return Promise.resolve();
  }),
  removeItem: jest.fn((key: string) => {
    mockStorage.delete(key);
    return Promise.resolve();
  }),
}));

import { createAppStorage } from "@/data/local-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const flushPromises = () => new Promise<void>((resolve) => resolve());

describe("app storage", () => {
  beforeEach(() => {
    mockStorage.clear();
    jest.mocked(AsyncStorage.setItem).mockClear();
  });

  it("restores data saved to AsyncStorage", async () => {
    const statuses: string[] = [];
    const firstStorage = createAppStorage((status) => statuses.push(status));
    const snapshot = JSON.stringify({ projects: [{ id: "project-1" }] });

    await firstStorage.setItem("state", snapshot);
    const reloadedStorage = createAppStorage(() => undefined);

    await expect(reloadedStorage.getItem("state")).resolves.toBe(snapshot);
    expect(
      JSON.parse((await reloadedStorage.getItem("state")) ?? "null"),
    ).toEqual(JSON.parse(snapshot));
    expect(statuses).toEqual(["saving", "saved"]);
  });

  it("serializes nearby saves and reports each operation independently", async () => {
    const pending: Array<{
      resolve: () => void;
      reject: (error: Error) => void;
    }> = [];
    jest.mocked(AsyncStorage.setItem).mockImplementation(
      () =>
        new Promise<void>((resolve, reject) => {
          pending.push({ resolve, reject });
        }),
    );
    const events: Array<[string, number | undefined]> = [];
    const storage = createAppStorage((status, _error, operationId) => {
      events.push([status, operationId]);
    });

    const firstSave = storage.setItem("state", "first");
    const secondSave = storage.setItem("state", "second");
    await flushPromises();

    expect(pending).toHaveLength(1);
    expect(events).toEqual([
      ["saving", 1],
      ["saving", 2],
    ]);

    pending[0].resolve();
    await firstSave;
    await flushPromises();
    expect(pending).toHaveLength(2);
    expect(events).toEqual([
      ["saving", 1],
      ["saving", 2],
      ["saved", 1],
    ]);

    pending[1].resolve();
    await secondSave;
    expect(events).toEqual([
      ["saving", 1],
      ["saving", 2],
      ["saved", 1],
      ["saved", 2],
    ]);
  });

  it("continues the queue after a failed save and keeps failure ownership", async () => {
    const pending: Array<{
      resolve: () => void;
      reject: (error: Error) => void;
    }> = [];
    jest.mocked(AsyncStorage.setItem).mockImplementation(
      () =>
        new Promise<void>((resolve, reject) => {
          pending.push({ resolve, reject });
        }),
    );
    const firstError = new Error("first save failed");
    const events: Array<[string, unknown, number | undefined]> = [];
    const storage = createAppStorage((status, error, operationId) => {
      events.push([status, error, operationId]);
    });

    const firstSave = storage.setItem("state", "first");
    const secondSave = storage.setItem("state", "second");
    await flushPromises();

    pending[0].reject(firstError);
    await expect(firstSave).rejects.toBe(firstError);
    await flushPromises();
    expect(pending).toHaveLength(2);

    pending[1].resolve();
    await secondSave;
    expect(events[2]).toEqual(["error", firstError, 1]);
    expect(events[3]).toEqual(["saved", undefined, 2]);
  });
});

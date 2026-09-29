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

describe("app storage", () => {
  beforeEach(() => {
    mockStorage.clear();
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
});

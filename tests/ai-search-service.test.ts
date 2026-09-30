import {
  runAiSearch,
  type AiSearchService,
} from "@/services/ai-search-service";
import { AiSearchError, type AiSearchState } from "@/types/ai-search";

describe("runAiSearch", () => {
  it("transitions from loading to success with the response", async () => {
    const response = {
      query: "リーダーシップ",
      results: [
        {
          id: "gakuchika-1",
          title: "運営経験",
          summary: "調整力を発揮した経験",
          sourceIds: ["activity-1"],
        },
      ],
    };
    const service: AiSearchService = {
      search: jest.fn().mockResolvedValue(response),
    };
    const states: AiSearchState[] = [];

    await runAiSearch(service, "リーダーシップ", (state) => states.push(state));

    expect(states).toEqual([
      { status: "loading", query: "リーダーシップ" },
      { status: "success", query: "リーダーシップ", response },
    ]);
    expect(service.search).toHaveBeenCalledWith({ query: "リーダーシップ" });
  });

  it("transitions from loading to error without exposing a raw error", async () => {
    const service: AiSearchService = {
      search: jest.fn().mockRejectedValue(new Error("network down")),
    };
    const states: AiSearchState[] = [];

    await runAiSearch(service, "経験", (state) => states.push(state));

    expect(states[0]).toEqual({ status: "loading", query: "経験" });
    expect(states[1]).toMatchObject({
      status: "error",
      query: "経験",
      error: expect.objectContaining({
        code: "request-failed",
        message: "AI検索に失敗しました。",
      }),
    });
    expect(states[1].status === "error" && states[1].error).toBeInstanceOf(
      AiSearchError,
    );
  });
});

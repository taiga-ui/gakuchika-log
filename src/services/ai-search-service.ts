import {
  AiSearchError,
  type AiSearchRequest,
  type AiSearchResponse,
  type AiSearchState,
} from "@/types/ai-search";

export interface AiSearchService {
  search(request: AiSearchRequest): Promise<AiSearchResponse>;
}

export async function runAiSearch(
  service: AiSearchService,
  query: string,
  onStateChange: (state: AiSearchState) => void,
): Promise<void> {
  onStateChange({ status: "loading", query });
  try {
    const response = await service.search({ query });
    onStateChange({ status: "success", query, response });
  } catch (error) {
    const searchError =
      error instanceof AiSearchError
        ? error
        : new AiSearchError("request-failed", "AI検索に失敗しました。");
    onStateChange({ status: "error", query, error: searchError });
  }
}

export const aiSearchService: AiSearchService = {
  async search() {
    throw new AiSearchError(
      "not-configured",
      "AI検索サービスはまだ接続されていません。",
    );
  },
};

import {
  AiSearchError,
  type AiSearchRequest,
  type AiSearchResponse,
} from "@/types/ai-search";

export interface AiSearchService {
  search(request: AiSearchRequest): Promise<AiSearchResponse>;
}

export const aiSearchService: AiSearchService = {
  async search() {
    throw new AiSearchError(
      "not-configured",
      "AI検索サービスはまだ接続されていません。",
    );
  },
};

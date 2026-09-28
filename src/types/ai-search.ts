export type AiSearchRequest = {
  query: string;
};

export type AiSearchResult = {
  id: string;
  title: string;
  summary: string;
  sourceIds: string[];
  score?: number;
};

export type AiSearchResponse = {
  query: string;
  results: AiSearchResult[];
  answer?: string;
};

export type AiSearchErrorCode = "not-configured" | "request-failed";

export class AiSearchError extends Error {
  readonly code: AiSearchErrorCode;

  constructor(code: AiSearchErrorCode, message: string) {
    super(message);
    this.name = "AiSearchError";
    this.code = code;
  }
}

export type AiSearchState =
  | { status: "idle"; query: string }
  | { status: "loading"; query: string }
  | { status: "success"; query: string; response: AiSearchResponse }
  | { status: "error"; query: string; error: AiSearchError };

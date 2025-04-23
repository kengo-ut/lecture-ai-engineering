export interface ChatHistoryWithCreatedAt {
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

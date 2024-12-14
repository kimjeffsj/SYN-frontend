export type WebSocketMessageType = "notification" | "ping" | "error";

export interface WebSocketMessage<T = unknown> {
  type: WebSocketMessageType;
  payload?: T;
}

export type WebSocketEventHandler = (message: WebSocketMessage) => void;

export interface WebSocketOptions {
  maxReconnectAttempts?: number;
  reconnectTimeout?: number;
  pingInterval?: number;
}

export type WebSocketMessageType = "notification" | "ping" | "error";

export interface WebSocketMessage {
  type: WebSocketMessageType;
  // TODO: type any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export type WebSocketEventHandler = (message: WebSocketMessage) => void;

export interface WebSocketOptions {
  maxReconnectAttempts?: number;
  reconnectTimeout?: number;
  pingInterval?: number;
}

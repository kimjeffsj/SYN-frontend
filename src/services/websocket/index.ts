import { storage } from "@/shared/utils/storage";
import {
  WebSocketEventHandler,
  WebSocketMessage,
  WebSocketOptions,
} from "./types";

const DEFAULT_OPTIONS: WebSocketOptions = {
  maxReconnectAttempts: 5,
  reconnectTimeout: 3000,
  pingInterval: 30000,
};

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private options: WebSocketOptions;
  private messageHandlers: Set<WebSocketEventHandler> = new Set();
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(options: WebSocketOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  connect() {
    const token = storage.getToken();
    const user = storage.getUser();

    if (!token || !user) {
      console.error("Authentication required for WebSocket connection");
      return;
    }

    const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/notifications/${
      user.id
    }?token=${token}`;

    this.ws = new WebSocket(wsUrl);
    this.setupEventHandlers();
    this.startPingInterval();
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket connected successfully");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === "ping") {
          this.handlePing();
          return;
        }

        this.broadcastMessage(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onclose = (event) => {
      this.cleanup();
      if (!event.wasClean) {
        this.handleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.cleanup();
    };
  }

  private handlePing() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "pong" }));
    }
  }

  private startPingInterval() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, this.options.pingInterval);
  }

  private handleReconnect() {
    if (this.reconnectAttempts < (this.options.maxReconnectAttempts || 5)) {
      setTimeout(() => {
        console.log(
          `Attempting to reconnect... (${this.reconnectAttempts + 1})`
        );
        this.reconnectAttempts++;
        this.connect();
      }, this.options.reconnectTimeout);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  private broadcastMessage(message: WebSocketMessage) {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error("Error in message handler:", error);
      }
    });
  }

  addMessageHandler(handler: WebSocketEventHandler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler: WebSocketEventHandler) {
    this.messageHandlers.delete(handler);
  }

  private cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  disconnect() {
    this.cleanup();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();

export type { WebSocketMessage, WebSocketEventHandler, WebSocketOptions };

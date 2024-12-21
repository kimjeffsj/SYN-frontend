import { NotificationPayload } from "@/features/notifications/type/notification";
import { storage } from "@/shared/utils/storage";

export interface WebSocketMessage<T = unknown> {
  type: "notification" | "ping" | "pong" | "error";
  payload?: T;
  timestamp?: string;
}

export type WebSocketEventHandler = (message: WebSocketMessage) => void;

export interface WebSocketOptions {
  maxReconnectAttempts?: number;
  reconnectTimeout?: number;
  pingInterval?: number;
}

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
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pendingMessages: WebSocketMessage[] = [];

  constructor(options: WebSocketOptions = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  public connect(): void {
    const token = storage.getToken();
    const user = storage.getUser();

    if (!token || !user) {
      console.error("Authentication required for WebSocket connection");
      return;
    }

    try {
      const wsUrl = `wss//${import.meta.env.VITE_WS_URL}/ws/notifications/${
        user.id
      }?token=${token}`;
      console.log("Connecting to WebSocket:", wsUrl);

      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
      this.startPingInterval();
    } catch (error) {
      console.error("Error establishing WebSocket connection:", error);
      this.handleReconnect();
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket connected successfully");
      this.reconnectAttempts = 0;
      this.processPendingMessages();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        if (message.type === "ping") {
          this.handlePing();
          return;
        }

        if (message.type === "notification") {
          this.handleNotification(message.payload as NotificationPayload);
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

  private handlePing(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "pong" }));
    }
  }

  private handleNotification(notification: NotificationPayload): void {
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/notification-icon.png",
      });
    }

    this.broadcastMessage({
      type: "notification",
      payload: notification,
    });
  }

  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, this.options.pingInterval);
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= (this.options.maxReconnectAttempts || 5)) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectTimer = setTimeout(() => {
      console.log(`Attempting to reconnect... (${this.reconnectAttempts + 1})`);
      this.reconnectAttempts++;
      this.connect();
    }, this.calculateReconnectTimeout());
  }

  private calculateReconnectTimeout(): number {
    return Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.options.reconnectTimeout || 30000
    );
  }

  private processPendingMessages(): void {
    while (this.pendingMessages.length > 0 && this.isConnected()) {
      const message = this.pendingMessages.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  private broadcastMessage(message: WebSocketMessage): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        console.error("Error in message handler:", error);
      }
    });
  }

  public addMessageHandler(handler: WebSocketEventHandler): void {
    this.messageHandlers.add(handler);
  }

  public removeMessageHandler(handler: WebSocketEventHandler): void {
    this.messageHandlers.delete(handler);
  }

  public sendMessage(message: WebSocketMessage): boolean {
    if (!this.isConnected()) {
      this.pendingMessages.push(message);
      return false;
    }

    try {
      this.ws?.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      this.pendingMessages.push(message);
      return false;
    }
  }

  private cleanup(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  public disconnect(): void {
    this.cleanup();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public getConnectionStats(): {
    isConnected: boolean;
    reconnectAttempts: number;
    pendingMessages: number;
  } {
    return {
      isConnected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      pendingMessages: this.pendingMessages.length,
    };
  }
}

export const wsService = new WebSocketService();

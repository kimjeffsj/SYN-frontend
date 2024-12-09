export type TradeType = "TRADE" | "GIVEAWAY";
export type TradeStatus = "OPEN" | "PENDING" | "COMPLETED";
export type UrgencyLevel = "high" | "medium" | "low";

export interface Author {
  name: string;
  position: string;
  avatar: string;
}

export interface Shift {
  date: string;
  time: string;
  type: string;
}

export interface ShiftTradeRequest {
  id: number;
  type: TradeType;
  author: Author;
  originalShift: Shift;
  preferredShift?: Shift;
  reason: string;
  status: TradeStatus;
  responses: number;
  createdAt: string;
  urgency: UrgencyLevel;
}

export interface ShiftTradeResponse {
  id: number;
  author: Author;
  originalShift: Shift;
  content: string;
  timestamp: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

export interface CreateTradeRequest {
  type: TradeType;
  originalShiftId: number;
  preferredShiftId?: number;
  reason?: string;
  urgency: UrgencyLevel;
}

export interface CreateTradeResponse {
  content?: string;
  offeredShiftId: number;
}

export interface ShiftTradeState {
  requests: ShiftTradeRequest[];
  selectedRequest: ShiftTradeRequest | null;
  responses: ShiftTradeResponse[];
  isLoading: boolean;
  error: string | null;
}

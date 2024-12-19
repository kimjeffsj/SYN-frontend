export type TradeType = "TRADE" | "GIVEAWAY";
export type TradeStatus = "OPEN" | "COMPLETED" | "CANCELLED";
export type UrgencyLevel = "high" | "normal";
export type ResponseStatus = "ACCEPTED" | "REJECTED" | "PENDING";

export interface UserInfo {
  id: number;
  name: string;
  position?: string;
  department?: string;
}

export interface Schedule {
  id: number;
  start_time: string;
  end_time: string;
  shift_type: string;
  user_id: number;
  status: string;
}

export interface ShiftTradeRequest {
  id: number;
  type: TradeType;
  author: UserInfo;
  original_shift_id: number;
  original_shift: Schedule;
  preferred_shift_id?: number;
  preferred_shift?: Schedule;
  reason: string;
  status: TradeStatus;
  urgency: UrgencyLevel;
  responses: ShiftTradeResponse[];
  created_at: string;
  updated_at?: string;
}

export interface ShiftTradeResponse {
  id: number;
  respondent: UserInfo;
  trade_request_id: number;

  offered_shift: {
    start_time: string;
    end_time: string;
    shift_type: string;
  };
  content?: string;
  status: ResponseStatus;
  created_at: string;
}

export interface CreateTradeRequest {
  type: TradeType;
  original_shift_id: number;
  preferred_shift_id?: number;
  reason: string;
  urgency: UrgencyLevel;
}

export interface CreateTradeResponse {
  trade_request_id: number;
  offered_shift_id: number;
  content?: string;
}

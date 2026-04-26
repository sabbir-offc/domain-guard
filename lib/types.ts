export type BlockType = "navigation" | "input" | "paste";

export interface Stats {
  total24h: number;
  total7d: number;
  totalAll: number;
  topDomains: Array<{ _id: string; count: number }>;
  topEmployees: Array<{ _id: string; count: number }>;
  byType: Array<{ _id: BlockType; count: number }>;
}

export interface BlockEvent {
  _id: string;
  employeeId: string;
  type: BlockType;
  domain?: string;
  url?: string;
  timestamp: string;
  userAgent?: string;
}

export interface AllowlistData {
  domains: string[];
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface TimeseriesPoint {
  date: string;
  navigation: number;
  input: number;
  paste: number;
  total: number;
}

export interface TimeseriesData {
  days: TimeseriesPoint[];
}

export interface LoginState {
  error?: string;
}

export type RequestStatus = "pending" | "approved" | "denied";

export interface AccessRequest {
  _id: string;
  employeeId: string;
  domain: string;
  url?: string;
  reason: string;
  status: RequestStatus;
  decidedBy?: string;
  decidedAt?: string;
  decisionNote?: string;
  createdAt: string;
}

export interface AccessRequestsResponse {
  requests: AccessRequest[];
  pendingCount: number;
}

export interface EmployeeSummary {
  employeeId: string;
  totalBlocks: number;
  recentBlocks: number;
  lastActivity: string | null;
  pendingRequests: number;
}

export interface EmployeeDetail {
  employeeId: string;
  total: number;
  recent: number;
  firstSeen: string | null;
  lastSeen: string | null;
  events: BlockEvent[];
  topDomains: Array<{ _id: string; count: number }>;
  timeseries: TimeseriesPoint[];
  requests: AccessRequest[];
}

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  verified: true;
  email: string;
  flags: number;
  banner: string;
  accent_color: number;
  premium_type: number;
  public_flags: number;
  avatar_decoration_data: {
    sku_id: string;
    asset: string;
  };
}

export interface Seminar {
  id: string;
  title: string;
  sessions?: SeminarSession[];
  createdAt: number;
  updatedAt: number;
}

export interface SeminarSession {
  id: string;
  seminarId: string;
  title: string;
  description: string;
  locked: boolean;
  readings?: string[];
  notes?: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ResponseWithMessage {
  message: string;
}

export interface APIError<T = unknown> extends ResponseWithMessage {
  status: number;
  detail?: T;
}

export const isAPIError = (data: unknown): data is APIError => {
  if (!data) return false;
  if (typeof data != "object") return false;
  if (!("status" in data)) return false;
  if (typeof data["status"] != "number") return false;
  if (!("message" in data)) return false;
  if (typeof data["message"] != "string") return false;
  return true;
};

export interface ResponseWithData<T> extends Partial<ResponseWithMessage> {
  data: T;
}

export type ResponseObject<T = void> = T extends void
  ? ResponseWithMessage
  : ResponseWithData<T>;

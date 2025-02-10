import "express-session";
import type { User } from "./dtos";

declare module "express-session" {
  interface SessionData {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
  }
}

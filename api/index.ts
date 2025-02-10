import type { VercelRequest, VercelResponse } from "@vercel/node";
import { STATUS_CODES } from "http";

export function GET(req: VercelRequest, res: VercelResponse) {
  res.json({
    status: STATUS_CODES.OK,
    message: "healthy",
  });
}

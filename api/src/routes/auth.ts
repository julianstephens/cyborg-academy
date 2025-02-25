import { env } from "@/env";
import { authGuard } from "@/middleware";
import { OauthService } from "@/services";
import { doLogout } from "@/utils";
import type { AuthSession, ResponseObject } from "cyborg-utils";
import { Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

const oauth = new OauthService();

router.get("/discord", oauth.authorize);
router.get("/discord/callback", oauth.exchange);
router.get("/me", authGuard, (req: Request, res: Response) => {
  const data: ResponseObject<AuthSession> = {
    data: {
      user: req.session.user,
      isAdmin: env.ADMIN_USERS.indexOf(req.session.user?.id) > 0,
    },
  };
  res.json(data);
});
router.get("/logout", async (req: Request, res: Response) => {
  doLogout(req, res);
  res.sendStatus(StatusCodes.NO_CONTENT);
});

export default router;

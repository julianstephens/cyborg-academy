import { authGuard } from "@/middleware";
import { OauthService } from "@/services";
import { doLogout } from "@/utils";
import type { ResponseObject, User } from "cyborg-utils";
import { Router, type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

const router = Router();

const oauth = new OauthService();

router.get("/discord", oauth.authorize);
router.get("/discord/callback", oauth.exchange);
router.get("/me", authGuard, (req: Request, res: Response) => {
  const data: ResponseObject<User> = {
    data: req.session.user,
  };
  res.json(data);
});
router.get("/logout", async (req: Request, res: Response) => {
  doLogout(req, res);
  res.sendStatus(StatusCodes.NO_CONTENT);
});

export default router;

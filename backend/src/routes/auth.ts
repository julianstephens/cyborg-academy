import { env } from "@/env";
import { authGuard } from "@/middleware";
import { OauthService } from "@/services";
import type { ResponseObject, User } from "cyborg-utils";
import { Router, type Request, type Response } from "express";

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
  req.session.destroy((err) => {
    if (err) throw err;
    res.clearCookie("connect.sid");
    res.redirect(env.APP_URL);
  });
});

export default router;

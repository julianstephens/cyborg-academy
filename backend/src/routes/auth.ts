import { authGuard } from "@/middleware";
import { OauthService } from "@/services";
import type { ResponseObject, User } from "cyborg-types";
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

export default router;

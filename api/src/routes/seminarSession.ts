import { authGuard, validateBody } from "@/middleware";
import { SeminarSessionService } from "@/services";
import { IDError } from "@/utils";
import {
  newSeminarSessionSchema,
  seminarSessionUpdateSchema,
  type ResponseObject,
  type SeminarSession,
} from "cyborg-utils";
import { Router, type Request, type Response } from "express";

const router = Router();
router.use(authGuard);
const sessionSVC = new SeminarSessionService();

router.get("/", async (req: Request, res: Response) => {
  const filters: Partial<SeminarSession> = {};
  if (req.query.title) filters.title = req.query.title as string;
  if (req.query.createdAt)
    filters.createdAt = parseInt(req.query.createdAt as string);
  if (req.query.updatedAt)
    filters.updatedAt = parseInt(req.query.updatedAt as string);

  const data = await sessionSVC.list(filters);
  res.json({ data } as ResponseObject<SeminarSession[]>);
});
router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) throw IDError;
  const data = await sessionSVC.get(id);
  res.json({ data } as ResponseObject<SeminarSession>);
});
router.post(
  "/session",
  validateBody(newSeminarSessionSchema),
  async (req: Request, res: Response) => {
    const data = await sessionSVC.create(req.body);
    res.json({ data } as ResponseObject<SeminarSession>);
  },
);
router.put(
  "/:id",
  validateBody(seminarSessionUpdateSchema),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw IDError;
    const data = await sessionSVC.update(id, req.body);
    res.json({ data } as ResponseObject<SeminarSession | undefined>);
  },
);
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) throw IDError;
  const data = await sessionSVC.update(id, req.body);
  res.json({ data } as ResponseObject<SeminarSession | undefined>);
});

export default router;

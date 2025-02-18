import { authGuard, validateBody } from "@/middleware";
import { SeminarService } from "@/services";
import { IDError } from "@/utils";
import routeCache from "route-cache";
import {
  newSeminarSchema,
  type ResponseObject,
  type Seminar,
  seminarUpdateSchema,
} from "cyborg-utils";
import type { Request, Response } from "express";
import { Router } from "express";

const router = Router();
router.use(authGuard);
const seminarSVC = new SeminarService();

router.get(
  "/",
  routeCache.cacheSeconds(60 * 60),
  async (req: Request, res: Response) => {
    const filters: Partial<Seminar> = {};
    if (req.query.title) filters.title = req.query.title as string;
    if (req.query.draft)
      filters.draft = (req.query.draft as string).toLowerCase() === "true";
    if (req.query.createdAt)
      filters.createdAt = parseInt(req.query.createdAt as string);
    if (req.query.updatedAt)
      filters.updatedAt = parseInt(req.query.updatedAt as string);

    const data = await seminarSVC.list(filters);
    res.json({ data } as ResponseObject<Seminar[]>);
  },
);
router.get(
  "/:id",
  routeCache.cacheSeconds(60 * 60),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw IDError;
    const data = await seminarSVC.get(id);
    res.json({ data } as ResponseObject<Seminar>);
  },
);
router.post(
  "/",
  validateBody(newSeminarSchema),
  async (req: Request, res: Response) => {
    routeCache.removeCache("/seminars");
    const data = await seminarSVC.create(req.body);
    res.json({ data } as ResponseObject<Seminar>);
  },
);
router.put(
  "/:id",
  validateBody(seminarUpdateSchema),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw IDError;
    routeCache.removeCache("/seminars");
    routeCache.removeCache(`/seminars/${id}`);
    const data = await seminarSVC.update(id, req.body);
    res.json({ data } as ResponseObject<Seminar | undefined>);
  },
);
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) throw IDError;
  routeCache.removeCache("/seminars");
  routeCache.removeCache(`/seminars/${id}`);
  const data = await seminarSVC.update(id, req.body);
  res.json({ data } as ResponseObject<Seminar | undefined>);
});

export default router;

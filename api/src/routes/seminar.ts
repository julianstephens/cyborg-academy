import { authGuard, validateBody } from "@/middleware.js";
import { SeminarService } from "@/services";
import { cache } from "@/services/cache";
import { IDError } from "@/utils.js";
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

/** Retrieve all seminars */
router.get("/", cache.cache(), async (req: Request, res: Response) => {
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
});
/** Retrieve a specific seminar */
router.get("/:id", cache.cache(), async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) throw IDError;
  const data = await seminarSVC.get(id);
  res.json({ data } as ResponseObject<Seminar>);
});
/** Create a seminar */
router.post(
  "/",
  validateBody(newSeminarSchema),
  async (req: Request, res: Response) => {
    const data = await seminarSVC.create(req.body);
    const invalidKeys = await cache.keys(req.baseUrl + req.path);
    invalidKeys.forEach((key) => {
      cache.clear(key);
    });
    cache.clear(req.baseUrl + req.path);
    res.json({ data } as ResponseObject<Seminar>);
  },
);
/** Update a seminar */
router.put(
  "/:id",
  validateBody(seminarUpdateSchema),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw IDError;
    const data = await seminarSVC.update(id, req.body);
    const invalidKeys = await cache.keys(req.baseUrl);
    invalidKeys.concat(await cache.keys(req.baseUrl + req.path));
    invalidKeys.forEach((key) => {
      cache.clear(key);
    });
    res.json({ data } as ResponseObject<Seminar | undefined>);
  },
);
/** Delete a seminar */
router.delete("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) throw IDError;
  const data = await seminarSVC.delete(id);
  const invalidKeys = await cache.keys(req.baseUrl + "/");
  const allKeys = invalidKeys.concat(await cache.keys(req.baseUrl + req.path));
  allKeys.forEach((key) => {
    cache.clear(key);
  });
  cache.clear(req.baseUrl + "/");
  cache.clear(req.baseUrl + req.path);
  res.json({ data } as ResponseObject<Seminar | undefined>);
});

export default router;

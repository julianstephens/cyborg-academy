import { SeminarService } from "@/services";
import { ResponseObject, Seminar } from "cyborg-types";
import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();
const seminarSVC = new SeminarService();

router.get("/seminar", async (req: Request, res: Response) => {
  const filters: Partial<Seminar> = {};
  if (req.query.title) filters.title = req.query.title as string;
  if (req.query.createdAt)
    filters.createdAt = parseInt(req.query.createdAt as string);
  if (req.query.updatedAt)
    filters.updatedAt = parseInt(req.query.updatedAt as string);

  const data = await seminarSVC.list(filters);
  res.json({ data } as ResponseObject<Seminar[]>);
});
router.get("/seminar/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await seminarSVC.get(id);
  res.json({ data } as ResponseObject<Seminar>);
});
router.post("/seminar", async (req: Request, res: Response) => {
  const { title } = req.body;
  const data = await seminarSVC.create(title);
  res.json({ data } as ResponseObject<Seminar>);
});
router.put("/seminar/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await seminarSVC.update(id, req.body);
  res.json({ data } as ResponseObject<Seminar | undefined>);
});
router.delete("/seminar/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await seminarSVC.update(id, req.body);
  res.json({ data } as ResponseObject<Seminar | undefined>);
});

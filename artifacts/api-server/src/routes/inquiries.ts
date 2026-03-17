import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { inquiriesTable, propertiesTable } from "@workspace/db/schema";
import { eq, and, type SQL } from "drizzle-orm";

const router: IRouter = Router();

function inquiryToResponse(
  inq: typeof inquiriesTable.$inferSelect,
  propertyTitle?: string
) {
  return {
    id: String(inq.id),
    name: inq.name,
    phone: inq.phone ?? null,
    email: inq.email,
    message: inq.message,
    propertyId: inq.propertyId ?? null,
    propertyTitle: propertyTitle ?? null,
    status: inq.status,
    notes: inq.notes ?? null,
    createdAt: inq.createdAt.toISOString(),
    updatedAt: inq.updatedAt.toISOString(),
  };
}

router.get("/", async (req: Request, res: Response) => {
  const {
    status,
    propertyId,
    page = "1",
    limit = "20",
  } = req.query as Record<string, string>;

  const conditions: SQL[] = [];
  if (status) conditions.push(eq(inquiriesTable.status, status));
  if (propertyId) conditions.push(eq(inquiriesTable.propertyId, propertyId));

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [rows, allRows] = await Promise.all([
    db
      .select()
      .from(inquiriesTable)
      .where(where)
      .limit(limitNum)
      .offset(offset)
      .orderBy(inquiriesTable.createdAt),
    db.select().from(inquiriesTable).where(where),
  ]);

  const total = allRows.length;

  const propertyIds = [
    ...new Set(rows.map((r) => r.propertyId).filter(Boolean) as string[]),
  ];
  const properties =
    propertyIds.length > 0
      ? await db
          .select({ id: propertiesTable.id, title: propertiesTable.title })
          .from(propertiesTable)
      : [];
  const propMap = new Map(
    properties.map((p) => [String(p.id), p.title])
  );

  res.json({
    inquiries: rows.map((r) =>
      inquiryToResponse(r, r.propertyId ? propMap.get(r.propertyId) : undefined)
    ),
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

router.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  const [created] = await db
    .insert(inquiriesTable)
    .values({
      name: data.name,
      phone: data.phone ?? null,
      email: data.email,
      message: data.message,
      propertyId: data.propertyId ?? null,
      status: "new",
    })
    .returning();

  let propertyTitle: string | undefined;
  if (created.propertyId) {
    const [prop] = await db
      .select({ title: propertiesTable.title })
      .from(propertiesTable)
      .where(eq(propertiesTable.id, parseInt(created.propertyId)));
    propertyTitle = prop?.title;
  }

  res.status(201).json(inquiryToResponse(created, propertyTitle));
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const [inq] = await db
    .select()
    .from(inquiriesTable)
    .where(eq(inquiriesTable.id, id));
  if (!inq) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(inquiryToResponse(inq));
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const updateData: Partial<typeof inquiriesTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (data.status !== undefined) updateData.status = data.status;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const [updated] = await db
    .update(inquiriesTable)
    .set(updateData)
    .where(eq(inquiriesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(inquiryToResponse(updated));
});

export default router;

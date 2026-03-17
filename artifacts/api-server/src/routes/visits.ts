import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { visitsTable, propertiesTable } from "@workspace/db/schema";
import { eq, and, type SQL } from "drizzle-orm";

const router: IRouter = Router();

function visitToResponse(
  v: typeof visitsTable.$inferSelect,
  propertyTitle?: string
) {
  return {
    id: String(v.id),
    clientName: v.clientName,
    clientEmail: v.clientEmail ?? null,
    clientPhone: v.clientPhone ?? null,
    propertyId: v.propertyId ?? null,
    propertyTitle: propertyTitle ?? null,
    visitDate: v.visitDate.toISOString(),
    notes: v.notes ?? null,
    status: v.status,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
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
  if (status) conditions.push(eq(visitsTable.status, status));
  if (propertyId) conditions.push(eq(visitsTable.propertyId, propertyId));

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [rows, allRows] = await Promise.all([
    db
      .select()
      .from(visitsTable)
      .where(where)
      .limit(limitNum)
      .offset(offset)
      .orderBy(visitsTable.visitDate),
    db.select().from(visitsTable).where(where),
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
  const propMap = new Map(properties.map((p) => [String(p.id), p.title]));

  res.json({
    visits: rows.map((r) =>
      visitToResponse(r, r.propertyId ? propMap.get(r.propertyId) : undefined)
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
    .insert(visitsTable)
    .values({
      clientName: data.clientName,
      clientEmail: data.clientEmail ?? null,
      clientPhone: data.clientPhone ?? null,
      propertyId: data.propertyId ?? null,
      visitDate: new Date(data.visitDate),
      notes: data.notes ?? null,
      status: "scheduled",
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

  res.status(201).json(visitToResponse(created, propertyTitle));
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const [v] = await db
    .select()
    .from(visitsTable)
    .where(eq(visitsTable.id, id));
  if (!v) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(visitToResponse(v));
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const updateData: Partial<typeof visitsTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (data.clientName !== undefined) updateData.clientName = data.clientName;
  if (data.clientEmail !== undefined) updateData.clientEmail = data.clientEmail;
  if (data.clientPhone !== undefined) updateData.clientPhone = data.clientPhone;
  if (data.visitDate !== undefined)
    updateData.visitDate = new Date(data.visitDate);
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.status !== undefined) updateData.status = data.status;

  const [updated] = await db
    .update(visitsTable)
    .set(updateData)
    .where(eq(visitsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(visitToResponse(updated));
});

export default router;

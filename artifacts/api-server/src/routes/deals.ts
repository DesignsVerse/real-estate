import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { dealsTable, propertiesTable } from "@workspace/db/schema";
import { eq, and, type SQL } from "drizzle-orm";

const router: IRouter = Router();

function dealToResponse(
  d: typeof dealsTable.$inferSelect,
  propertyTitle?: string
) {
  return {
    id: String(d.id),
    propertyId: d.propertyId ?? null,
    propertyTitle: propertyTitle ?? null,
    clientName: d.clientName,
    clientEmail: d.clientEmail ?? null,
    clientPhone: d.clientPhone ?? null,
    offerPrice: Number(d.offerPrice),
    commission: d.commission ? Number(d.commission) : null,
    dealStage: d.dealStage,
    notes: d.notes ?? null,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  };
}

router.get("/", async (req: Request, res: Response) => {
  const {
    stage,
    propertyId,
    page = "1",
    limit = "20",
  } = req.query as Record<string, string>;

  const conditions: SQL[] = [];
  if (stage) conditions.push(eq(dealsTable.dealStage, stage));
  if (propertyId) conditions.push(eq(dealsTable.propertyId, propertyId));

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const [rows, allRows] = await Promise.all([
    db
      .select()
      .from(dealsTable)
      .where(where)
      .limit(limitNum)
      .offset(offset)
      .orderBy(dealsTable.createdAt),
    db.select().from(dealsTable).where(where),
  ]);

  const total = allRows.length;

  const properties = await db
    .select({ id: propertiesTable.id, title: propertiesTable.title })
    .from(propertiesTable);
  const propMap = new Map(properties.map((p) => [String(p.id), p.title]));

  res.json({
    deals: rows.map((r) =>
      dealToResponse(r, r.propertyId ? propMap.get(r.propertyId) : undefined)
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
    .insert(dealsTable)
    .values({
      propertyId: data.propertyId ?? null,
      clientName: data.clientName,
      clientEmail: data.clientEmail ?? null,
      clientPhone: data.clientPhone ?? null,
      offerPrice: String(data.offerPrice),
      commission: data.commission ? String(data.commission) : null,
      dealStage: data.dealStage ?? "lead",
      notes: data.notes ?? null,
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

  res.status(201).json(dealToResponse(created, propertyTitle));
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const [d] = await db
    .select()
    .from(dealsTable)
    .where(eq(dealsTable.id, id));
  if (!d) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(dealToResponse(d));
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const updateData: Partial<typeof dealsTable.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (data.propertyId !== undefined) updateData.propertyId = data.propertyId;
  if (data.clientName !== undefined) updateData.clientName = data.clientName;
  if (data.clientEmail !== undefined) updateData.clientEmail = data.clientEmail;
  if (data.clientPhone !== undefined) updateData.clientPhone = data.clientPhone;
  if (data.offerPrice !== undefined)
    updateData.offerPrice = String(data.offerPrice);
  if (data.commission !== undefined)
    updateData.commission = data.commission ? String(data.commission) : null;
  if (data.dealStage !== undefined) updateData.dealStage = data.dealStage;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const [updated] = await db
    .update(dealsTable)
    .set(updateData)
    .where(eq(dealsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(dealToResponse(updated));
});

export default router;

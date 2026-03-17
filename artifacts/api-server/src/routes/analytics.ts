import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  propertiesTable,
  inquiriesTable,
  visitsTable,
  dealsTable,
} from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/dashboard", async (_req: Request, res: Response) => {
  const [properties, inquiries, visits, deals] = await Promise.all([
    db.select().from(propertiesTable),
    db.select().from(inquiriesTable).orderBy(desc(inquiriesTable.createdAt)),
    db.select().from(visitsTable).orderBy(desc(visitsTable.visitDate)),
    db.select().from(dealsTable),
  ]);

  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === "active").length;
  const soldProperties = properties.filter((p) => p.status === "sold").length;
  const rentedProperties = properties.filter((p) => p.status === "rented").length;

  const totalInquiries = inquiries.length;
  const activeInquiries = inquiries.filter(
    (i) => i.status === "new" || i.status === "contacted"
  ).length;

  const scheduledVisits = visits.filter((v) => v.status === "scheduled").length;
  const completedVisits = visits.filter((v) => v.status === "completed").length;

  const totalDeals = deals.length;
  const dealsInProgress = deals.filter(
    (d) => d.dealStage === "negotiation" || d.dealStage === "contract"
  ).length;
  const closedDeals = deals.filter((d) => d.dealStage === "closed").length;

  const totalRevenue = deals
    .filter((d) => d.dealStage === "closed")
    .reduce((sum, d) => sum + (Number(d.commission) || 0), 0);

  const recentInquiries = inquiries.slice(0, 5).map((inq) => ({
    id: String(inq.id),
    name: inq.name,
    phone: inq.phone ?? null,
    email: inq.email,
    message: inq.message,
    propertyId: inq.propertyId ?? null,
    propertyTitle: null,
    status: inq.status,
    notes: inq.notes ?? null,
    createdAt: inq.createdAt.toISOString(),
    updatedAt: inq.updatedAt.toISOString(),
  }));

  const recentVisits = visits.slice(0, 5).map((v) => ({
    id: String(v.id),
    clientName: v.clientName,
    clientEmail: v.clientEmail ?? null,
    clientPhone: v.clientPhone ?? null,
    propertyId: v.propertyId ?? null,
    propertyTitle: null,
    visitDate: v.visitDate.toISOString(),
    notes: v.notes ?? null,
    status: v.status,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
  }));

  res.json({
    totalProperties,
    activeProperties,
    soldProperties,
    rentedProperties,
    totalInquiries,
    activeInquiries,
    scheduledVisits,
    completedVisits,
    totalDeals,
    dealsInProgress,
    closedDeals,
    totalRevenue,
    recentInquiries,
    recentVisits,
  });
});

export default router;

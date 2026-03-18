import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { propertiesTable } from "@workspace/db/schema";
import { eq, like, gte, lte, and, type SQL } from "drizzle-orm";
import { getString } from "../utils/getString";

const router: IRouter = Router();

function propertyToResponse(p: typeof propertiesTable.$inferSelect) {
  const imageUrls = (p.imageUrls as string[]) ?? [];
  const images = imageUrls.map((url, i) => ({
    id: String(i),
    url,
    alt: p.title,
    isPrimary: i === 0,
  }));
  return {
    id: String(p.id),
    title: p.title,
    description: p.description ?? undefined,
    price: Number(p.price),
    type: p.type,
    propertyType: p.propertyType,
    status: p.status,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    area: Number(p.area),
    location: p.location,
    address: p.address ?? undefined,
    city: p.city ?? undefined,
    country: p.country ?? undefined,
    latitude: p.latitude ? Number(p.latitude) : null,
    longitude: p.longitude ? Number(p.longitude) : null,
    amenities: (p.amenities as string[]) ?? [],
    images,
    agentName: p.agentName ?? null,
    agentPhone: p.agentPhone ?? null,
    agentEmail: p.agentEmail ?? null,
    featured: p.featured,
    possessionStatus: p.possessionStatus ?? null,
    possessionDate: p.possessionDate ? p.possessionDate.toISOString() : null,
    facing: p.facing ?? null,
    vastuCompliant: p.vastuCompliant ?? null,
    nearbyMetro: p.nearbyMetro ?? null,
    nearbySchool: p.nearbySchool ?? null,
    nearbyHospital: p.nearbyHospital ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/", async (req: Request, res: Response) => {
  const location = getString(req.query.location);
  const type = getString(req.query.type);
  const minPrice = getString(req.query.minPrice);
  const maxPrice = getString(req.query.maxPrice);
  const bedrooms = getString(req.query.bedrooms);
  const bathrooms = getString(req.query.bathrooms);
  const status = getString(req.query.status);
  const featured = getString(req.query.featured);
  const page = getString(req.query.page) || "1";
  const limit = getString(req.query.limit) || "12";

  const conditions: SQL[] = [];
  if (location)
    conditions.push(like(propertiesTable.location, `%${location}%`));
  if (type) conditions.push(eq(propertiesTable.type, type));
  if (status) conditions.push(eq(propertiesTable.status, status));
  if (minPrice) conditions.push(gte(propertiesTable.price, minPrice));
  if (maxPrice) conditions.push(lte(propertiesTable.price, maxPrice));
  if (bedrooms)
    conditions.push(eq(propertiesTable.bedrooms, parseInt(bedrooms)));
  if (bathrooms)
    conditions.push(eq(propertiesTable.bathrooms, parseInt(bathrooms)));
  if (featured === "true")
    conditions.push(eq(propertiesTable.featured, true));

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [allProps, allCount] = await Promise.all([
    db
      .select()
      .from(propertiesTable)
      .where(where)
      .limit(limitNum)
      .offset(offset),
    db.select().from(propertiesTable).where(where),
  ]);

  const total = allCount.length;
  const totalPages = Math.ceil(total / limitNum);

  res.json({
    properties: allProps.map(propertyToResponse),
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
  });
});

router.post("/", async (req: Request, res: Response) => {
  const data = req.body;
  const [created] = await db
    .insert(propertiesTable)
    .values({
      title: data.title,
      description: data.description,
      price: String(data.price),
      type: data.type ?? "sale",
      propertyType: data.propertyType ?? "apartment",
      status: "active",
      bedrooms: data.bedrooms ?? 0,
      bathrooms: data.bathrooms ?? 0,
      area: String(data.area ?? 0),
      location: data.location,
      address: data.address,
      city: data.city,
      country: data.country,
      latitude: data.latitude ? String(data.latitude) : null,
      longitude: data.longitude ? String(data.longitude) : null,
      amenities: data.amenities ?? [],
      imageUrls: data.imageUrls ?? [],
      agentName: data.agentName,
      agentPhone: data.agentPhone,
      agentEmail: data.agentEmail,
      featured: data.featured ?? false,
      possessionStatus: data.possessionStatus ?? "ready_to_move",
      possessionDate: data.possessionDate ? new Date(data.possessionDate) : null,
      facing: data.facing ?? null,
      vastuCompliant: data.vastuCompliant ?? false,
      nearbyMetro: data.nearbyMetro ?? null,
      nearbySchool: data.nearbySchool ?? null,
      nearbyHospital: data.nearbyHospital ?? null,
    })
    .returning();
  res.status(201).json(propertyToResponse(created));
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(getString(req.params.id));
  const [prop] = await db
    .select()
    .from(propertiesTable)
    .where(eq(propertiesTable.id, id));
  if (!prop) {
    res.status(404).json({ error: "Not found", message: "Property not found" });
    return;
  }
  res.json(propertyToResponse(prop));
});

router.put("/:id", async (req: Request, res: Response) => {
  const id = parseInt(getString(req.params.id));
  const data = req.body;
  const updateData: Partial<typeof propertiesTable.$inferInsert> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = String(data.price);
  if (data.type !== undefined) updateData.type = data.type;
  if (data.propertyType !== undefined)
    updateData.propertyType = data.propertyType;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.bedrooms !== undefined) updateData.bedrooms = data.bedrooms;
  if (data.bathrooms !== undefined) updateData.bathrooms = data.bathrooms;
  if (data.area !== undefined) updateData.area = String(data.area);
  if (data.location !== undefined) updateData.location = data.location;
  if (data.address !== undefined) updateData.address = data.address;
  if (data.city !== undefined) updateData.city = data.city;
  if (data.country !== undefined) updateData.country = data.country;
  if (data.amenities !== undefined) updateData.amenities = data.amenities;
  if (data.imageUrls !== undefined) updateData.imageUrls = data.imageUrls;
  if (data.agentName !== undefined) updateData.agentName = data.agentName;
  if (data.agentPhone !== undefined) updateData.agentPhone = data.agentPhone;
  if (data.agentEmail !== undefined) updateData.agentEmail = data.agentEmail;
  if (data.featured !== undefined) updateData.featured = data.featured;
  if (data.possessionStatus !== undefined) updateData.possessionStatus = data.possessionStatus;
  if (data.possessionDate !== undefined) updateData.possessionDate = data.possessionDate ? new Date(data.possessionDate) : null;
  if (data.facing !== undefined) updateData.facing = data.facing;
  if (data.vastuCompliant !== undefined) updateData.vastuCompliant = data.vastuCompliant;
  if (data.nearbyMetro !== undefined) updateData.nearbyMetro = data.nearbyMetro;
  if (data.nearbySchool !== undefined) updateData.nearbySchool = data.nearbySchool;
  if (data.nearbyHospital !== undefined) updateData.nearbyHospital = data.nearbyHospital;

  updateData.updatedAt = new Date();

  const [updated] = await db
    .update(propertiesTable)
    .set(updateData)
    .where(eq(propertiesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(propertyToResponse(updated));
});

router.delete("/:id", async (req: Request, res: Response) => {
  const id = parseInt(getString(req.params.id));
  await db.delete(propertiesTable).where(eq(propertiesTable.id, id));
  res.json({ success: true, message: "Property deleted" });
});

export default router;

import { db } from "@workspace/db";
import {
  propertiesTable,
  inquiriesTable,
  visitsTable,
  dealsTable,
} from "@workspace/db/schema";

const sampleProperties = [
  {
    title: "Luxury Beachfront Villa",
    description:
      "Stunning 5-bedroom villa with panoramic ocean views, private pool, and direct beach access. Fully furnished with premium finishes throughout.",
    price: "2850000",
    type: "sale",
    propertyType: "villa",
    status: "active",
    bedrooms: 5,
    bathrooms: 4,
    area: "420",
    location: "Malibu, CA",
    address: "1 Ocean Drive",
    city: "Malibu",
    country: "USA",
    amenities: [
      "Pool",
      "Ocean View",
      "Private Beach",
      "Garage",
      "Smart Home",
      "Wine Cellar",
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    agentName: "Sarah Johnson",
    agentPhone: "+1-310-555-0101",
    agentEmail: "sarah@realtyco.com",
    featured: true,
  },
  {
    title: "Modern Downtown Apartment",
    description:
      "Contemporary 2-bedroom apartment in the heart of downtown. Floor-to-ceiling windows, open concept kitchen, and stunning city views.",
    price: "3500",
    type: "rent",
    propertyType: "apartment",
    status: "active",
    bedrooms: 2,
    bathrooms: 2,
    area: "95",
    location: "New York, NY",
    address: "420 Park Ave, Unit 12B",
    city: "New York",
    country: "USA",
    amenities: [
      "Gym",
      "Doorman",
      "City View",
      "Rooftop Deck",
      "In-Unit Laundry",
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    agentName: "Michael Chen",
    agentPhone: "+1-212-555-0202",
    agentEmail: "michael@realtyco.com",
    featured: true,
  },
  {
    title: "Charming Victorian Family Home",
    description:
      "Beautiful 4-bedroom Victorian home on a quiet tree-lined street. Original hardwood floors, updated kitchen, spacious backyard perfect for entertaining.",
    price: "1250000",
    type: "sale",
    propertyType: "house",
    status: "active",
    bedrooms: 4,
    bathrooms: 3,
    area: "280",
    location: "San Francisco, CA",
    address: "789 Oak Street",
    city: "San Francisco",
    country: "USA",
    amenities: [
      "Backyard",
      "Garage",
      "Fireplace",
      "Original Hardwood",
      "Renovated Kitchen",
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    ],
    agentName: "Emma Rodriguez",
    agentPhone: "+1-415-555-0303",
    agentEmail: "emma@realtyco.com",
    featured: true,
  },
  {
    title: "Commercial Office Space",
    description:
      "Premium Grade A office space in a prime commercial district. Flexible floor plans, state-of-the-art facilities, and excellent transport links.",
    price: "8500",
    type: "rent",
    propertyType: "commercial",
    status: "active",
    bedrooms: 0,
    bathrooms: 2,
    area: "350",
    location: "Chicago, IL",
    address: "100 N Michigan Ave, Suite 2200",
    city: "Chicago",
    country: "USA",
    amenities: ["24/7 Access", "Conference Rooms", "Parking", "High-Speed Internet", "Concierge"],
    imageUrls: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    ],
    agentName: "David Kim",
    agentPhone: "+1-312-555-0404",
    agentEmail: "david@realtyco.com",
    featured: false,
  },
  {
    title: "Cozy Studio Apartment",
    description:
      "Well-appointed studio apartment, perfect for professionals. Fully equipped kitchen, built-in storage, and great natural light.",
    price: "1800",
    type: "rent",
    propertyType: "apartment",
    status: "active",
    bedrooms: 1,
    bathrooms: 1,
    area: "45",
    location: "Austin, TX",
    address: "222 Congress Ave, Apt 5C",
    city: "Austin",
    country: "USA",
    amenities: ["Gym", "Pet-Friendly", "Rooftop", "Parking Available"],
    imageUrls: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
    ],
    agentName: "Sarah Johnson",
    agentPhone: "+1-310-555-0101",
    agentEmail: "sarah@realtyco.com",
    featured: false,
  },
  {
    title: "Elegant Penthouse Suite",
    description:
      "Exclusive penthouse with 360-degree city views, private terrace, chef's kitchen, and two dedicated parking spaces. The pinnacle of luxury living.",
    price: "5200000",
    type: "sale",
    propertyType: "apartment",
    status: "active",
    bedrooms: 3,
    bathrooms: 3,
    area: "310",
    location: "Miami, FL",
    address: "1 Brickell Key Dr, PH-01",
    city: "Miami",
    country: "USA",
    amenities: [
      "Private Terrace",
      "360 Views",
      "Concierge",
      "Valet",
      "Pool",
      "Spa",
      "Wine Room",
    ],
    imageUrls: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    ],
    agentName: "Michael Chen",
    agentPhone: "+1-212-555-0202",
    agentEmail: "michael@realtyco.com",
    featured: true,
  },
  {
    title: "Mountain Retreat Cabin",
    description:
      "Rustic luxury cabin with stunning mountain views. Perfect weekend retreat or full-time residence. Hot tub, fireplace, and surrounded by nature.",
    price: "875000",
    type: "sale",
    propertyType: "house",
    status: "active",
    bedrooms: 3,
    bathrooms: 2,
    area: "185",
    location: "Aspen, CO",
    address: "45 Pine Ridge Rd",
    city: "Aspen",
    country: "USA",
    amenities: ["Hot Tub", "Fireplace", "Mountain Views", "Deck", "2-Car Garage"],
    imageUrls: [
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=80",
    ],
    agentName: "Emma Rodriguez",
    agentPhone: "+1-415-555-0303",
    agentEmail: "emma@realtyco.com",
    featured: false,
  },
  {
    title: "Suburban Family Home",
    description:
      "Spacious 5-bedroom family home in an excellent school district. Large backyard, 2-car garage, and open plan living areas.",
    price: "620000",
    type: "sale",
    propertyType: "house",
    status: "active",
    bedrooms: 5,
    bathrooms: 3,
    area: "320",
    location: "Nashville, TN",
    address: "1502 Maple Grove Dr",
    city: "Nashville",
    country: "USA",
    amenities: ["Large Backyard", "2-Car Garage", "New Kitchen", "Deck", "Basement"],
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
    agentName: "David Kim",
    agentPhone: "+1-312-555-0404",
    agentEmail: "david@realtyco.com",
    featured: false,
  },
];

const sampleInquiries = [
  {
    name: "James Wilson",
    email: "james.wilson@email.com",
    phone: "+1-555-1001",
    message: "I am very interested in the beachfront villa. Can we schedule a viewing this weekend?",
    propertyId: "1",
    status: "new",
  },
  {
    name: "Lisa Park",
    email: "lisa.park@email.com",
    phone: "+1-555-1002",
    message: "Looking to rent a 2BR in NYC under $4000/month. The downtown apartment looks perfect!",
    propertyId: "2",
    status: "contacted",
  },
  {
    name: "Robert Martinez",
    email: "robert.m@email.com",
    phone: "+1-555-1003",
    message: "Is the Victorian home still available? We have pre-approval and would like to make an offer.",
    propertyId: "3",
    status: "qualified",
  },
  {
    name: "Aisha Thompson",
    email: "aisha.t@email.com",
    phone: "+1-555-1004",
    message: "General inquiry - looking for a 3BR home in the $800k-$1.2M range in San Francisco area.",
    propertyId: null,
    status: "new",
  },
];

const sampleVisits = [
  {
    clientName: "James Wilson",
    clientEmail: "james.wilson@email.com",
    clientPhone: "+1-555-1001",
    propertyId: "1",
    visitDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    notes: "Client very motivated, ready to make offer if property matches listing.",
    status: "scheduled",
  },
  {
    clientName: "Lisa Park",
    clientEmail: "lisa.park@email.com",
    clientPhone: "+1-555-1002",
    propertyId: "2",
    visitDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    notes: "Virtual tour first, then in-person if suitable.",
    status: "scheduled",
  },
  {
    clientName: "Robert Martinez",
    clientEmail: "robert.m@email.com",
    clientPhone: "+1-555-1003",
    propertyId: "3",
    visitDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    notes: "Second viewing. Very interested.",
    status: "completed",
  },
];

const sampleDeals = [
  {
    propertyId: "3",
    clientName: "Robert Martinez",
    clientEmail: "robert.m@email.com",
    clientPhone: "+1-555-1003",
    offerPrice: "1200000",
    commission: "36000",
    dealStage: "negotiation",
    notes: "Client offered $1.2M, seller asking $1.25M. Negotiating.",
  },
  {
    propertyId: "6",
    clientName: "Sophia Lee",
    clientEmail: "sophia.lee@email.com",
    clientPhone: "+1-555-2001",
    offerPrice: "5000000",
    commission: "150000",
    dealStage: "contract",
    notes: "Contract signed, awaiting final bank approval.",
  },
  {
    propertyId: null,
    clientName: "Marcus Johnson",
    clientEmail: "marcus.j@email.com",
    clientPhone: "+1-555-2002",
    offerPrice: "850000",
    commission: "25500",
    dealStage: "closed",
    notes: "Deal closed successfully. Commission received.",
  },
];

async function seed() {
  console.log("Seeding database...");

  const existingProps = await db.select().from(propertiesTable);
  if (existingProps.length > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  console.log("Inserting properties...");
  await db.insert(propertiesTable).values(sampleProperties);

  console.log("Inserting inquiries...");
  await db.insert(inquiriesTable).values(sampleInquiries);

  console.log("Inserting visits...");
  await db.insert(visitsTable).values(sampleVisits);

  console.log("Inserting deals...");
  await db.insert(dealsTable).values(sampleDeals);

  console.log("Seed complete!");
}

seed().catch(console.error);

import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin } from "lucide-react";
import type { Property } from "@workspace/api-client-react";
import { formatINR, formatBHK } from "@/lib/formatINR";

export function PropertyCard({ property }: { property: Property }) {
  const primaryImage = property.images?.find(i => i.isPrimary)?.url 
    || property.images?.[0]?.url 
    || `https://picsum.photos/seed/${property.id}/600/400`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm border border-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md backdrop-blur-sm">
            {property.type === 'sale' ? 'For Sale' : 'For Rent'}
          </Badge>
          {property.featured && (
            <Badge variant="secondary" className="bg-background/90 text-foreground shadow-md backdrop-blur-sm">
              Featured
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="font-display text-2xl font-bold text-white drop-shadow-md flex flex-col gap-1.5">
            <span>{formatINR(property.price, property.type === 'rent')}</span>
            {property.possessionStatus && (
              <Badge 
                className={`w-fit text-xs font-medium border-none shadow-sm backdrop-blur-sm ${
                  property.possessionStatus === 'ready_to_move' ? 'bg-green-500/90 text-white hover:bg-green-500/90' : 
                  property.possessionStatus === 'under_construction' ? 'bg-orange-500/90 text-white hover:bg-orange-500/90' : 
                  'bg-blue-500/90 text-white hover:bg-blue-500/90'
                }`}
              >
                {property.possessionStatus === 'ready_to_move' ? 'Ready to Move' : 
                 property.possessionStatus === 'under_construction' ? 'Under Construction' : 
                 'New Launch'}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
          {property.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin size={16} className="text-accent" />
          <span className="truncate">{property.location}</span>
        </p>
        
        <div className="mt-4 mb-6 flex items-center justify-between border-y border-border/50 py-3">
          <div className="flex items-center gap-1.5 text-sm text-foreground font-medium">
            <Bed size={18} className="text-muted-foreground" />
            <span>{formatBHK(property.bedrooms)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-foreground font-medium">
            <Bath size={18} className="text-muted-foreground" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-foreground font-medium">
            <Square size={18} className="text-muted-foreground" />
            <span>{property.area} sqft</span>
          </div>
        </div>
        
        <div className="mt-auto">
          <Link href={`/properties/${property.id}`} className="block">
            <button className="w-full rounded-xl bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

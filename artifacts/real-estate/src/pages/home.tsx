import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Home as HomeIcon, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useListProperties } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch featured properties
  const { data: featuredData, isLoading } = useListProperties({ featured: true, limit: 3 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/properties?location=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Modern luxury home" 
            className="w-full h-full object-cover scale-105 transform animate-in fade-in zoom-in duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight">
              Discover Your <br />
              <span className="text-accent">Dream Home</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-lg">
              Explore the most exclusive luxury properties in prime locations. Elevate your lifestyle with LuxeEstate.
            </p>
            
            <form onSubmit={handleSearch} className="mt-10 bg-background/95 backdrop-blur-md p-3 rounded-2xl flex flex-col sm:flex-row gap-3 shadow-2xl">
              <div className="flex-1 relative flex items-center">
                <MapPin className="absolute left-4 text-muted-foreground" size={20} />
                <Input 
                  placeholder="Enter location, neighborhood, or city..." 
                  className="pl-12 h-14 border-none bg-transparent text-base focus-visible:ring-0 shadow-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 text-base rounded-xl">
                <Search className="mr-2" size={20} /> Search
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Featured Residences</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl">Handpicked luxury properties that define modern living.</p>
            </div>
            <Link href="/properties">
              <Button variant="ghost" className="text-primary font-semibold group">
                View All Properties <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : featuredData?.properties && featuredData.properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredData.properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/50 rounded-2xl border border-dashed">
              <HomeIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No featured properties right now</h3>
              <p className="text-muted-foreground mt-1">Check back later for new exclusive listings.</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories / Value Prop */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-12">Why Choose LuxeEstate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Curated Selection</h3>
              <p className="text-muted-foreground">Every property is thoroughly vetted to ensure it meets our strict luxury standards.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <HomeIcon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Agents</h3>
              <p className="text-muted-foreground">Our brokers are industry leaders with deep local market knowledge.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Prime Locations</h3>
              <p className="text-muted-foreground">Access to off-market listings in the most desirable neighborhoods globally.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

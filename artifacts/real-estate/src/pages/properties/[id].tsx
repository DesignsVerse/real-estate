import { useParams } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGetProperty, useCreateInquiry } from "@workspace/api-client-react";
import { Loader2, MapPin, Bed, Bath, Square, Check, User, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message is too short"),
});

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useGetProperty(id!);
  const createInquiry = useCreateInquiry();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof inquirySchema>>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "", email: "", phone: "", message: "I am interested in this property and would like to schedule a viewing."
    }
  });

  const onSubmit = (values: z.infer<typeof inquirySchema>) => {
    createInquiry.mutate({
      data: {
        ...values,
        propertyId: id
      }
    }, {
      onSuccess: () => {
        toast({ title: "Inquiry Sent", description: "An agent will contact you shortly." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to send inquiry.", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        <Footer />
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <h2 className="text-2xl font-bold">Property Not Found</h2>
          <p className="text-muted-foreground">The property you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const primaryImage = property.images?.find(i => i.isPrimary)?.url || property.images?.[0]?.url || `https://picsum.photos/seed/${property.id}/1200/800`;
  const secondaryImages = property.images?.filter(i => i.url !== primaryImage).slice(0, 2) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Image Gallery */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[400px] md:h-[500px] rounded-3xl overflow-hidden">
          <div className="md:col-span-2 h-full relative group">
            <img src={primaryImage} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            {secondaryImages.length > 0 ? secondaryImages.map((img, idx) => (
              <div key={idx} className="flex-1 relative overflow-hidden group rounded-xl">
                <img src={img.url} alt={`View ${idx+2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            )) : (
              <>
                <div className="flex-1 bg-muted rounded-xl"></div>
                <div className="flex-1 bg-muted rounded-xl"></div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-12 w-full">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-accent text-accent-foreground px-3 py-1 text-sm">{property.type === 'sale' ? 'For Sale' : 'For Rent'}</Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm capitalize">{property.propertyType}</Badge>
            <Badge variant="secondary" className="px-3 py-1 text-sm capitalize bg-primary/5 text-primary border-none">{property.status}</Badge>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{property.title}</h1>
          <p className="flex items-center gap-2 text-lg text-muted-foreground mb-8">
            <MapPin className="text-accent" size={20} /> {property.address}, {property.city}, {property.country}
          </p>

          <div className="flex flex-wrap items-center gap-8 py-6 border-y border-border/60 mb-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/5 rounded-xl text-primary"><Bed size={24} /></div>
              <div>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="font-semibold text-lg">{property.bedrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/5 rounded-xl text-primary"><Bath size={24} /></div>
              <div>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="font-semibold text-lg">{property.bathrooms}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/5 rounded-xl text-primary"><Square size={24} /></div>
              <div>
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="font-semibold text-lg">{property.area} sqft</p>
              </div>
            </div>
          </div>

          <h3 className="font-display text-2xl font-bold mb-4">Description</h3>
          <div className="prose prose-lg text-muted-foreground mb-10 max-w-none">
            {property.description?.split('\n').map((p, i) => <p key={i}>{p}</p>)}
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <>
              <h3 className="font-display text-2xl font-bold mb-6">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-foreground">
                    <div className="bg-accent/20 text-accent p-1 rounded-full"><Check size={14} /></div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar / Inquiry Form */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="bg-card rounded-3xl border border-border/50 shadow-lg p-8 sticky top-28">
            <h2 className="font-display text-4xl font-bold text-primary mb-2">
              ${property.price.toLocaleString()}
            </h2>
            <p className="text-muted-foreground mb-8 text-sm">Estimated calculation available on request</p>

            {property.agentName && (
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl mb-8">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{property.agentName}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Phone size={12} /> {property.agentPhone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Mail size={12} /> {property.agentEmail}
                  </div>
                </div>
              </div>
            )}

            <h3 className="font-semibold text-lg mb-4">Contact Agent</h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input placeholder="Your Name" {...form.register("name")} className="bg-muted/50 border-none h-12" />
                {form.formState.errors.name && <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>}
              </div>
              <div>
                <Input placeholder="Your Email" type="email" {...form.register("email")} className="bg-muted/50 border-none h-12" />
                {form.formState.errors.email && <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>}
              </div>
              <div>
                <Input placeholder="Phone (optional)" {...form.register("phone")} className="bg-muted/50 border-none h-12" />
              </div>
              <div>
                <Textarea placeholder="Message" {...form.register("message")} className="bg-muted/50 border-none resize-none h-28" />
                {form.formState.errors.message && <p className="text-xs text-destructive mt-1">{form.formState.errors.message.message}</p>}
              </div>
              <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={createInquiry.isPending}>
                {createInquiry.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Inquiry
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

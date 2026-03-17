import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="bg-primary py-20 px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">Whether you're looking to buy, sell, or just have a question, our luxury real estate experts are here to help.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">Contact Information</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Office Address</h3>
                  <p className="text-muted-foreground mt-1">123 Luxury Avenue, Suite 500<br/>New York, NY 10001</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Phone />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone Number</h3>
                  <p className="text-muted-foreground mt-1">+1 (555) 123-4567<br/>+1 (555) 987-6543 (Toll Free)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Mail />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Address</h3>
                  <p className="text-muted-foreground mt-1">contact@luxeestate.com<br/>support@luxeestate.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-3xl border border-border/50 shadow-xl">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send us a message</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">First Name</label>
                  <Input placeholder="John" className="bg-muted/50 border-none h-12" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Last Name</label>
                  <Input placeholder="Doe" className="bg-muted/50 border-none h-12" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input type="email" placeholder="john@example.com" className="bg-muted/50 border-none h-12" required />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Message</label>
                <Textarea placeholder="How can we help you?" className="bg-muted/50 border-none h-32 resize-none" required />
              </div>
              <Button type="submit" size="lg" className="w-full h-12 text-base mt-2">Send Message</Button>
            </form>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}

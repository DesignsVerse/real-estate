import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="Estate Logo" 
                className="h-8 w-8 object-contain brightness-0 invert"
              />
              <span className="font-display text-xl font-bold tracking-tight">
                LUXE<span className="text-accent">ESTATE</span>
              </span>
            </div>
            <p className="max-w-xs text-sm text-primary-foreground/70">
              Redefining luxury real estate with unparalleled service, exclusive listings, and a commitment to excellence.
            </p>
          </div>
          <div>
            <h3 className="font-display mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/properties" className="hover:text-accent transition-colors">Properties</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>123 Luxury Ave, Suite 500</li>
              <li>New York, NY 10001</li>
              <li>contact@luxeestate.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} LuxeEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  Calendar, 
  Briefcase,
  LogOut,
  Menu
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/properties", label: "Properties", icon: Building2 },
    { href: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
    { href: "/dashboard/visits", label: "Visits", icon: Calendar },
    { href: "/dashboard/deals", label: "Deals", icon: Briefcase },
  ];

  return (
    <div className="flex h-screen w-full bg-muted/30">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex h-20 items-center justify-between px-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-white">
              LUXE<span className="text-sidebar-primary">ESTATE</span>
            </span>
          </Link>
          <button className="md:hidden text-sidebar-foreground" onClick={() => setIsSidebarOpen(false)}>
            <Menu size={20} />
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-8 left-0 right-0 px-4">
          <button 
            onClick={() => { logout(); setLocation("/"); }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b bg-background px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} className="text-foreground" />
            </button>
            <h1 className="font-display text-xl font-semibold text-foreground">Broker Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/"><Button variant="outline" size="sm">View Site</Button></Link>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}

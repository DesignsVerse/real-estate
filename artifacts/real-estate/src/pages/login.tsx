import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft } from "lucide-react";

export default function Login() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(pin)) {
      setLocation("/dashboard");
    } else {
      setError("Invalid PIN. Try '1234'");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Back to Site
      </Link>
      
      <div className="w-full max-w-md p-8 bg-card rounded-3xl shadow-xl border border-border/50 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock size={32} />
        </div>
        <h1 className="font-display text-3xl font-bold mb-2">Broker Login</h1>
        <p className="text-muted-foreground mb-8">Enter your access PIN to continue to the portal.</p>
        
        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div>
            <Input 
              type="password" 
              placeholder="Enter PIN (1234)" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="h-14 text-center text-xl tracking-widest bg-muted/50 border-none"
              autoFocus
            />
            {error && <p className="text-sm text-destructive mt-2 text-center">{error}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full h-14 text-lg">
            Access Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}

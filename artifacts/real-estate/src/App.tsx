import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

// Page Imports
import Home from "./pages/home";
import Properties from "./pages/properties";
import PropertyDetail from "./pages/properties/[id]";
import Contact from "./pages/contact";
import Login from "./pages/login";
import DashboardHome from "./pages/dashboard";
import DashboardProperties from "./pages/dashboard/properties";
import DashboardInquiries from "./pages/dashboard/inquiries";
import DashboardVisits from "./pages/dashboard/visits";
import DashboardDeals from "./pages/dashboard/deals";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard" component={DashboardHome} />
      <Route path="/dashboard/properties" component={DashboardProperties} />
      <Route path="/dashboard/inquiries" component={DashboardInquiries} />
      <Route path="/dashboard/visits" component={DashboardVisits} />
      <Route path="/dashboard/deals" component={DashboardDeals} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

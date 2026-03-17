import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetDashboardAnalytics } from "@workspace/api-client-react";
import { Loader2, Building, Users, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function DashboardHome() {
  const { data, isLoading } = useGetDashboardAnalytics();

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </DashboardLayout>
  );

  const stats = [
    { title: "Total Properties", value: data?.totalProperties || 0, icon: Building, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Inquiries", value: data?.activeInquiries || 0, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { title: "Scheduled Visits", value: data?.scheduledVisits || 0, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Total Revenue", value: `$${(data?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <TrendingUp size={20} className="text-muted-foreground/40" />
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
            <h3 className="font-semibold text-lg">Recent Inquiries</h3>
          </div>
          <div className="divide-y divide-border/50">
            {data?.recentInquiries?.length ? data.recentInquiries.map(inq => (
              <div key={inq.id} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm text-foreground">{inq.name}</p>
                  <p className="text-xs text-muted-foreground">{inq.propertyTitle || 'General Inquiry'}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary capitalize">
                    {inq.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(inq.createdAt), 'MMM d, h:mm a')}</p>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">No recent inquiries.</div>
            )}
          </div>
        </div>

        {/* Upcoming Visits */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
            <h3 className="font-semibold text-lg">Upcoming Visits</h3>
          </div>
          <div className="divide-y divide-border/50">
            {data?.recentVisits?.length ? data.recentVisits.map(visit => (
              <div key={visit.id} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm text-foreground">{visit.clientName}</p>
                  <p className="text-xs text-muted-foreground">{visit.propertyTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{format(new Date(visit.visitDate), 'MMM d')}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(visit.visitDate), 'h:mm a')}</p>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-muted-foreground text-sm">No scheduled visits.</div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

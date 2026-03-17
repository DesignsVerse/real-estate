import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListInquiries, useUpdateInquiry } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function DashboardInquiries() {
  const { data, isLoading } = useListInquiries();
  const updateMutation = useUpdateInquiry();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/inquiries'] });
        toast({ title: "Updated", description: "Inquiry status updated." });
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-500/10 text-blue-600';
      case 'contacted': return 'bg-amber-500/10 text-amber-600';
      case 'qualified': return 'bg-emerald-500/10 text-emerald-600';
      case 'closed': return 'bg-muted text-muted-foreground';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Inquiries</h1>
        <p className="text-muted-foreground mt-1">Manage leads and client messages.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td></tr>
              ) : data?.inquiries?.map((inq) => (
                <tr key={inq.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{inq.name}</p>
                    <p className="text-xs text-muted-foreground">{inq.email}</p>
                    {inq.phone && <p className="text-xs text-muted-foreground">{inq.phone}</p>}
                  </td>
                  <td className="px-6 py-4">
                    {inq.propertyTitle ? (
                      <span className="font-medium text-primary">{inq.propertyTitle}</span>
                    ) : (
                      <span className="text-muted-foreground italic">General</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(inq.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <Select defaultValue={inq.status} onValueChange={(v) => handleStatusChange(inq.id, v)}>
                      <SelectTrigger className={`h-8 w-32 border-none font-semibold capitalize ${getStatusColor(inq.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

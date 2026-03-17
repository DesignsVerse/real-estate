import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListVisits, useUpdateVisit } from "@workspace/api-client-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Calendar } from "lucide-react";

export default function DashboardVisits() {
  const { data, isLoading } = useListVisits();
  const updateMutation = useUpdateVisit();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate({ id, data: { status } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/visits'] });
        toast({ title: "Updated", description: "Visit status updated." });
      }
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Site Visits</h1>
        <p className="text-muted-foreground mt-1">Schedule and track property viewings.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td></tr>
              ) : data?.visits?.map((visit) => (
                <tr key={visit.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary"><Calendar size={18}/></div>
                      <div>
                        <p className="font-semibold text-foreground">{format(new Date(visit.visitDate), 'MMM d, yyyy')}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(visit.visitDate), 'h:mm a')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{visit.clientName}</p>
                    <p className="text-xs text-muted-foreground">{visit.clientEmail || visit.clientPhone}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{visit.propertyTitle || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <Select defaultValue={visit.status} onValueChange={(v) => handleStatusChange(visit.id, v)}>
                      <SelectTrigger className="h-8 w-32 border-border/50 bg-background capitalize text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
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

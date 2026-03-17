import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListDeals, useUpdateDeal } from "@workspace/api-client-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, DollarSign } from "lucide-react";

export default function DashboardDeals() {
  const { data, isLoading } = useListDeals();
  const updateMutation = useUpdateDeal();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStageChange = (id: string, dealStage: string) => {
    updateMutation.mutate({ id, data: { dealStage } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
        toast({ title: "Updated", description: "Deal stage updated." });
      }
    });
  };

  const stages = ['lead', 'negotiation', 'contract', 'closed', 'lost'];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Deals Pipeline</h1>
        <p className="text-muted-foreground mt-1">Track negotiations and closed sales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageDeals = data?.deals?.filter(d => d.dealStage === stage) || [];
          return (
            <div key={stage} className="bg-muted/30 rounded-2xl p-4 min-w-[250px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold capitalize text-foreground">{stage}</h3>
                <span className="bg-background px-2 py-0.5 rounded-full text-xs font-medium border border-border shadow-sm">
                  {stageDeals.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {isLoading ? (
                  <div className="flex justify-center py-4"><Loader2 className="animate-spin text-muted-foreground h-5 w-5" /></div>
                ) : stageDeals.map(deal => (
                  <div key={deal.id} className="bg-card p-4 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-medium text-sm text-foreground">{deal.clientName}</p>
                    <p className="text-xs text-muted-foreground truncate mb-2">{deal.propertyTitle}</p>
                    <div className="flex items-center gap-1 font-bold text-emerald-600 mb-3">
                      <DollarSign size={14} /> {(deal.offerPrice).toLocaleString()}
                    </div>
                    
                    <Select defaultValue={deal.dealStage} onValueChange={(v) => handleStageChange(deal.id, v)}>
                      <SelectTrigger className="h-7 text-xs bg-muted/50 border-none w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map(s => (
                          <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  );
}

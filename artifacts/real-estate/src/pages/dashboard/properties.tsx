import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useListProperties, useCreateProperty, useDeleteProperty } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, MapPin, MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function DashboardProperties() {
  const { data, isLoading } = useListProperties();
  const createMutation = useCreateProperty();
  const deleteMutation = useDeleteProperty();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "", price: "", location: "", type: "sale", propertyType: "apartment",
      bedrooms: "1", bathrooms: "1", area: "", address: ""
    }
  });

  const onSubmit = (values: any) => {
    createMutation.mutate({
      data: {
        ...values,
        price: Number(values.price),
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        area: Number(values.area),
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
        setIsAddOpen(false);
        form.reset();
        toast({ title: "Success", description: "Property created successfully." });
      }
    });
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to delete this property?')) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
          toast({ title: "Deleted", description: "Property removed." });
        }
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground mt-1">Manage your real estate listings.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20"><Plus className="mr-2" size={18}/> Add Property</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-background border-border/50 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Add New Property</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input {...form.register("title")} required className="mt-1 bg-muted/50 border-none" />
                </div>
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input type="number" {...form.register("price")} required className="mt-1 bg-muted/50 border-none" />
                </div>
                <div>
                  <label className="text-sm font-medium">Area (sqft)</label>
                  <Input type="number" {...form.register("area")} required className="mt-1 bg-muted/50 border-none" />
                </div>
                <div>
                  <label className="text-sm font-medium">Bedrooms</label>
                  <Input type="number" {...form.register("bedrooms")} required className="mt-1 bg-muted/50 border-none" />
                </div>
                <div>
                  <label className="text-sm font-medium">Bathrooms</label>
                  <Input type="number" {...form.register("bathrooms")} required className="mt-1 bg-muted/50 border-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input {...form.register("location")} required className="mt-1 bg-muted/50 border-none" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Save Property"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></td></tr>
              ) : data?.properties?.map((prop) => (
                <tr key={prop.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                        <img src={prop.images?.[0]?.url || `https://picsum.photos/seed/${prop.id}/100/100`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">{prop.title}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin size={10}/> {prop.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">${prop.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-600 capitalize">
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 capitalize text-muted-foreground">{prop.propertyType} / {prop.type}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card">
                        <DropdownMenuItem className="cursor-pointer"><Edit className="mr-2" size={14}/> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => handleDelete(prop.id)}><Trash2 className="mr-2" size={14}/> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

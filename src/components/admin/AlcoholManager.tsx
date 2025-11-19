import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

interface AlcoholItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  price_30ml: number | null;
  price_60ml: number | null;
  price_90ml: number | null;
  price_180ml: number | null;
  price_bottle: number | null;
  available: boolean;
}

const categories = ["Whisky", "Vodka", "Rum", "Gin", "Tequila", "Beer", "Wine", "Others"];

const alcoholSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().trim().max(100, "Brand must be less than 100 characters").optional(),
  price_30ml: z.number().positive("Price must be positive").max(100000, "Price exceeds maximum").nullable().optional(),
  price_60ml: z.number().positive("Price must be positive").max(100000, "Price exceeds maximum").nullable().optional(),
  price_90ml: z.number().positive("Price must be positive").max(100000, "Price exceeds maximum").nullable().optional(),
  price_180ml: z.number().positive("Price must be positive").max(100000, "Price exceeds maximum").nullable().optional(),
  price_bottle: z.number().positive("Price must be positive").max(100000, "Price exceeds maximum").nullable().optional(),
  available: z.boolean(),
}).refine((data) => {
  const hasPrices = data.price_30ml || data.price_60ml || data.price_90ml || data.price_180ml || data.price_bottle;
  return hasPrices;
}, {
  message: "At least one price field is required",
  path: ["price_30ml"],
});

const AlcoholManager = () => {
  const [items, setItems] = useState<AlcoholItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Whisky",
    brand: "",
    price_30ml: "",
    price_60ml: "",
    price_90ml: "",
    price_180ml: "",
    price_bottle: "",
    available: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("alcohol").select("*").order("category", { ascending: true });
    if (error) {
      toast.error("Failed to load items");
      return;
    }
    setItems(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      brand: formData.brand.trim() || null,
      price_30ml: formData.price_30ml ? parseFloat(formData.price_30ml) : null,
      price_60ml: formData.price_60ml ? parseFloat(formData.price_60ml) : null,
      price_90ml: formData.price_90ml ? parseFloat(formData.price_90ml) : null,
      price_180ml: formData.price_180ml ? parseFloat(formData.price_180ml) : null,
      price_bottle: formData.price_bottle ? parseFloat(formData.price_bottle) : null,
      available: formData.available,
    };

    // Validate the payload
    const validation = alcoholSchema.safeParse(payload);
    if (!validation.success) {
      const errors = validation.error.errors;
      toast.error(errors[0].message);
      return;
    }

    if (editingId) {
      const { error } = await supabase.from("alcohol").update(payload).eq("id", editingId);
      if (error) {
        toast.error("Failed to update item");
        return;
      }
      toast.success("Item updated successfully");
      setEditingId(null);
    } else {
      const { error } = await supabase.from("alcohol").insert(payload);
      if (error) {
        toast.error("Failed to add item");
        return;
      }
      toast.success("Item added successfully");
    }

    resetForm();
    fetchItems();
  };

  const handleEdit = (item: AlcoholItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      brand: item.brand || "",
      price_30ml: item.price_30ml?.toString() || "",
      price_60ml: item.price_60ml?.toString() || "",
      price_90ml: item.price_90ml?.toString() || "",
      price_180ml: item.price_180ml?.toString() || "",
      price_bottle: item.price_bottle?.toString() || "",
      available: item.available,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    const { error } = await supabase.from("alcohol").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete item");
      return;
    }
    toast.success("Item deleted successfully");
    fetchItems();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Whisky",
      brand: "",
      price_30ml: "",
      price_60ml: "",
      price_90ml: "",
      price_180ml: "",
      price_bottle: "",
      available: true,
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingId ? "Edit Alcohol Item" : "Add New Alcohol Item"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_30ml">30ml Price</Label>
                <Input
                  id="price_30ml"
                  type="number"
                  step="0.01"
                  value={formData.price_30ml}
                  onChange={(e) => setFormData({ ...formData, price_30ml: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_60ml">60ml Price</Label>
                <Input
                  id="price_60ml"
                  type="number"
                  step="0.01"
                  value={formData.price_60ml}
                  onChange={(e) => setFormData({ ...formData, price_60ml: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_90ml">90ml Price</Label>
                <Input
                  id="price_90ml"
                  type="number"
                  step="0.01"
                  value={formData.price_90ml}
                  onChange={(e) => setFormData({ ...formData, price_90ml: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_180ml">180ml Price</Label>
                <Input
                  id="price_180ml"
                  type="number"
                  step="0.01"
                  value={formData.price_180ml}
                  onChange={(e) => setFormData({ ...formData, price_180ml: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price_bottle">Bottle Price</Label>
                <Input
                  id="price_bottle"
                  type="number"
                  step="0.01"
                  value={formData.price_bottle}
                  onChange={(e) => setFormData({ ...formData, price_bottle: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label htmlFor="available">Available</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Item" : "Add Item"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-primary">Current Items</h3>
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.category} {item.brand && `- ${item.brand}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 text-sm">
                  {item.price_30ml && <span>30ml: ₹{item.price_30ml}</span>}
                  {item.price_60ml && <span>60ml: ₹{item.price_60ml}</span>}
                  {item.price_90ml && <span>90ml: ₹{item.price_90ml}</span>}
                  {item.price_180ml && <span>180ml: ₹{item.price_180ml}</span>}
                  {item.price_bottle && <span>Bottle: ₹{item.price_bottle}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlcoholManager;

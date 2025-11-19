import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { z } from "zod";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  vegetarian: boolean;
  available: boolean;
}

const categories = ["Starters", "Snacks", "Full Course"];

const foodSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  description: z.string().trim().max(500, "Description must be less than 500 characters").optional(),
  price: z.number().positive("Price must be positive").max(100000, "Price exceeds maximum"),
  vegetarian: z.boolean(),
  available: z.boolean(),
});

const FoodManager = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Starters",
    description: "",
    price: "",
    vegetarian: false,
    available: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("food_menu").select("*").order("category", { ascending: true });
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
      description: formData.description.trim() || null,
      price: parseFloat(formData.price),
      vegetarian: formData.vegetarian,
      available: formData.available,
    };

    // Validate the payload
    const validation = foodSchema.safeParse(payload);
    if (!validation.success) {
      const errors = validation.error.errors;
      toast.error(errors[0].message);
      return;
    }

    if (editingId) {
      const { error } = await supabase.from("food_menu").update(payload).eq("id", editingId);
      if (error) {
        toast.error("Failed to update item");
        return;
      }
      toast.success("Item updated successfully");
      setEditingId(null);
    } else {
      const { error } = await supabase.from("food_menu").insert(payload);
      if (error) {
        toast.error("Failed to add item");
        return;
      }
      toast.success("Item added successfully");
    }

    resetForm();
    fetchItems();
  };

  const handleEdit = (item: FoodItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      description: item.description || "",
      price: item.price.toString(),
      vegetarian: item.vegetarian,
      available: item.available,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    const { error } = await supabase.from("food_menu").delete().eq("id", id);
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
      category: "Starters",
      description: "",
      price: "",
      vegetarian: false,
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
            {editingId ? "Edit Food Item" : "Add New Food Item"}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="vegetarian"
                  checked={formData.vegetarian}
                  onCheckedChange={(checked) => setFormData({ ...formData, vegetarian: checked })}
                />
                <Label htmlFor="vegetarian">Vegetarian</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Available</Label>
              </div>
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
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold">{item.name}</h4>
                      {item.vegetarian && <span className="text-xs">🌱</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{item.category}</p>
                    {item.description && (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    )}
                    <p className="text-lg font-bold text-primary mt-2">₹{item.price}</p>
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodManager;

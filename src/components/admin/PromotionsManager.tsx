import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Tag, Sparkles } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Promotion {
    id: string;
    title: string;
    description: string;
    promotion_type: string;
    buy_quantity?: number;
    get_quantity?: number;
    discount_percentage?: number;
    applicable_to: string;
    conditions?: string;
    badge_text: string;
    badge_color: string;
    active: boolean;
}

const STORAGE_KEY = "menux_promotions";

const PromotionsManager = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        promotion_type: "buy_x_get_y",
        buy_quantity: 2,
        get_quantity: 1,
        discount_percentage: 0,
        applicable_to: "all",
        conditions: "",
        badge_text: "OFFER",
        badge_color: "#8B5CF6",
        active: true,
    });

    useEffect(() => {
        loadPromotions();
    }, []);

    const loadPromotions = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setPromotions(JSON.parse(stored));
            } else {
                // Set default promotions
                const defaultPromotions: Promotion[] = [
                    {
                        id: "1",
                        title: "Buy 2 Get 1 Free",
                        description: "Buy any 2 drinks and get 1 free! Valid on selected beverages.",
                        promotion_type: "buy_x_get_y",
                        buy_quantity: 2,
                        get_quantity: 1,
                        applicable_to: "alcohol",
                        conditions: "Valid on all beverages except premium whisky",
                        badge_text: "BOGO",
                        badge_color: "#10B981",
                        active: true,
                    },
                    {
                        id: "2",
                        title: "Ladies Night Special",
                        description: "Free mocktails for all ladies every Friday!",
                        promotion_type: "free_item",
                        applicable_to: "food",
                        conditions: "Ladies only, Valid on Fridays 6pm-10pm",
                        badge_text: "FREE",
                        badge_color: "#EC4899",
                        active: true,
                    },
                    {
                        id: "3",
                        title: "Happy Hours",
                        description: "50% off on all drinks during happy hours",
                        promotion_type: "discount",
                        discount_percentage: 50,
                        applicable_to: "alcohol",
                        conditions: "Monday to Friday, 5pm-7pm",
                        badge_text: "50% OFF",
                        badge_color: "#F59E0B",
                        active: true,
                    },
                ];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPromotions));
                setPromotions(defaultPromotions);
            }
        } catch (error) {
            console.error("Error loading promotions:", error);
        }
    };

    const savePromotions = (updatedPromotions: Promotion[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPromotions));
            setPromotions(updatedPromotions);
        } catch (error) {
            console.error("Error saving promotions:", error);
            toast.error("Failed to save promotions");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const promotionData: Promotion = {
            id: editingPromotion?.id || Date.now().toString(),
            title: formData.title,
            description: formData.description,
            promotion_type: formData.promotion_type,
            buy_quantity: formData.promotion_type === "buy_x_get_y" ? formData.buy_quantity : undefined,
            get_quantity: formData.promotion_type === "buy_x_get_y" ? formData.get_quantity : undefined,
            discount_percentage: formData.promotion_type === "discount" ? formData.discount_percentage : undefined,
            applicable_to: formData.applicable_to,
            conditions: formData.conditions,
            badge_text: formData.badge_text,
            badge_color: formData.badge_color,
            active: formData.active,
        };

        let updatedPromotions: Promotion[];
        if (editingPromotion) {
            updatedPromotions = promotions.map(p => p.id === editingPromotion.id ? promotionData : p);
            toast.success("Promotion updated successfully");
        } else {
            updatedPromotions = [...promotions, promotionData];
            toast.success("Promotion created successfully");
        }

        savePromotions(updatedPromotions);
        setDialogOpen(false);
        resetForm();
    };

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this promotion?")) return;

        const updatedPromotions = promotions.filter(p => p.id !== id);
        savePromotions(updatedPromotions);
        toast.success("Promotion deleted successfully");
    };

    const handleToggle = (id: string) => {
        const updatedPromotions = promotions.map(p =>
            p.id === id ? { ...p, active: !p.active } : p
        );
        savePromotions(updatedPromotions);
        const promotion = promotions.find(p => p.id === id);
        toast.success(`Promotion ${promotion?.active ? 'deactivated' : 'activated'}`);
    };

    const handleEdit = (promotion: Promotion) => {
        setEditingPromotion(promotion);
        setFormData({
            title: promotion.title,
            description: promotion.description,
            promotion_type: promotion.promotion_type,
            buy_quantity: promotion.buy_quantity || 2,
            get_quantity: promotion.get_quantity || 1,
            discount_percentage: promotion.discount_percentage || 0,
            applicable_to: promotion.applicable_to,
            conditions: promotion.conditions || "",
            badge_text: promotion.badge_text,
            badge_color: promotion.badge_color,
            active: promotion.active,
        });
        setDialogOpen(true);
    };

    const resetForm = () => {
        setEditingPromotion(null);
        setFormData({
            title: "",
            description: "",
            promotion_type: "buy_x_get_y",
            buy_quantity: 2,
            get_quantity: 1,
            discount_percentage: 0,
            applicable_to: "all",
            conditions: "",
            badge_text: "OFFER",
            badge_color: "#8B5CF6",
            active: true,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Promotions</h2>
                    <p className="text-muted-foreground text-sm">Manage special offers and deals</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="gradient-bg-purple text-white border-0">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Promotion
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass border-white/20">
                        <DialogHeader>
                            <DialogTitle>{editingPromotion ? "Edit Promotion" : "Create New Promotion"}</DialogTitle>
                            <DialogDescription>
                                Set up special offers and deals for your customers
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label htmlFor="title">Promotion Title *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Buy 2 Get 1 Free"
                                        required
                                        className="glass border-white/20"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the promotion details"
                                        required
                                        className="glass border-white/20"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="promotion_type">Promotion Type *</Label>
                                    <Select
                                        value={formData.promotion_type}
                                        onValueChange={(value) => setFormData({ ...formData, promotion_type: value })}
                                    >
                                        <SelectTrigger className="glass border-white/20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                                            <SelectItem value="discount">Discount</SelectItem>
                                            <SelectItem value="free_item">Free Item</SelectItem>
                                            <SelectItem value="special_offer">Special Offer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.promotion_type === "buy_x_get_y" && (
                                    <>
                                        <div>
                                            <Label htmlFor="buy_quantity">Buy Quantity</Label>
                                            <Input
                                                id="buy_quantity"
                                                type="number"
                                                value={formData.buy_quantity}
                                                onChange={(e) => setFormData({ ...formData, buy_quantity: parseInt(e.target.value) })}
                                                min="1"
                                                className="glass border-white/20"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="get_quantity">Get Quantity</Label>
                                            <Input
                                                id="get_quantity"
                                                type="number"
                                                value={formData.get_quantity}
                                                onChange={(e) => setFormData({ ...formData, get_quantity: parseInt(e.target.value) })}
                                                min="1"
                                                className="glass border-white/20"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.promotion_type === "discount" && (
                                    <div>
                                        <Label htmlFor="discount_percentage">Discount %</Label>
                                        <Input
                                            id="discount_percentage"
                                            type="number"
                                            value={formData.discount_percentage}
                                            onChange={(e) => setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) })}
                                            min="0"
                                            max="100"
                                            step="0.01"
                                            className="glass border-white/20"
                                        />
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="applicable_to">Applicable To</Label>
                                    <Select
                                        value={formData.applicable_to}
                                        onValueChange={(value) => setFormData({ ...formData, applicable_to: value })}
                                    >
                                        <SelectTrigger className="glass border-white/20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Items</SelectItem>
                                            <SelectItem value="alcohol">Beverages Only</SelectItem>
                                            <SelectItem value="food">Food Only</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="conditions">Conditions (Optional)</Label>
                                    <Input
                                        id="conditions"
                                        value={formData.conditions}
                                        onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                                        placeholder="e.g., Ladies only, Valid on Fridays"
                                        className="glass border-white/20"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="badge_text">Badge Text</Label>
                                    <Input
                                        id="badge_text"
                                        value={formData.badge_text}
                                        onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                                        placeholder="e.g., BOGO, 50% OFF"
                                        className="glass border-white/20"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="badge_color">Badge Color</Label>
                                    <Input
                                        id="badge_color"
                                        type="color"
                                        value={formData.badge_color}
                                        onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                                        className="glass border-white/20 h-10"
                                    />
                                </div>

                                <div className="col-span-2 flex items-center space-x-2">
                                    <Switch
                                        id="active"
                                        checked={formData.active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                    />
                                    <Label htmlFor="active">Active</Label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setDialogOpen(false);
                                        resetForm();
                                    }}
                                    className="glass border-white/20"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="gradient-bg-purple text-white border-0">
                                    {editingPromotion ? "Update" : "Create"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {promotions.length === 0 ? (
                    <Card className="glass border-white/10">
                        <CardContent className="py-12 text-center">
                            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <p className="text-muted-foreground">No promotions yet. Create your first promotion!</p>
                        </CardContent>
                    </Card>
                ) : (
                    promotions.map((promotion) => (
                        <Card key={promotion.id} className="glass border-white/10 card-hover">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <CardTitle className="text-lg">{promotion.title}</CardTitle>
                                            <span
                                                className="px-2 py-1 rounded-full text-xs font-bold text-white"
                                                style={{ backgroundColor: promotion.badge_color }}
                                            >
                                                {promotion.badge_text}
                                            </span>
                                            {promotion.active ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400">
                                                    Inactive
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{promotion.description}</p>
                                        {promotion.conditions && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                <strong>Conditions:</strong> {promotion.conditions}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 items-end">
                                        <div className="flex items-center gap-2 glass border border-white/10 rounded-lg px-3 py-2">
                                            <span className="text-xs text-muted-foreground">
                                                {promotion.active ? 'ON' : 'OFF'}
                                            </span>
                                            <Switch
                                                checked={promotion.active}
                                                onCheckedChange={() => handleToggle(promotion.id)}
                                                className="data-[state=checked]:bg-green-500"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(promotion)}
                                                className="glass border-white/20"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(promotion.id)}
                                                className="glass border-white/20 text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default PromotionsManager;

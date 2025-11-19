import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Wine, UtensilsCrossed, Sparkles, Search, Leaf, Instagram, Facebook, Twitter, Globe, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

interface AlcoholItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  price_30ml: number;
  price_60ml: number;
  price_90ml: number;
  price_180ml: number;
  price_bottle: number;
  available: boolean;
}

interface FoodItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  vegetarian: boolean;
  available: boolean;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  promotion_type: string;
  applicable_to: string;
  conditions?: string;
  badge_text: string;
  badge_color: string;
  active: boolean;
}

interface RestaurantSettings {
  restaurant_name: string;
  tagline: string;
  address: string;
  phone: string;
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  website_url: string;
  google_maps_url: string;
}

const Menu = () => {
  const [alcoholItems, setAlcoholItems] = useState<AlcoholItem[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);

  useEffect(() => {
    fetchMenuData();
    loadPromotions();
    loadSettings();
  }, []);

  const loadPromotions = () => {
    try {
      const stored = localStorage.getItem("menux_promotions");
      if (stored) {
        const allPromotions: Promotion[] = JSON.parse(stored);
        setPromotions(allPromotions.filter(p => p.active));
      }
    } catch (error) {
      console.error("Error loading promotions:", error);
    }
  };

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem("menux_restaurant_settings");
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const fetchMenuData = async () => {
    try {
      const [alcoholRes, foodRes] = await Promise.all([
        supabase.from("alcohol").select("*").eq("available", true).order("category", { ascending: true }),
        supabase.from("food_menu").select("*").eq("available", true).order("category", { ascending: true }),
      ]);

      if (alcoholRes.error) throw alcoholRes.error;
      if (foodRes.error) throw foodRes.error;

      setAlcoholItems(alcoholRes.data || []);
      setFoodItems(foodRes.data || []);
    } catch (error) {
      console.error("Error fetching menu:", error);
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const groupByCategory = <T extends { category: string }>(items: T[]): Record<string, T[]> => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  };

  const filterItems = <T extends { name: string; brand?: string }>(items: T[]): T[] => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(query) ||
      (item.brand && item.brand.toLowerCase().includes(query))
    );
  };

  const alcoholByCategory = groupByCategory(filterItems(alcoholItems));
  const foodByCategory = groupByCategory(filterItems(foodItems));

  const getApplicablePromotions = (type: 'alcohol' | 'food') => {
    return promotions.filter(p => p.applicable_to === 'all' || p.applicable_to === type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-purple-400 animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-white/10 backdrop-blur-xl">
        <div className="px-4 py-6">
          <div className="text-center mb-4 animate-slide-up">
            <h1 className="text-3xl font-bold text-foreground mb-1 flex items-center justify-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-400" />
              <span className="gradient-text">{settings?.restaurant_name || "Premium Bar Menu"}</span>
            </h1>
            {settings?.tagline && (
              <p className="text-muted-foreground text-sm mb-2">{settings.tagline}</p>
            )}
            {settings?.address && (
              <p className="text-muted-foreground text-xs flex items-center justify-center gap-1">
                <MapPin className="w-3 h-3" />
                {settings.address}
              </p>
            )}

            {/* Social Links */}
            {(settings?.instagram_url || settings?.facebook_url || settings?.twitter_url || settings?.website_url || settings?.phone || settings?.google_maps_url) && (
              <div className="flex items-center justify-center gap-3 mt-3">
                {settings.phone && (
                  <a href={`tel:${settings.phone}`} className="text-muted-foreground hover:text-purple-400 transition-colors">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-400 transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-cyan-400 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {settings.website_url && (
                  <a href={settings.website_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-purple-400 transition-colors">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {settings.google_maps_url && (
                  <a href={settings.google_maps_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-red-400 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-white/20 focus:border-purple-500/50"
            />
          </div>
        </div>
      </div>

      {/* Promotions Banner */}
      {promotions.length > 0 && (
        <div className="px-4 py-4 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 border-b border-white/10">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-bold text-purple-400 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Active Promotions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {promotions.map((promo) => (
                <div key={promo.id} className="glass border-white/10 rounded-lg p-3">
                  <div className="flex items-start gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: promo.badge_color }}
                    >
                      {promo.badge_text}
                    </span>
                    <h4 className="text-sm font-bold">{promo.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{promo.description}</p>
                  {promo.conditions && (
                    <p className="text-xs text-muted-foreground mt-1 italic">*{promo.conditions}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6">
        <Tabs defaultValue="alcohol" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 glass border-white/10">
            <TabsTrigger value="alcohol" className="gap-2 data-[state=active]:gradient-bg-purple data-[state=active]:text-white">
              <Wine className="w-4 h-4" />
              Beverages
              {getApplicablePromotions('alcohol').length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-purple-500/20 text-purple-400 text-xs">
                  {getApplicablePromotions('alcohol').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="food" className="gap-2 data-[state=active]:gradient-bg-cyan data-[state=active]:text-white">
              <UtensilsCrossed className="w-4 h-4" />
              Food
              {getApplicablePromotions('food').length > 0 && (
                <Badge variant="secondary" className="ml-1 bg-cyan-500/20 text-cyan-400 text-xs">
                  {getApplicablePromotions('food').length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alcohol" className="space-y-8 animate-fade-in">
            {Object.entries(alcoholByCategory).length === 0 ? (
              <div className="text-center py-12">
                <Wine className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No beverages found</p>
              </div>
            ) : (
              Object.entries(alcoholByCategory).map(([category, items]) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b border-purple-500/30 flex items-center gap-2">
                    <div className="w-1 h-6 gradient-bg-purple rounded-full" />
                    {category}
                  </h2>
                  <div className="grid gap-4">
                    {items.map((item: AlcoholItem) => (
                      <Card key={item.id} className="glass border-white/10 card-hover overflow-hidden relative">
                        {getApplicablePromotions('alcohol').length > 0 && (
                          <div className="absolute top-2 right-2 flex gap-1">
                            {getApplicablePromotions('alcohol').map((promo) => (
                              <span
                                key={promo.id}
                                className="px-2 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: promo.badge_color }}
                              >
                                {promo.badge_text}
                              </span>
                            ))}
                          </div>
                        )}
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-foreground mb-1">{item.name}</h3>
                              {item.brand && (
                                <p className="text-muted-foreground text-sm flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                                  {item.brand}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {item.price_30ml && (
                              <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl border border-purple-500/20">
                                <p className="text-xs text-muted-foreground mb-1">30ml</p>
                                <p className="text-lg font-bold text-purple-400">₹{item.price_30ml}</p>
                              </div>
                            )}
                            {item.price_60ml && (
                              <div className="text-center p-3 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl border border-cyan-500/20">
                                <p className="text-xs text-muted-foreground mb-1">60ml</p>
                                <p className="text-lg font-bold text-cyan-400">₹{item.price_60ml}</p>
                              </div>
                            )}
                            {item.price_90ml && (
                              <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-transparent rounded-xl border border-blue-500/20">
                                <p className="text-xs text-muted-foreground mb-1">90ml</p>
                                <p className="text-lg font-bold text-blue-400">₹{item.price_90ml}</p>
                              </div>
                            )}
                            {item.price_180ml && (
                              <div className="text-center p-3 bg-gradient-to-br from-pink-500/10 to-transparent rounded-xl border border-pink-500/20">
                                <p className="text-xs text-muted-foreground mb-1">180ml</p>
                                <p className="text-lg font-bold text-pink-400">₹{item.price_180ml}</p>
                              </div>
                            )}
                            {item.price_bottle && (
                              <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-transparent rounded-xl border border-purple-500/20">
                                <p className="text-xs text-muted-foreground mb-1">Bottle</p>
                                <p className="text-lg font-bold text-purple-400">₹{item.price_bottle}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="food" className="space-y-8 animate-fade-in">
            {Object.entries(foodByCategory).length === 0 ? (
              <div className="text-center py-12">
                <UtensilsCrossed className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">No food items found</p>
              </div>
            ) : (
              Object.entries(foodByCategory).map(([category, items]) => (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-foreground mb-4 pb-2 border-b border-cyan-500/30 flex items-center gap-2">
                    <div className="w-1 h-6 gradient-bg-cyan rounded-full" />
                    {category}
                  </h2>
                  <div className="grid gap-4">
                    {items.map((item: FoodItem) => (
                      <Card key={item.id} className="glass border-white/10 card-hover overflow-hidden relative">
                        {getApplicablePromotions('food').length > 0 && (
                          <div className="absolute top-2 right-2 flex gap-1">
                            {getApplicablePromotions('food').map((promo) => (
                              <span
                                key={promo.id}
                                className="px-2 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: promo.badge_color }}
                              >
                                {promo.badge_text}
                              </span>
                            ))}
                          </div>
                        )}
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-start gap-2">
                                {item.vegetarian && (
                                  <Leaf className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                )}
                                <div>
                                  <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                                  )}
                                </div>
                              </div>
                              {item.vegetarian && (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                                  Vegetarian
                                </Badge>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              <div className="text-center p-3 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-xl border border-cyan-500/20">
                                <p className="text-2xl font-bold text-cyan-400">₹{item.price}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Menu;

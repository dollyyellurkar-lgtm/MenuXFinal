import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, Wine, UtensilsCrossed, QrCode, Sparkles, Tag, Settings } from "lucide-react";
import AlcoholManager from "@/components/admin/AlcoholManager";
import FoodManager from "@/components/admin/FoodManager";
import QRCodeGenerator from "@/components/admin/QRCodeGenerator";
import PromotionsManager from "@/components/admin/PromotionsManager";
import RestaurantSettingsManager from "@/components/admin/RestaurantSettingsManager";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) throw error;

      if (!roles) {
        toast.error("You need admin privileges to access this page");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Authentication error");
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Sparkles className="w-12 h-12 text-purple-400 animate-pulse mx-auto" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-10 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-bg-purple flex items-center justify-center">
                <Wine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  <span className="gradient-text">Admin Dashboard</span>
                </h1>
                <p className="text-sm text-muted-foreground">Manage your menu</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2 glass border-white/20 hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="alcohol" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-8 glass border-white/10">
            <TabsTrigger
              value="alcohol"
              className="gap-2 data-[state=active]:gradient-bg-purple data-[state=active]:text-white"
            >
              <Wine className="w-4 h-4" />
              <span className="hidden sm:inline">Alcohol</span>
            </TabsTrigger>
            <TabsTrigger
              value="food"
              className="gap-2 data-[state=active]:gradient-bg-cyan data-[state=active]:text-white"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline">Food</span>
            </TabsTrigger>
            <TabsTrigger
              value="promotions"
              className="gap-2 data-[state=active]:gradient-bg-purple data-[state=active]:text-white"
            >
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">Promos</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="gap-2 data-[state=active]:gradient-bg-cyan data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger
              value="qr"
              className="gap-2 data-[state=active]:gradient-bg-purple data-[state=active]:text-white"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">QR Code</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alcohol" className="animate-fade-in">
            <AlcoholManager />
          </TabsContent>

          <TabsContent value="food" className="animate-fade-in">
            <FoodManager />
          </TabsContent>

          <TabsContent value="promotions" className="animate-fade-in">
            <PromotionsManager />
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <RestaurantSettingsManager />
          </TabsContent>

          <TabsContent value="qr" className="animate-fade-in">
            <QRCodeGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

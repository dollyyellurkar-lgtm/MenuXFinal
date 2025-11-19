import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Building2, Instagram, Facebook, Twitter, Globe, MapPin, Phone, Mail } from "lucide-react";

interface RestaurantSettings {
    restaurant_name: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    instagram_url: string;
    facebook_url: string;
    twitter_url: string;
    website_url: string;
    google_maps_url: string;
}

const STORAGE_KEY = "menux_restaurant_settings";

const DEFAULT_SETTINGS: RestaurantSettings = {
    restaurant_name: "Premium Bar & Lounge",
    tagline: "Experience the finest drinks and dining",
    address: "Hinjewadi, Pune, Maharashtra",
    phone: "+91 98765 43210",
    email: "contact@premiumbar.com",
    instagram_url: "",
    facebook_url: "",
    twitter_url: "",
    website_url: "",
    google_maps_url: "",
};

const RestaurantSettingsManager = () => {
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setSettings(JSON.parse(stored));
            } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            toast.success("Restaurant settings saved successfully");
        } catch (error: any) {
            console.error("Error saving settings:", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Restaurant Settings</h2>
                <p className="text-muted-foreground text-sm">Manage your restaurant information and social links</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-purple-400" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="restaurant_name">Restaurant Name *</Label>
                                <Input
                                    id="restaurant_name"
                                    value={settings.restaurant_name}
                                    onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
                                    placeholder="Premium Bar & Lounge"
                                    required
                                    className="glass border-white/20"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="tagline">Tagline</Label>
                                <Input
                                    id="tagline"
                                    value={settings.tagline}
                                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                    placeholder="Experience the finest drinks and dining"
                                    className="glass border-white/20"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <Label htmlFor="address" className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                    Address
                                </Label>
                                <Textarea
                                    id="address"
                                    value={settings.address}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    placeholder="Hinjewadi, Pune, Maharashtra"
                                    className="glass border-white/20"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-purple-400" />
                                    Phone
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={settings.phone}
                                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                    className="glass border-white/20"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-purple-400" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    placeholder="contact@restaurant.com"
                                    className="glass border-white/20"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media Links */}
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-cyan-400" />
                            Social Media & Website
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="instagram_url" className="flex items-center gap-2">
                                    <Instagram className="w-4 h-4 text-pink-400" />
                                    Instagram URL
                                </Label>
                                <Input
                                    id="instagram_url"
                                    type="url"
                                    value={settings.instagram_url}
                                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                                    placeholder="https://instagram.com/yourrestaurant"
                                    className="glass border-white/20"
                                />
                            </div>

                            <div>
                                <Label htmlFor="facebook_url" className="flex items-center gap-2">
                                    <Facebook className="w-4 h-4 text-blue-400" />
                                    Facebook URL
                                </Label>
                                <Input
                                    id="facebook_url"
                                    type="url"
                                    value={settings.facebook_url}
                                    onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                                    placeholder="https://facebook.com/yourrestaurant"
                                    className="glass border-white/20"
                                />
                            </div>

                            <div>
                                <Label htmlFor="twitter_url" className="flex items-center gap-2">
                                    <Twitter className="w-4 h-4 text-cyan-400" />
                                    Twitter URL
                                </Label>
                                <Input
                                    id="twitter_url"
                                    type="url"
                                    value={settings.twitter_url}
                                    onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
                                    placeholder="https://twitter.com/yourrestaurant"
                                    className="glass border-white/20"
                                />
                            </div>

                            <div>
                                <Label htmlFor="website_url" className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-purple-400" />
                                    Website URL
                                </Label>
                                <Input
                                    id="website_url"
                                    type="url"
                                    value={settings.website_url}
                                    onChange={(e) => setSettings({ ...settings, website_url: e.target.value })}
                                    placeholder="https://yourrestaurant.com"
                                    className="glass border-white/20"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Google Maps */}
                <Card className="glass border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-red-400" />
                            Google Maps
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="google_maps_url">Google Maps Link</Label>
                            <Input
                                id="google_maps_url"
                                type="url"
                                value={settings.google_maps_url}
                                onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
                                placeholder="https://maps.google.com/..."
                                className="glass border-white/20"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Share link from Google Maps (right-click on location → Share)
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        className="gradient-bg-purple text-white border-0 btn-shine"
                        disabled={saving}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? "Saving..." : "Save Settings"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RestaurantSettingsManager;

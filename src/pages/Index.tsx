import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Eye, Shield, Sparkles, Star, QrCode, Smartphone, TrendingUp, Clock, Users, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-white">MenuX — </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Modern QR Menus
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Launch digital menus in minutes. Engage customers. Get insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg rounded-full border-0 shadow-lg shadow-purple-500/50 transition-all duration-300 hover:shadow-purple-500/70 hover:scale-105"
            >
              Start Free Trial
            </Button>
            <Button
              onClick={() => navigate("/menu")}
              variant="outline"
              className="bg-transparent border-2 border-gray-700 hover:border-gray-600 text-white px-8 py-6 text-lg rounded-full transition-all duration-300 hover:bg-gray-900"
            >
              View Menu
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 border border-gray-800 rounded-full backdrop-blur-sm">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-gray-300">
              Trusted by 1,000+ restaurants across India
            </span>
          </div>
        </div>

        {/* Two Card Section */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-16">
          {/* View Menu Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">View Menu</h3>
                <p className="text-gray-400 text-sm">
                  Browse our current menu as a customer
                </p>
              </div>
              <Button
                onClick={() => navigate("/menu")}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white py-6 text-lg rounded-xl border-0 font-semibold shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50"
              >
                View Menu
              </Button>
            </CardContent>
          </Card>

          {/* Admin Access Card */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Admin Access</h3>
                <p className="text-gray-400 text-sm">
                  Manage menu items and settings
                </p>
              </div>
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                className="w-full bg-transparent border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-800 text-white py-6 text-lg rounded-xl transition-all duration-300"
              >
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center my-16">
          <Sparkles className="w-8 h-8 text-orange-500" />
        </div>

        {/* How It Works Section */}
        <div className="text-center max-w-4xl mx-auto space-y-12">
          <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">1. Generate QR Code</h3>
              <p className="text-gray-400 text-sm">
                Create your digital menu and get a unique QR code in seconds
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">2. Customers Scan</h3>
              <p className="text-gray-400 text-sm">
                Guests scan the QR code to view your menu on their phones
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-600 to-yellow-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">3. Track Analytics</h3>
              <p className="text-gray-400 text-sm">
                Get insights on popular items and customer engagement
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 space-y-12">
          <h2 className="text-3xl md:text-5xl font-bold text-center">Why Choose MenuX?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm p-6 hover:bg-gray-900/70 transition-all duration-300">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Quick Setup</h3>
                <p className="text-gray-400 text-sm">
                  Launch your digital menu in under 5 minutes. No technical skills required.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm p-6 hover:bg-gray-900/70 transition-all duration-300">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Live Updates</h3>
                <p className="text-gray-400 text-sm">
                  Update your menu instantly. Changes reflect immediately for all customers.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm p-6 hover:bg-gray-900/70 transition-all duration-300">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Customer Engagement</h3>
                <p className="text-gray-400 text-sm">
                  Promote special offers and engage customers with dynamic promotions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm p-6 hover:bg-gray-900/70 transition-all duration-300">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Analytics Dashboard</h3>
                <p className="text-gray-400 text-sm">
                  Track popular items, peak hours, and customer preferences.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm p-6 hover:bg-gray-900/70 transition-all duration-300">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Mobile Optimized</h3>
                <p className="text-gray-400 text-sm">
                  Perfect viewing experience on all devices - phones, tablets, and desktops.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm p-6 hover:bg-gray-900/70 transition-all duration-300">
              <CardContent className="p-0 space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Secure & Reliable</h3>
                <p className="text-gray-400 text-sm">
                  Enterprise-grade security with 99.9% uptime guarantee.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Go Digital?
          </h2>
          <p className="text-xl text-gray-400">
            Join 1,000+ restaurants modernizing their menu experience
          </p>
          <Button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl rounded-full border-0 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:shadow-purple-500/70 hover:scale-105"
          >
            Start Free Trial
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 MenuX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

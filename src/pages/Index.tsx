import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Eye, ShieldCheck, Star, Sparkles, Zap, BarChart3, Globe, QrCode, Building2, ArrowRight, Check } from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12">
        {/* Animated gradient background */}
        <div className="absolute inset-0 animated-gradient opacity-20" />

        {/* Floating elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl float" style={{ animationDelay: '2s' }} />

        <div className="relative text-center space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-sm mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-muted-foreground">Trusted by 1,000+ restaurants across India</span>
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="gradient-text">MenuX</span>
            <br />
            <span className="text-foreground">Modern QR Menus</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Launch digital menus in minutes. Engage customers with beautiful,
            mobile-first experiences. Get insights that matter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gradient-bg-purple btn-shine text-white border-0 hover:opacity-90 transition-opacity">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/menu" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto glass border-white/20 hover:bg-white/10">
                View Demo Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up stagger-1">
        <Card className="glass border-white/10 card-hover group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl gradient-bg-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">View Menu</h3>
              <p className="text-sm text-muted-foreground">Browse our current menu as a customer</p>
            </div>
            <Link to="/menu" className="block">
              <Button className="w-full gradient-bg-cyan text-white border-0">
                Explore Menu
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass border-white/10 card-hover group">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-2xl gradient-bg-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Admin Access</h3>
              <p className="text-sm text-muted-foreground">Manage menu items and settings</p>
            </div>
            <Link to="/auth" className="block">
              <Button className="w-full gradient-bg-purple text-white border-0">
                Admin Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="space-y-8 animate-slide-up stagger-2">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get your digital menu up and running in 4 simple steps
          </p>
        </div>

        <div className="glass border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: 1, title: "Print or Display", desc: "Click 'Print' to print QR codes or 'Download' to save as image for digital display", icon: QrCode },
              { num: 2, title: "Place on Tables", desc: "Position the QR code on each table or at the bar entrance for easy customer access", icon: Building2 },
              { num: 3, title: "Customers Scan", desc: "Customers scan the QR with their phone camera to instantly access the digital menu", icon: Eye },
              { num: 4, title: "Browse & Order", desc: "Customers browse items, add to cart, and place orders directly from their device", icon: Check },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full gradient-bg-purple flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {s.num}
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-6 pt-8 h-full border border-white/5 hover:border-white/10 transition-colors">
                    <Icon className="w-8 h-8 text-purple-400 mb-3" />
                    <h3 className="font-bold mb-2">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-8 animate-slide-up stagger-3">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run a modern digital menu
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Zap, title: "Instant Setup", desc: "Create menus and QR codes in minutes", color: "text-yellow-400" },
            { icon: ShieldCheck, title: "Secure & Reliable", desc: "Built on Supabase with RLS", color: "text-green-400" },
            { icon: BarChart3, title: "Analytics", desc: "Track scans, engagement and top items", color: "text-blue-400" },
            { icon: Building2, title: "Multi-Location", desc: "Manage menus across outlets", color: "text-purple-400" },
            { icon: Globe, title: "Multi-language", desc: "Serve customers in their language", color: "text-cyan-400" },
            { icon: QrCode, title: "Beautiful QR", desc: "Brand-safe QR codes and landing", color: "text-pink-400" },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} className="glass border-white/10 card-hover group">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 ${f.color}`} />
                    </div>
                    <h3 className="font-bold text-lg">{f.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-8 animate-slide-up stagger-4">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">Simple Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              name: "FREEMIUM",
              price: "₹0",
              period: "/month",
              desc: "Best for getting started",
              bullets: ["1 menu", "50 scans/month", "Branding enabled"],
              cta: "Start Free",
              featured: false
            },
            {
              name: "STARTER",
              price: "₹99",
              period: "/month",
              desc: "For small restaurants",
              bullets: ["3 menus", "Unlimited scans", "Remove branding"],
              cta: "Choose Starter",
              featured: false
            },
            {
              name: "GRAND",
              price: "₹299",
              period: "/month",
              desc: "Most popular choice",
              bullets: ["All features", "Analytics", "Multi-location"],
              cta: "Choose Grand",
              featured: true
            },
            {
              name: "PRO",
              price: "₹599",
              period: "/month",
              desc: "For enterprises",
              bullets: ["White-label", "API access", "Priority support"],
              cta: "Choose Pro",
              featured: false
            },
          ].map((tier, i) => (
            <Card
              key={i}
              className={`${tier.featured ? 'glass border-purple-500/50 pulse-glow' : 'glass border-white/10'} card-hover relative overflow-hidden`}
            >
              {tier.featured && (
                <div className="absolute top-0 right-0 bg-gradient-bg-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-muted-foreground mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{tier.desc}</p>
                </div>

                <ul className="space-y-2">
                  {tier.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${tier.featured ? 'gradient-bg-purple text-white border-0' : 'border-white/20'}`}
                  variant={tier.featured ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 glass border-white/10">
        <div className="absolute inset-0 gradient-bg-purple opacity-10" />
        <div className="relative text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of restaurants already using MenuX to delight their customers
          </p>
          <Link to="/auth">
            <Button size="lg" className="gradient-bg-purple btn-shine text-white border-0">
              Start Your Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;

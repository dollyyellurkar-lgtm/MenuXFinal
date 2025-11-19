-- Create promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  promotion_type TEXT NOT NULL CHECK (promotion_type IN ('buy_x_get_y', 'discount', 'free_item', 'special_offer')),
  
  -- For buy X get Y promotions
  buy_quantity INTEGER,
  get_quantity INTEGER,
  
  -- For discount promotions
  discount_percentage DECIMAL(5,2),
  
  -- Applicable items (null means all items)
  applicable_to TEXT, -- 'all', 'alcohol', 'food', or specific category
  target_category TEXT, -- specific category if applicable
  
  -- Conditions
  conditions TEXT, -- e.g., "Ladies only", "Happy hours 5-7pm"
  
  -- Validity
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  
  -- Display
  badge_text TEXT, -- e.g., "BOGO", "50% OFF"
  badge_color TEXT DEFAULT '#8B5CF6', -- purple by default
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create restaurant settings table
CREATE TABLE IF NOT EXISTS public.restaurant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_name TEXT NOT NULL DEFAULT 'MenuX Restaurant',
  tagline TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  
  -- Social media links
  instagram_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  
  -- Google Maps
  google_maps_url TEXT,
  google_maps_embed_url TEXT,
  
  -- Business hours
  business_hours JSONB, -- {"monday": "10:00-22:00", "tuesday": "10:00-22:00", ...}
  
  -- Branding
  logo_url TEXT,
  primary_color TEXT DEFAULT '#8B5CF6',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on promotions
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on restaurant_settings
ALTER TABLE public.restaurant_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for promotions (public read, admin write)
CREATE POLICY "Anyone can view active promotions" ON public.promotions
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can insert promotions" ON public.promotions
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update promotions" ON public.promotions
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete promotions" ON public.promotions
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for restaurant_settings (public read, admin write)
CREATE POLICY "Anyone can view restaurant settings" ON public.restaurant_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert restaurant settings" ON public.restaurant_settings
  FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update restaurant settings" ON public.restaurant_settings
  FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete restaurant settings" ON public.restaurant_settings
  FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurant_settings_updated_at
  BEFORE UPDATE ON public.restaurant_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default restaurant settings
INSERT INTO public.restaurant_settings (
  restaurant_name,
  tagline,
  address,
  phone
) VALUES (
  'Premium Bar & Lounge',
  'Experience the finest drinks and dining',
  'Hinjewadi, Pune, Maharashtra',
  '+91 98765 43210'
) ON CONFLICT DO NOTHING;

-- Insert sample promotions
INSERT INTO public.promotions (
  title,
  description,
  promotion_type,
  buy_quantity,
  get_quantity,
  applicable_to,
  conditions,
  badge_text,
  badge_color,
  active
) VALUES
(
  'Buy 2 Get 1 Free',
  'Buy any 2 drinks and get 1 free! Valid on selected beverages.',
  'buy_x_get_y',
  2,
  1,
  'alcohol',
  'Valid on all beverages except premium whisky',
  'BOGO',
  '#10B981',
  true
),
(
  'Ladies Night Special',
  'Free mocktails for all ladies every Friday!',
  'free_item',
  null,
  null,
  'food',
  'Ladies only, Valid on Fridays 6pm-10pm',
  'FREE',
  '#EC4899',
  true
),
(
  'Happy Hours',
  '50% off on all drinks during happy hours',
  'discount',
  null,
  null,
  'alcohol',
  'Monday to Friday, 5pm-7pm',
  '50% OFF',
  '#F59E0B',
  true
);

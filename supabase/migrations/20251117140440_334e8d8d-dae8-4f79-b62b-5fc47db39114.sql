-- Create user roles enum (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END $$;

-- Create user roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create alcohol table with multiple price points
CREATE TABLE IF NOT EXISTS public.alcohol (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g., Whisky, Vodka, Rum, Beer, Wine, etc.
  brand TEXT,
  price_30ml DECIMAL(10,2),
  price_60ml DECIMAL(10,2),
  price_90ml DECIMAL(10,2),
  price_180ml DECIMAL(10,2),
  price_bottle DECIMAL(10,2),
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on alcohol
ALTER TABLE public.alcohol ENABLE ROW LEVEL SECURITY;

-- Create food menu table
CREATE TABLE IF NOT EXISTS public.food_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Starters', 'Snacks', 'Full Course')),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  vegetarian BOOLEAN DEFAULT false,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on food_menu
ALTER TABLE public.food_menu ENABLE ROW LEVEL SECURITY;

-- RLS Policies for alcohol (public read, admin write)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='alcohol' AND policyname='Anyone can view alcohol menu'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view alcohol menu" ON public.alcohol FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='alcohol' AND policyname='Admins can insert alcohol'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can insert alcohol" ON public.alcohol FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='alcohol' AND policyname='Admins can update alcohol'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can update alcohol" ON public.alcohol FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin''))';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='alcohol' AND policyname='Admins can delete alcohol'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can delete alcohol" ON public.alcohol FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- RLS Policies for food_menu (public read, admin write)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='food_menu' AND policyname='Anyone can view food menu'
  ) THEN
    EXECUTE 'CREATE POLICY "Anyone can view food menu" ON public.food_menu FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='food_menu' AND policyname='Admins can insert food'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can insert food" ON public.food_menu FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='food_menu' AND policyname='Admins can update food'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can update food" ON public.food_menu FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin''))';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='food_menu' AND policyname='Admins can delete food'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can delete food" ON public.food_menu FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- RLS Policies for user_roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Users can view their own roles'
  ) THEN
    EXECUTE 'CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_roles' AND policyname='Admins can manage all roles'
  ) THEN
    EXECUTE 'CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), ''admin''))';
  END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
DROP TRIGGER IF EXISTS update_alcohol_updated_at ON public.alcohol;
CREATE TRIGGER update_alcohol_updated_at
  BEFORE UPDATE ON public.alcohol
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_food_menu_updated_at ON public.food_menu;
CREATE TRIGGER update_food_menu_updated_at
  BEFORE UPDATE ON public.food_menu
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for Pune Hinjewadi posh bar

-- Sample Alcohol Data
INSERT INTO public.alcohol (name, category, brand, price_30ml, price_60ml, price_90ml, price_180ml, price_bottle) VALUES
('Black Label', 'Whisky', 'Johnnie Walker', 250, 450, 650, 1200, 4500),
('Chivas Regal 12', 'Whisky', 'Chivas', 300, 550, 800, 1500, 5500),
('Jack Daniels', 'Whisky', 'Jack Daniels', 280, 500, 720, 1350, 5000),
('Glenfiddich 12', 'Whisky', 'Glenfiddich', 350, 650, 950, 1800, 6500),
('Grey Goose', 'Vodka', 'Grey Goose', 280, 500, 720, 1350, 5000),
('Absolut', 'Vodka', 'Absolut', 200, 380, 550, 1000, 3800),
('Smirnoff', 'Vodka', 'Smirnoff', 150, 280, 400, 750, 2800),
('Bacardi White', 'Rum', 'Bacardi', 150, 280, 400, 750, 2800),
('Captain Morgan', 'Rum', 'Captain Morgan', 180, 320, 460, 850, 3200),
('Old Monk', 'Rum', 'Old Monk', 100, 180, 260, 480, 1800),
('Beefeater', 'Gin', 'Beefeater', 200, 380, 550, 1000, 3800),
('Bombay Sapphire', 'Gin', 'Bombay Sapphire', 250, 450, 650, 1200, 4500),
('Patron Silver', 'Tequila', 'Patron', 350, 650, 950, 1800, 6500),
('Jose Cuervo', 'Tequila', 'Jose Cuervo', 200, 380, 550, 1000, 3800),
('Kingfisher Ultra', 'Beer', 'Kingfisher', NULL, NULL, NULL, NULL, 250),
('Heineken', 'Beer', 'Heineken', NULL, NULL, NULL, NULL, 300),
('Corona', 'Beer', 'Corona', NULL, NULL, NULL, NULL, 350),
('Budweiser', 'Beer', 'Budweiser', NULL, NULL, NULL, NULL, 280),
('Sula Shiraz', 'Wine', 'Sula', NULL, NULL, NULL, NULL, 1200),
('Fratelli Sangiovese', 'Wine', 'Fratelli', NULL, NULL, NULL, NULL, 1500);

-- Sample Food Data
INSERT INTO public.food_menu (name, category, description, price, vegetarian) VALUES
-- Starters
('Paneer Tikka', 'Starters', 'Grilled cottage cheese marinated in spices', 350, true),
('Chicken Tikka', 'Starters', 'Tender chicken pieces marinated and grilled', 400, false),
('Malai Kebab', 'Starters', 'Creamy chicken kebabs with cashew paste', 450, false),
('Tandoori Mushroom', 'Starters', 'Grilled mushrooms with tandoori spices', 320, true),
('Fish Tikka', 'Starters', 'Marinated fish chunks grilled to perfection', 480, false),
('Hara Bhara Kebab', 'Starters', 'Spinach and peas patties', 300, true),
('Prawn Koliwada', 'Starters', 'Crispy fried prawns with coastal spices', 550, false),
('Veg Spring Rolls', 'Starters', 'Crispy rolls with mixed vegetables', 280, true),
('Chicken Wings', 'Starters', 'Spicy glazed chicken wings', 420, false),
('Crispy Corn', 'Starters', 'Golden fried corn kernels with spices', 260, true),

-- Snacks
('French Fries', 'Snacks', 'Classic crispy golden fries', 200, true),
('Peri Peri Fries', 'Snacks', 'Fries tossed in peri peri seasoning', 240, true),
('Chicken Popcorn', 'Snacks', 'Bite-sized crispy chicken', 320, false),
('Nachos Supreme', 'Snacks', 'Tortilla chips with cheese, salsa & jalapenos', 350, true),
('Loaded Nachos', 'Snacks', 'Nachos with chicken, cheese & toppings', 420, false),
('Onion Rings', 'Snacks', 'Crispy battered onion rings', 220, true),
('Chicken Nuggets', 'Snacks', 'Golden fried chicken nuggets', 300, false),
('Masala Papad', 'Snacks', 'Crispy papad with onion tomato topping', 120, true),
('Cheese Balls', 'Snacks', 'Deep fried cheesy balls', 280, true),
('Chicken Samosa', 'Snacks', 'Spiced chicken filled pastry', 180, false),

-- Full Course
('Butter Chicken', 'Full Course', 'Creamy tomato curry with chicken (with naan/rice)', 480, false),
('Dal Makhani', 'Full Course', 'Rich black lentils cooked overnight (with naan/rice)', 380, true),
('Paneer Butter Masala', 'Full Course', 'Cottage cheese in rich tomato gravy (with naan/rice)', 420, true),
('Chicken Biryani', 'Full Course', 'Aromatic rice with spiced chicken', 450, false),
('Veg Biryani', 'Full Course', 'Fragrant rice with mixed vegetables', 380, true),
('Mutton Rogan Josh', 'Full Course', 'Tender mutton in Kashmiri spices (with naan/rice)', 580, false),
('Palak Paneer', 'Full Course', 'Cottage cheese in spinach gravy (with naan/rice)', 400, true),
('Fish Curry', 'Full Course', 'Coastal style fish curry (with rice)', 520, false),
('Kadhai Chicken', 'Full Course', 'Spicy chicken with bell peppers (with naan/rice)', 460, false),
('Veg Kolhapuri', 'Full Course', 'Mixed vegetables in spicy Kolhapuri gravy (with naan/rice)', 390, true),
('Chicken Tikka Masala', 'Full Course', 'Grilled chicken in creamy tomato sauce (with naan/rice)', 500, false),
('Paneer Tikka Masala', 'Full Course', 'Grilled paneer in rich gravy (with naan/rice)', 440, true);
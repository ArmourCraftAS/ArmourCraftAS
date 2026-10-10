-- =========================================================================
-- ArmourCraft AS - Full Schema & Sync (Products, Blogs, FAQs)
-- =========================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    price NUMERIC,
    price_display TEXT,
    category TEXT NOT NULL DEFAULT 'Thigh Guards',
    stance TEXT DEFAULT 'All Stances',
    stances JSONB DEFAULT '["All Stances", "Right-Handed", "Left-Handed"]'::jsonb,
    sizes JSONB DEFAULT '["Small", "Medium", "Large"]'::jsonb,
    image TEXT,
    stock INT DEFAULT 50,
    status TEXT DEFAULT 'In Stock',
    impact_rating TEXT DEFAULT '160+ km/h',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & policies for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow product insert" ON public.products;
CREATE POLICY "Allow product insert" ON public.products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow product update" ON public.products;
CREATE POLICY "Allow product update" ON public.products FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow product delete" ON public.products;
CREATE POLICY "Allow product delete" ON public.products FOR DELETE USING (true);

-- 2. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
    id TEXT PRIMARY KEY,
    slug TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    excerpt TEXT,
    category TEXT DEFAULT 'Impact Science',
    author TEXT DEFAULT 'ArmourCraft Lab',
    read_time TEXT DEFAULT '5 min read',
    date TEXT,
    image TEXT,
    detail_hero_image TEXT,
    sections JSONB DEFAULT '[]'::jsonb,
    content JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & policies for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view blogs" ON public.blogs;
CREATE POLICY "Public can view blogs" ON public.blogs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow blog insert" ON public.blogs;
CREATE POLICY "Allow blog insert" ON public.blogs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow blog update" ON public.blogs;
CREATE POLICY "Allow blog update" ON public.blogs FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow blog delete" ON public.blogs;
CREATE POLICY "Allow blog delete" ON public.blogs FOR DELETE USING (true);

-- 3. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & policies for faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view faqs" ON public.faqs;
CREATE POLICY "Public can view faqs" ON public.faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow faq insert" ON public.faqs;
CREATE POLICY "Allow faq insert" ON public.faqs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow faq update" ON public.faqs;
CREATE POLICY "Allow faq update" ON public.faqs FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow faq delete" ON public.faqs;
CREATE POLICY "Allow faq delete" ON public.faqs FOR DELETE USING (true);

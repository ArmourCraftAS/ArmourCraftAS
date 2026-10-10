-- =========================================================================
-- ArmourCraft AS - Visual CMS Store Table & RLS Policies
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.cms_content (
    key TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Allow public read
DROP POLICY IF EXISTS "Public can view cms_content" ON public.cms_content;
CREATE POLICY "Public can view cms_content" ON public.cms_content FOR SELECT USING (true);

-- Allow insert/update/delete for anon and authenticated users
DROP POLICY IF EXISTS "Allow cms_content insert" ON public.cms_content;
CREATE POLICY "Allow cms_content insert" ON public.cms_content FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow cms_content update" ON public.cms_content;
CREATE POLICY "Allow cms_content update" ON public.cms_content FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow cms_content delete" ON public.cms_content;
CREATE POLICY "Allow cms_content delete" ON public.cms_content FOR DELETE USING (true);

-- Grant schema permissions
GRANT ALL ON TABLE public.cms_content TO anon;
GRANT ALL ON TABLE public.cms_content TO authenticated;
GRANT ALL ON TABLE public.cms_content TO service_role;

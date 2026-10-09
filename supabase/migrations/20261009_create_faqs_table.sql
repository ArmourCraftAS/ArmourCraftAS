-- =========================================================================
-- ArmourCraft AS - FAQs Table Schema & Initial Seed
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to FAQs for storefront and contact pages
DROP POLICY IF EXISTS "Public can view FAQs" ON public.faqs;
CREATE POLICY "Public can view FAQs"
    ON public.faqs FOR SELECT
    USING (true);

-- Allow authenticated and anon insert/update/delete for admin management
DROP POLICY IF EXISTS "Allow FAQ insert" ON public.faqs;
CREATE POLICY "Allow FAQ insert"
    ON public.faqs FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow FAQ update" ON public.faqs;
CREATE POLICY "Allow FAQ update"
    ON public.faqs FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow FAQ delete" ON public.faqs;
CREATE POLICY "Allow FAQ delete"
    ON public.faqs FOR DELETE
    USING (true);

-- Initial seed data matching image_6a79b6.png
INSERT INTO public.faqs (id, question, answer, display_order)
VALUES
    (
        'faq-1',
        'What materials are used in ArmourCraft thigh guards?',
        'Our gear uses high-density EVA foam combined with reinforced carbon-fiber shells for maximum impact protection without extra weight.',
        1
    ),
    (
        'faq-2',
        'How do I choose between Right-Handed and Left-Handed sizing?',
        'Right-handed batsmen wear the primary outer guard on their left (front) thigh facing the bowler, while left-handed batsmen wear it on their right thigh. Select your batting stance during checkout to get the anatomically contoured fit.',
        2
    ),
    (
        'faq-3',
        'What is your shipping and return policy for international orders?',
        'We offer express worldwide shipping with tracking on all orders. Standard returns are accepted within 30 days of delivery in unused condition.',
        3
    ),
    (
        'faq-4',
        'What is the highest ball speed these guards can handle?',
        'Our guards are rigorously lab-tested and match-certified against hard season leather cricket balls delivered at speeds in excess of 160+ km/h (99+ mph), offering maximum impact dispersion and shock absorption.',
        4
    ),
    (
        'faq-5',
        'What is your warranty policy for strap breakage?',
        'We offer a 1-year comprehensive replacement guarantee on all straps, elastic bands, and velcro closures. If your straps experience any fraying or breakage under match conditions, we replace them free of charge.',
        5
    )
ON CONFLICT (id) DO UPDATE 
SET 
    question = EXCLUDED.question,
    answer = EXCLUDED.answer,
    updated_at = NOW();

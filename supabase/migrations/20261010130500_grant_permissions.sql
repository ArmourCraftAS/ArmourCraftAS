-- Grant table permissions to anon and authenticated roles for Products, Blogs, FAQs
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.blogs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.faqs TO anon, authenticated, service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

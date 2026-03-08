-- Create card_data table for all business card info
CREATE TABLE public.card_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name_en TEXT DEFAULT 'Mahmoud Abdelrahman',
  name_ar TEXT DEFAULT 'محمود عبدالرحمن',
  title_en TEXT DEFAULT 'Business Analyst',
  title_ar TEXT DEFAULT 'محلل أعمال',
  company_en TEXT DEFAULT 'Etmam for Information Technology',
  company_ar TEXT DEFAULT 'إتمام لتقنية المعلومات',
  about_en TEXT DEFAULT 'Passionate Business Analyst with expertise in bridging the gap between business needs and technology solutions.',
  about_ar TEXT DEFAULT 'محلل أعمال شغوف بالتقنية وتحسين العمليات',
  phone TEXT DEFAULT '+966 560 303 813',
  email TEXT DEFAULT 'mahmoud@etmam.com',
  location_en TEXT DEFAULT 'Sulaymaniyah, Riyadh 12242',
  location_ar TEXT DEFAULT 'السليمانية، الرياض 12242',
  website_url TEXT DEFAULT 'https://etmam.com',
  linkedin_url TEXT DEFAULT 'https://linkedin.com/in/mahmoud-abdelrahman',
  whatsapp_url TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  skills JSONB DEFAULT '["Business Analysis","Requirements Gathering","Process Optimization","Stakeholder Management","Agile Methodology","Data Analysis"]'::jsonb,
  experience JSONB DEFAULT '[{"title_en":"Business Analyst","title_ar":"محلل أعمال","company_en":"Etmam for Information Technology","company_ar":"إتمام لتقنية المعلومات"}]'::jsonb,
  education JSONB DEFAULT '[{"degree_en":"Bachelors Degree","degree_ar":"بكالوريوس","field_en":"Business Information Systems","field_ar":"نظم معلومات إدارية"}]'::jsonb,
  primary_color TEXT DEFAULT '217 91% 60%',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.card_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Card data is publicly readable" ON public.card_data FOR SELECT USING (true);
CREATE POLICY "Users can update their own card" ON public.card_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own card" ON public.card_data FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_card_data_updated_at
  BEFORE UPDATE ON public.card_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.card_data (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Create resume_links table for managing resume downloads
CREATE TABLE public.resume_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  file_size TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.resume_links ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to active resume links
CREATE POLICY "Resume links are viewable by everyone" 
ON public.resume_links 
FOR SELECT 
USING (is_active = true);

-- Create policy to allow authenticated users to manage resume links
CREATE POLICY "Authenticated users can manage resume links" 
ON public.resume_links 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_resume_links_updated_at
BEFORE UPDATE ON public.resume_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default resume link (Google Drive)
INSERT INTO public.resume_links (name, description, file_url, file_type, file_size, is_active, display_order) VALUES
(
  'Software Engineer Resume',
  'Latest resume with current experience and skills',
  'https://drive.google.com/uc?export=download&id=1Sc1-lz6ejMOKE8fvOJitZi5mUzKgKtPC',
  'pdf',
  '10MB',
  true,
  1
);

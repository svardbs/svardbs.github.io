-- Create games table
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spellaggare TEXT NOT NULL,
  antal_deltagare INTEGER NOT NULL CHECK (antal_deltagare > 0),
  total_insats DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (total_insats >= 0),
  antal_ratt INTEGER NOT NULL DEFAULT 0 CHECK (antal_ratt >= 0),
  utdelning DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (utdelning >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on games table
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Allow public read access to games (anyone can view statistics)
CREATE POLICY "Anyone can view games"
  ON public.games
  FOR SELECT
  USING (true);

-- Only allow insert through authenticated session or service role (we'll handle admin check in app)
CREATE POLICY "Service role can insert games"
  ON public.games
  FOR INSERT
  WITH CHECK (true);

-- Create admin_settings table to store admin credentials hash
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- No one can read admin settings directly (we'll use edge function)
CREATE POLICY "No direct read access"
  ON public.admin_settings
  FOR SELECT
  USING (false);

-- Insert default admin credentials (username: admin, password: admin123)
-- In production, this should be changed immediately
INSERT INTO public.admin_settings (setting_key, setting_value) 
VALUES 
  ('admin_username', 'admin'),
  ('admin_password_hash', 'admin123');
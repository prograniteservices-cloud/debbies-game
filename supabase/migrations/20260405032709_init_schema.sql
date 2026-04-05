CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    display_name TEXT,
    theme_id TEXT DEFAULT 'unicorn',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_mode TEXT,
    max_level INT DEFAULT 1,
    max_score INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(profile_id, game_mode)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated access (assuming simple device-based or anon auth for kids game)
CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Public scores access" ON public.scores FOR ALL USING (true);

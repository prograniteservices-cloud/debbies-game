-- Nighttime Companion / Project Starry Schema Additions

CREATE TABLE public.child_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT,
    age INT,
    interests JSONB DEFAULT '[]'::jsonb,
    deprioritized_themes JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.library_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT,
    cleaned_text TEXT NOT NULL,
    summary TEXT,
    themes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.saga_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_profile_id UUID REFERENCES public.child_profile(id) ON DELETE CASCADE,
    world_name TEXT NOT NULL,
    recent_events TEXT,
    established_characters JSONB DEFAULT '{}'::jsonb,
    last_session_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.child_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saga_memories ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated access (since this is a frictionless kids game)
CREATE POLICY "Public child_profile access" ON public.child_profile FOR ALL USING (true);
CREATE POLICY "Public library_content access" ON public.library_content FOR ALL USING (true);
CREATE POLICY "Public saga_memories access" ON public.saga_memories FOR ALL USING (true);

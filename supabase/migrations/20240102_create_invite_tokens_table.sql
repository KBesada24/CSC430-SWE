-- Create invite_tokens table for club invite links
CREATE TABLE IF NOT EXISTS public.invite_tokens (
  token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES public.clubs(club_id) ON DELETE CASCADE,
  token VARCHAR(64) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(club_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON public.invite_tokens(token);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_club ON public.invite_tokens(club_id);

-- Add to realtime publication
-- Add to realtime publication if not already present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'invite_tokens') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.invite_tokens;
  END IF;
END $$;

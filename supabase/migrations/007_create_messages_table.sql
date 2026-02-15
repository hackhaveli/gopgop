-- Create messages table for chatting
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies for messages
CREATE POLICY "Users can view messages for their inquiries" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.inquiries i
            LEFT JOIN public.brand_profiles b ON i.brand_id = b.id
            LEFT JOIN public.creator_profiles c ON i.creator_id = c.id
            WHERE i.id = messages.inquiry_id AND (
                b.user_id = auth.uid() OR 
                c.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can insert messages to their inquiries" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.inquiries i
            LEFT JOIN public.brand_profiles b ON i.brand_id = b.id
            LEFT JOIN public.creator_profiles c ON i.creator_id = c.id
            WHERE i.id = messages.inquiry_id AND (
                b.user_id = auth.uid() OR 
                c.user_id = auth.uid()
            )
        )
    );

-- Add real-time publication for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

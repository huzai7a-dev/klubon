import { supabase } from '@/lib/supabase';
import { useInfiniteQuery } from '@tanstack/react-query';

const MESSAGES_PER_PAGE = 20;

export const useMessages = (roomId: string) => {
    return useInfiniteQuery({
        queryKey: ['messages', roomId],
        queryFn: async ({ pageParam = 0 }) => {
            const from = pageParam * MESSAGES_PER_PAGE;
            const to = from + MESSAGES_PER_PAGE - 1;

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', roomId)
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            return data; // Array of messages for this specific page
        },
        getNextPageParam: (lastPage, allPages) => {
            // If the last page we fetched was full, there's likely a next page
            return lastPage.length === MESSAGES_PER_PAGE ? allPages.length : undefined;
        },
        initialPageParam: 0,
        enabled: !!roomId,
    });
};
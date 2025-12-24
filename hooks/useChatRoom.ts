import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

export const useChatRooms = () => {
    const queryClient = useQueryClient();
    const queryKey = ['chat_rooms'];

    const query = useQuery({
        queryKey,
        queryFn: async () => {
            const { data, error } = await supabase.rpc('get_my_chat_rooms');
            if (error) throw error;
            return data;
        },
    });

    useEffect(() => {
        // Listen for ANY change in the messages table
        const channel = supabase
            .channel('global-chat-updates')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages'
            }, () => {
                // When any message changes, invalidate and refetch the room list
                // This ensures the last message and unread count are always fresh
                queryClient.invalidateQueries({ queryKey });
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return query;
};
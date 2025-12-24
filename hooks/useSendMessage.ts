import { supabase } from '@/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useSendMessages = (roomId: string, currentUserId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (content: string) => {
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    room_id: roomId,
                    sender_id: currentUserId,
                    content,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onMutate: async (newContent) => {
            await queryClient.cancelQueries({ queryKey: ['messages', roomId] });

            const previousData = queryClient.getQueryData(['messages', roomId]);

            // Optimistically update the first page of the infinite query
            queryClient.setQueryData(['messages', roomId], (old: any) => {
                if (!old) return old;
                const optimisticMsg = {
                    id: `temp-${Date.now()}`,
                    content: newContent,
                    sender_id: currentUserId,
                    created_at: new Date().toISOString(),
                    is_read: false,
                };

                return {
                    ...old,
                    pages: [
                        [optimisticMsg, ...old.pages[0]], // Prepend to the first page
                        ...old.pages.slice(1),
                    ],
                };
            });

            return { previousData };
        },
        onError: (err, newContent, context) => {
            // Rollback to previous state on failure
            queryClient.setQueryData(['messages', roomId], context?.previousData);
        },
        onSettled: () => {
            // Refetch or invalidate to ensure IDs are synced
            queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
        },
    });
};
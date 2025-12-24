import { useSession } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";


const useOpenChatRoom = () => {
    const router = useRouter();
    const { user } = useSession();

    const openChatRoom = async (otherUser: { id: string, name: string, avatar_url: string }) => {
        const { data: roomId, error } = await supabase.rpc('get_or_create_room', {
            user_a: user?.id,
            user_b: otherUser.id
        });

        if (error) {
            console.error("Error initializing chat:", error);
            return;
        }

        router.push({
            pathname: "/(app)/chats/[id]",
            params: {
                id: roomId,
                otherUserId: otherUser.id,
                otherUserName: otherUser.name,
                otherUserAvatar: otherUser.avatar_url
            }
        });
    }

    return {
        openChatRoom
    }
}

export default useOpenChatRoom;
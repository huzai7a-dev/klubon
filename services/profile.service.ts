import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";

class ProfileService {
    getUserProfile = async (userId: string): Promise<UserProfile | null> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) {
                console.error('Error fetching profile:', error);
                return null;
            }
            return data;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    }
}

export default new ProfileService()
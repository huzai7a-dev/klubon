import { Activity } from "@/components/ui/ActivityChip";
import { supabase } from "@/lib/supabase";
import { UserActivity } from "@/types";

class ActivitiesService {
    getAllActivities = async ({
        search,
        page,
        limit,
    }: {
        search?: string;
        page: number;
        limit: number;
    }): Promise<Activity[] | null> => {
        try {
            let queryBuilder = supabase
                .from('activities')
                .select('*')

            if (search) {
                queryBuilder = queryBuilder.ilike('name', `%${search}%`);
            }

            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error } = await queryBuilder.range(from, to);
            if (error) {
                console.error('Error fetching activities:', error);
                return null;
            }
            return data;
        } catch (error) {
            console.error('Error fetching activities:', error);
            return null;
        }
    }

    getActivitiesByProfileId = async (profileId: string): Promise<UserActivity[] | null> => {
        try {
            const { data, error } = await supabase
                .from('user_activities')
                .select(`
                    id,
                    number_of_players,
                    activity:activities (
                    id,
                    name
                    )
                `)
                .eq('user_id', profileId)
            if (error) {
                console.error('Error fetching activities:', error);
                return null;
            }
            return data;
        } catch (error) {
            console.error('Error fetching activities:', error);
            return null;
        }
    }
}

export default new ActivitiesService()
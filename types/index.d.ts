export interface UserProfile {
    id: string;
    name: string;
    user_gender: string;
    short_bio?: string;
    city?: string;
    avatar_url?: string;
    location?: any;
    distance_radius_km?: number;
    competitive_toggle?: boolean;
    typical_play_times?: string;
    hide_precise_distance?: boolean;
    hide_last_active?: boolean;
    private_profile?: boolean;
    is_premium?: boolean;
    created_at?: string;
}

import { Activity } from "@/components/ui/ActivityChip";

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
  user_activities?: {
    id: string;
    user_id: string;
    activity_id: string;
    number_of_players?: number;
    activities: {
      id: string;
      name: string;
    };
  }[];
}

export interface CreateProfileData {
  name: string;
  user_gender: string;
  short_bio?: string;
  city?: string;
  avatar_uri?: string; // Form uses avatar_uri
  avatar_url?: string; // DB uses avatar_url
  location?: any;
  latitude?: number;
  longitude?: number;
  distance_radius_km?: number;
  activities?: Activity[];
  prefers_female: boolean;
  prefers_male: boolean;
  prefers_other: boolean;
}

import { supabase } from "@/lib/supabase";
import { CreateProfileData, UserProfile } from "@/types";
import storageService from "./storage.service";

class ProfileService {
  getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // If the error is that no rows returned, it just means profile doesn't exist
        if (error.code === "PGRST116") return null;
        console.error("Error fetching profile:", error);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  createProfile = async (
    userId: string,
    profileData: CreateProfileData
  ): Promise<UserProfile | null> => {
    try {
      let avatarUrl = null;

      // 1. Upload Avatar if present
      if (
        profileData.avatar_uri &&
        !profileData.avatar_uri.startsWith("http")
      ) {
        const extension =
          profileData.avatar_uri.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${userId} /avatar.${extension}`;
        avatarUrl = await storageService.uploadImage(
          profileData.avatar_uri,
          "avatars",
          path
        );
      }

      // 2. Prepare Profile Data
      // We need to format the location for PostGIS if latitude/longitude exist
      // Using a raw PostGIS string format: SRID=4326;POINT(lon lat)
      let locationPayload = null;
      if (profileData.latitude && profileData.longitude) {
        locationPayload = `SRID=4326;POINT(${profileData.longitude} ${profileData.latitude})`;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId,
            name: profileData.name,
            user_gender: profileData.user_gender,
            short_bio: profileData.short_bio,
            city: profileData.city,
            avatar_url: avatarUrl,
            distance_radius_km: profileData.distance_radius_km,
            location: locationPayload,
          },
        ])
        .select()
        .single();

      if (profileError) {
        console.error("Error creating profile record:", profileError);
        return null;
      }

      // 3. Insert Match Preferences
      const { error: prefError } = await supabase
        .from("match_preferences")
        .insert([
          {
            user_id: userId,
            prefers_male: profileData.prefers_male,
            prefers_female: profileData.prefers_female,
            prefers_nonbinary: profileData.prefers_other, // Mapping 'other' to 'nonbinary' in DB if that's the column name
          },
        ]);

      if (prefError) {
        console.error("Error inserting preferences:", prefError);
        // Non-critical? Or should we rollback? (No transactions in client lib yet easily)
      }

      // 4. Insert Activities
      if (profileData.activities && profileData.activities.length > 0) {
        const activitiesPayload = profileData.activities.map((activity) => ({
          user_id: userId,
          activity_id: activity.id,
          number_of_players: activity.playerCount || 1,
        }));

        const { error: activitiesError } = await supabase
          .from("user_activities")
          .insert(activitiesPayload);

        if (activitiesError) {
          console.error("Error inserting activities:", activitiesError);
        }
      }

      return profile;
    } catch (error) {
      console.error("Error in createProfile service:", error);
      return null;
    }
  };
}

export default new ProfileService();

import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import RatingSummary from "@/components/RatingSummary";
import FilterChip from "@/components/ui/FilterChip";
import SettingToggle from "@/components/ui/SettingToggle";
import { Colors } from "@/constants/theme";
import { useSession } from "@/contexts/AuthContext";
import activitiesService from "@/services/activities.service";
import { useQuery } from "@tanstack/react-query";

// Mock Data
const USER_PROFILE = {
  name: "Alex Johnson",
  city: "San Francisco, CA",
  bio: "Love playing tennis on weekends and padel whenever I can find a court! Always up for a match.",
  photoUrl: "https://i.pravatar.cc/300?img=11",
  rating: 4.8,
  reviewCount: 24,
};

export default function MyProfileScreen() {
  const { signOut, profile, updateUserProfile } = useSession();
  const { data: activities } = useQuery({
    queryKey: ['activities', profile?.id],
    queryFn: () => activitiesService.getActivitiesByProfileId(profile!.id),
    enabled: !!profile?.id,
  })
  const isCompetitive = profile?.competitive_toggle ?? false;



  const handleEditProfile = () => {
    router.push("/(app)/profile/edit_profile");
  };

  const handleViewRatings = () => {
    console.log("Navigate to View My Ratings");
  };

  const handleAddActivity = () => {
    console.log("Open Add/Edit Activities Modal");
  };

  const handleRemoveActivity = (id: string) => {
    console.log(`Remove activity ${id}`);
    // In a real app, this would show a confirmation or toggle selection state
  };

  const togglePrivacy = (key: 'hide_precise_distance' | 'hide_last_active' | 'private_profile') => {
    // Determine the new value based on current profile state
    const currentValue = profile?.[key] || false;
    updateUserProfile({ [key]: !currentValue });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={{ uri: profile?.avatar_url }} style={styles.avatar} />
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.city}>{profile?.city}</Text>

          <TouchableOpacity
            onPress={handleEditProfile}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>

          <Text style={styles.bio}>{profile?.short_bio}</Text>
        </View>
        {/* Summary & Action Bar */}
        <View style={styles.summaryBar}>
          <TouchableOpacity onPress={handleViewRatings}>
            <Text style={styles.viewRatingsLink}>View My Ratings</Text>
          </TouchableOpacity>
          <RatingSummary
            averageRating={USER_PROFILE.rating}
            reviewCount={USER_PROFILE.reviewCount}
            onPress={handleViewRatings}
            align="horizontal"
          />
        </View>
        <View style={styles.divider} />
        {/* Activities Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Activities</Text>
          </View>
          <View style={styles.chipContainer}>
            {activities?.map((activity) => (
              <FilterChip
                key={activity.activity?.id}
                label={activity.activity?.name}
                isActive={true}
                onPress={() => handleRemoveActivity(activity.id)}
              />
            ))}
          </View>
        </View>
        <View style={styles.divider} />
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Play Style & Times</Text>

          <View style={styles.preferenceRow}>
            <Text style={styles.preferenceLabel}>Play Style</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  !isCompetitive && styles.toggleOptionActive,
                ]}
                onPress={() => updateUserProfile({ competitive_toggle: false })}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !isCompetitive && styles.toggleTextActive,
                  ]}
                >
                  Casual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleOption,
                  isCompetitive && styles.toggleOptionActive,
                ]}
                onPress={() => updateUserProfile({ competitive_toggle: true })}
              >
                <Text
                  style={[
                    styles.toggleText,
                    isCompetitive && styles.toggleTextActive,
                  ]}
                >
                  Competitive
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Typical Play Times</Text>
            <Text style={{ fontSize: 16, color: Colors.text, paddingVertical: 10 }}>
              {profile?.typical_play_times || "Not set"}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Visibility</Text>
          <SettingToggle
            label="Hide Precise Distance"
            description="Show approximate location only"
            value={profile?.hide_precise_distance || false}
            onToggle={() => togglePrivacy("hide_precise_distance")}
          />
          <SettingToggle
            label="Hide Last Active"
            value={profile?.hide_last_active || false}
            onToggle={() => togglePrivacy("hide_last_active")}
          />
          <SettingToggle
            label="Private Profile"
            description="Only friends can message you"
            value={profile?.private_profile || false}
            onToggle={() => togglePrivacy("private_profile")}
          />
        </View>
        <View style={styles.section}>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        {/* Bottom padding for scroll */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  city: {
    fontSize: 16,
    color: Colors.greyDark,
    marginBottom: 12,
  },
  editButton: {
    marginBottom: 16,
  },
  editButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  bio: {
    fontSize: 14,
    color: Colors.greyDark,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  summaryBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.greyLight,
    gap: 12,
  },
  viewRatingsLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 12,
  },
  iconButton: {
    padding: 4,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: -10, // Counteract chip top margin
  },
  divider: {
    height: 8,
    backgroundColor: Colors.greyLight,
  },
  preferenceRow: {
    marginBottom: 20,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.greyDark,
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: Colors.greyLight,
    borderRadius: 8,
    padding: 4,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  toggleOptionActive: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.greyDark,
  },
  toggleTextActive: {
    color: Colors.text,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.greyDark,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.greyLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text,
  },
  logoutButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.redLight,
    borderRadius: 8,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.red,
  },
});

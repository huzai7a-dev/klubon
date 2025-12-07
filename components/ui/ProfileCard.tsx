import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import FilterChip from "./FilterChip";
import PrimaryButton from "./PrimaryButton";
import StarRating from "./StarRating";

interface User {
  id: string;
  name: string;
  distance: string;
  rating?: number;
  activities: string[];
  photoUrl?: string;
}

interface Props {
  user: User;
  style?: ViewStyle;
}

export default function ProfileCard({ user, style }: Props) {
  const router = useRouter();

  const handleViewProfile = () => {
    // Navigate to profile page with user id
    // You can create a profile/[id].tsx route in app/(app)/profile/[id].tsx
    try {
      router.push(`/profile/${user.id}` as any);
    } catch (error) {
      // Fallback if route doesn't exist yet
      console.log("View profile for:", user.id, user.name);
    }
  };

  return (
    <View style={[styles.card, style]}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: user.photoUrl || "https://placekitten.com/800/600" }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Distance badge */}
        <View style={styles.distanceBadge}>
          <MaterialIcons name="location-on" size={14} color="#FFFFFF" />
          <Text style={styles.distanceText}>{user.distance}</Text>
        </View>
      </View>

      {/* User Info Section */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.ratingRow}>
              <StarRating
                rating={user.rating ?? 4.5}
                size={14}
                showNumber={true}
              />
            </View>
          </View>
        </View>

        {/* Activity Tags */}
        <View style={styles.activityRow}>
          {user.activities.slice(0, 3).map((activity) => (
            <FilterChip
              key={activity}
              label={activity}
              isActive={true}
              onPress={() => console.log("Activity", activity)}
            />
          ))}
        </View>

        {/* View Profile Button */}
        <PrimaryButton
          title="View Profile"
          onPress={handleViewProfile}
          compact={true}
          style={styles.profileButton}
        />
      </View>
    </View>
  );
}

const BORDER_RADIUS = 16;
const IMAGE_HEIGHT = 200;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: BORDER_RADIUS,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  imageContainer: {
    width: "100%",
    height: IMAGE_HEIGHT,
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  distanceBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  distanceText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  ratingRow: {
    marginTop: 2,
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  profileButton: {
    marginTop: 4,
  },
});

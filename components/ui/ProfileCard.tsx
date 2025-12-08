import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "../../constants/theme";
import PrimaryButton from "./PrimaryButton";

interface User {
  id: string;
  name: string;
  distance: string;
  rating?: number;
  activities: string[];
  photoUrl?: string;
  age?: number; // Added optional age since it's in the design
}

interface Props {
  user: User;
  style?: ViewStyle;
}

export default function ProfileCard({ user, style }: Props) {
  const router = useRouter();

  const handleViewProfile = () => {
    // Navigate to profile page
    router.push(`/profile/${user.id}` as any);
  };

  const handleMessage = () => {
    console.log("Message", user.name);
  };

  const handleFavorite = () => {
    console.log("Favorite", user.name);
  };

  return (
    <View style={[styles.card, style]}>
      {/* Full Bleed Image */}
      <Image
        source={{ uri: user.photoUrl || "https://placekitten.com/800/600" }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />

      {/* Gradient/Blur Overlay */}
      <BlurView intensity={40} tint="dark" style={styles.overlay}>
        <View style={styles.contentContainer}>
          {/* Name & Age */}
          <Text style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            {user.age && <Text style={styles.age}>, {user.age}</Text>}
          </Text>

          {/* Location */}
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={16} color={Colors.white} />
            <Text style={styles.locationText}>{user.distance}</Text>
          </View>

          {/* Activity Chips */}
          <View style={styles.chipRow}>
            {user.activities.slice(0, 3).map((activity) => (
              <View key={activity} style={styles.chip}>
                <Text style={styles.chipText}>{activity}</Text>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <PrimaryButton
              title="View Profile"
              onPress={handleViewProfile}
              style={{ flex: 1, marginVertical: 0 }}
            />
          </View>
        </View>
      </BlurView>

      {/* Invisible Touch Area to maintain card tap behavior if needed, 
          but usually buttons handle actions. 
          If the user wants the whole card to be tappable to view profile: */}
      <TouchableOpacity
        style={styles.touchableFill}
        onPress={handleViewProfile}
        activeOpacity={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 500, // Taller card for the full-screen feel
    borderRadius: 24,
    backgroundColor: Colors.greyLight,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  touchableFill: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // Behind buttons but accessible if nothing else caught it? 
    // Actually, on RN zIndex doesn't work well for "pass through". 
    // Better to just let buttons be on top.
    // If we want the background to be tappable, we'd wrap content. 
    // For now, let's assume the buttons are the primary actions, 
    // but typically tapping the face opens profile.
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    paddingBottom: 24,
    // Add a slight gradient-like background if blur isn't enough or for better contrast
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  contentContainer: {
    gap: 6,
  },
  nameRow: {
    color: Colors.white,
    marginBottom: 2,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.white,
  },
  age: {
    fontSize: 26,
    fontWeight: "400",
    color: Colors.white,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    color: Colors.white,
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  chipText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 2,
    //paddingHorizontal: 1, // Add some padding for the button
  },
});

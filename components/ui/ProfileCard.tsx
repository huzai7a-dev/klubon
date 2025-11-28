import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import ActionIcon from "./ActionIcon";
import FilterChip from "./FilterChip";

interface User {
  id: string;
  name: string;
  distance: string;
  activities: string[];
  photoUrl?: string;
}

interface Props {
  user: User;
  style?: ViewStyle;
}

export default function ProfileCard({ user, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      <ImageBackground
        source={{ uri: user.photoUrl || "https://placekitten.com/800/600" }}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.infoOverlay}>
          <View style={styles.textRow}>
            <View>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.distance}>📍 {user.distance}</Text>
            </View>

            <View style={styles.actionsRow}>
              <ActionIcon
                iconName="heart"
                onPress={() => console.log("Favorite", user.name)}
                isPrimary={true}
              />
            </View>
          </View>

          <View style={styles.activityRow}>
            {user.activities.slice(0, 3).map((a) => (
              <FilterChip
                key={a}
                label={a}
                isActive={false}
                onPress={() => console.log("Activity", a)}
              />
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginBottom: 18,
  },
  image: {
    width: "100%",
    height: 220,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 16,
  },
  infoOverlay: {
    padding: 12,
    backgroundColor: "rgba(8,12,20,0.28)",
  },
  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  distance: {
    color: "#E6EEF8",
    fontSize: 12,
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityRow: {
    marginTop: 12,
    flexDirection: "row",
  },
});

import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {
  const segments = useSegments();

  // Check if we are in a detail screen (e.g., chats/[id], profile/[id], profile/edit_profile)
  // Segments for chats/[id] would be ["(app)", "chats", "[id]"]
  // Segments for profile/edit_profile would be ["(app)", "profile", "edit_profile"]
  const isDetailScreen = (segments as any).includes("[id]") || (segments as any).includes("edit_profile");

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.greyNeutral,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            position: "absolute",
            bottom: 25,
            marginHorizontal: 20,
            height: 75,
            borderRadius: 25,
            borderWidth: 0,
            borderColor: Colors.greyLight,
            backgroundColor: Colors.primaryLight,
            shadowColor: Colors.black,
            shadowOpacity: 0.25,
            shadowRadius: 15,
            shadowOffset: { width: 0, height: 15 },
            elevation: 20,
            paddingTop: 0,
            paddingBottom: 0,
            display: isDetailScreen ? "none" : "flex",
          },
          tabBarItemStyle: {
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 13,
            marginBottom: -15,
          },
        }}
      >
        <Tabs.Screen
          name="discover"
          options={{
            title: "Discover",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="explore" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="notification"
          options={{
            title: "Notifications",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="notifications" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="chats"
          options={{
            title: "Chats",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="chat" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarIcon: ({ color }) => (
              <Ionicons size={28} name="heart" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="profile/[id]"
          options={{
            href: null,
          }}
        />

        <Tabs.Screen
          name="profile/edit_profile"
          options={{
            href: null,
          }}
        />

      </Tabs>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
  },
});

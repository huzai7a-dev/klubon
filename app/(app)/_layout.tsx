import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function TabLayout() {

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
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <MaterialIcons size={28} name="person" color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile/[id]"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="chat/[id]"
          options={{
            href: null,
            tabBarStyle: { display: "none" }, // Hide tab bar on chat detail
          }}
        />
        <Tabs.Screen
          name="profile/edit_profile"
          options={{
            href: null,
            tabBarStyle: { display: "none" },
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

import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import NotificationItem, {
  Notification,
} from "@/components/NotificationItem";
import { Colors } from "@/constants/theme";

const COLORS = {
  background: Colors.background,
  card: Colors.white,
  text: Colors.text,
  muted: Colors.greyDark,
  tint: Colors.primary,
};

const mockData: Notification[] = [
  {
    id: "1",
    type: "message",
    senderName: "Ava Martinez",
    timeAgo: "2h",
    message: "Hey! Loved your profile. Want to grab coffee this week?",
    photoUrl: "https://placekitten.com/300/300",
    isRead: false,
  },
  {
    id: "2",
    type: "match",
    senderName: "Liam Chen",
    timeAgo: "1d",
    message: "It's a match! Say hi to Liam to start the conversation.",
    photoUrl: "https://placekitten.com/301/301",
    isRead: false,
  },
  {
    id: "3",
    type: "review",
    senderName: "System",
    timeAgo: "3d",
    message: "Your recent event received a 5-star review. Nice work!",
    photoUrl: undefined,
    isRead: true,
  },
  {
    id: "4",
    type: "general",
    senderName: "KLUBON Team",
    timeAgo: "1w",
    message: "We updated our Terms of Service. Please review the changes.",
    photoUrl: undefined,
    isRead: true,
  },
];

const NotificationsScreen: React.FC = () => {
  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={(id) => console.log("Open", id)}
    />
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          You have {mockData.filter((n) => !n.isRead).length} new
        </Text>
      </View>

      <FlatList
        data={mockData}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 13,
  },
  list: {
    paddingBottom: 130,
    paddingTop: 12,
  },
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 18,
    height: 64,
    borderRadius: 22,
    backgroundColor: Colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    paddingHorizontal: 12,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 4,
  },
  tabItemActive: {
    backgroundColor: COLORS.tint,
    height: 46,
    width: 110,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 12,
  },
});

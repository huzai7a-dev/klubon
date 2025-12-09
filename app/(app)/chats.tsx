import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

// Mock Data
const CHAT_DATA = [
    {
        id: "1",
        name: "Alex Carter",
        message: "Hey! Saw you're nearby...",
        time: "10:00 AM",
        photoUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
        unread: true,
    },
    {
        id: "2",
        name: "Maya Gonzales",
        message: "Are we still on for...",
        time: "Yesterday",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "3",
        name: "Jordan Lee",
        message: "Great game yesterday!",
        time: "Yesterday",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "4",
        name: "Nike Cadra",
        message: "Hey! Saw you're near lo...",
        time: "Yesterday",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "5",
        name: "Jerrah Waters",
        message: "Are we stilll on for...",
        time: "Mon",
        photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "6",
        name: "Miaa Gonzales",
        message: "Great game yesterday!",
        time: "Mon",
        photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
    },
    {
        id: "7",
        name: "Alex Carter",
        message: "Hey! Saw you're nearby...",
        time: "Mon",
        photoUrl: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=100&q=80",
    },
];

export default function ChatScreen() {
    const renderItem = ({ item }: { item: typeof CHAT_DATA[0] }) => (
        <TouchableOpacity style={styles.chatItem} activeOpacity={0.7}>
            <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text style={styles.message} numberOfLines={1}>
                    {item.message}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <Text style={styles.title}>Chats</Text>
                <TouchableOpacity style={styles.newChatButton}>
                    <Ionicons name="create-outline" size={24} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={CHAT_DATA}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 24, // Matches the spacing in the image
    },
    title: {
        fontSize: 28, // Large title
        fontWeight: "800",
        color: Colors.text,
    },
    newChatButton: {
        padding: 4,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 130,
    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: Colors.black, // Using generic black for shadow, could use text color
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2, // Android shadow
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        backgroundColor: Colors.greyLight,
    },
    chatInfo: {
        flex: 1,
        justifyContent: "center",
    },
    chatHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.text,
    },
    time: {
        fontSize: 12,
        color: Colors.greyDark,
        fontWeight: "500",
    },
    message: {
        fontSize: 14,
        color: Colors.greyDark,
        lineHeight: 20,
    },
});

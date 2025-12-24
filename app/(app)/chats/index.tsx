import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { useChatRooms } from "@/hooks/useChatRoom";
import useOpenChatRoom from "@/hooks/useOpenChatRoom";


const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) {
        return "Today";
    } else if (diffInDays === 1) {
        return "Yesterday";
    } else {
        return date.toLocaleDateString();
    }
};

export default function ChatScreen() {
    const router = useRouter();
    const { data: rooms, isLoading, refetch } = useChatRooms();
    const { openChatRoom } = useOpenChatRoom();

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.chatItem}
            activeOpacity={0.7}
            onPress={() => openChatRoom({ id: item.other_user_id, name: item.other_user_name, avatar_url: item.other_user_avatar })}
        >
            <Image source={{ uri: item.other_user_avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.name}>{item.other_user_name}</Text>
                    <Text style={styles.time}>{formatTime(item.last_message_time)}</Text>
                </View>
                <View style={styles.chatFooter}>
                    <Text style={styles.message} numberOfLines={1}>
                        {item.last_message_content}
                    </Text>
                    {item.unread_count > 0 && (
                        <View style={styles.unreadCount}>
                            <Text style={styles.unreadCountText}>{item.unread_count}</Text>
                        </View>
                    )}
                </View>
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
                data={rooms}
                keyExtractor={(item) => item.room_id}
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
    unreadCount: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        padding: 4,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    unreadCountText: {
        color: Colors.white,
        fontSize: 12,
    },
    chatFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
    }
});

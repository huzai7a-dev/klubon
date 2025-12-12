import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Mock messages for the chat detail
const MOCK_MESSAGES = [
    {
        id: "1",
        text: "Hey! Saw you're nearby. Want to play some tennis?",
        sender: "other",
        time: "10:00 AM",
    },
    {
        id: "2",
        text: "Hi! Yeah, I'd love to. Which court do you go to?",
        sender: "me",
        time: "10:05 AM",
    },
    {
        id: "3",
        text: "I usually go to the one on 4th street. It has lights for evening games.",
        sender: "other",
        time: "10:07 AM",
    },
    {
        id: "4",
        text: "Perfect. Does 6 PM work for you provided we can book?",
        sender: "me",
        time: "10:10 AM",
    },
    {
        id: "5",
        text: "6 PM sounds great! I'll call them now.",
        sender: "other",
        time: "10:12 AM",
    },
];

export default function ChatDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputText, setInputText] = useState("");
    const insets = useSafeAreaInsets();

    const handleSend = () => {
        if (inputText.trim()) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    text: inputText,
                    sender: "me",
                    time: "Now",
                },
            ]);
            setInputText("");
        }
    };

    const inputBottomPadding = Math.max(insets.bottom, 8);

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.replace("/chats")} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={28} color={Colors.text} />
                    </TouchableOpacity>

                    <Image
                        source={{ uri: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80" }}
                        style={styles.avatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>Alex Carter</Text>
                        <Text style={styles.headerStatus}>Online</Text>
                    </View>

                    <TouchableOpacity style={styles.headerAction}>
                        <Ionicons name="ellipsis-vertical" size={24} color={Colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Messages List */}
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[
                        styles.messageList,
                        { paddingBottom: styles.messageList.paddingBottom + inputBottomPadding },
                    ]}
                    inverted={false} // Ensure normal order, or true if bottom-up
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.messageBubble,
                                item.sender === "me" ? styles.myMessage : styles.theirMessage,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    item.sender === "me" ? styles.myMessageText : styles.theirMessageText,
                                ]}
                            >
                                {item.text}
                            </Text>
                            <Text
                                style={[
                                    styles.messageTime,
                                    item.sender === "me" ? styles.myMessageTime : styles.theirMessageTime,
                                ]}
                            >
                                {item.time}
                            </Text>
                        </View>
                    )}
                />

                {/* Input Area */}
                <View style={[styles.inputContainer, { paddingBottom: inputBottomPadding }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor={Colors.greyNormal}
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                        <Ionicons name="send" size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
        backgroundColor: Colors.white,
        zIndex: 10,
    },
    backButton: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.text,
    },
    headerStatus: {
        fontSize: 12,
        color: Colors.green,
        fontWeight: "500",
    },
    headerAction: {
        padding: 4,
    },
    messageList: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
        paddingBottom: 40,
    },
    messageBubble: {
        maxWidth: "80%",
        padding: 12,
        borderRadius: 20,
        marginBottom: 12,
    },
    theirMessage: {
        alignSelf: "flex-start",
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 4,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    myMessage: {
        alignSelf: "flex-end",
        backgroundColor: Colors.primary,
        borderBottomRightRadius: 4,
        shadowColor: Colors.primary,
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    theirMessageText: {
        color: Colors.text,
    },
    myMessageText: {
        color: Colors.white,
    },
    messageTime: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: "flex-end",
    },
    theirMessageTime: {
        color: Colors.greyNormal,
    },
    myMessageTime: {
        color: "rgba(255,255,255,0.7)",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        // paddingBottom handled inline
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: Colors.greyLight,
    },
    input: {
        flex: 1,
        height: 44,
        backgroundColor: Colors.greyLight,
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 15,
        color: Colors.text,
        marginRight: 12,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
});

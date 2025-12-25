import { ChatBubble } from "@/components/ChatBubble";
import EmptyChat from "@/components/EmptyChat";
import { Colors } from "@/constants/theme";
import { useSession } from "@/contexts/AuthContext";
import { useMessages } from "@/hooks/useMessages";
import { useSendMessages } from "@/hooks/useSendMessage";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Composer, GiftedChat, IMessage, InputToolbar, Send } from "react-native-gifted-chat";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


export default function ChatDetailScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { user } = useSession();
    const { id: roomId, otherUserId, otherUserName, otherUserAvatar } = useLocalSearchParams();
    const currentUserId = user?.id;
    const insets = useSafeAreaInsets();
    const [keyboardHeight, setKeyboardHeight] = useState(0);


    const tabBarHeight = 50;
    const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 })
    const keyboardVerticalOffset = insets.top + insets.bottom + 50;
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useMessages(roomId as string);

    const { mutate: sendMessage } = useSendMessages(roomId as string, currentUserId as string);

    const formattedMessages = useMemo(() => {
        if (!data) return [];
        return data.pages.flat().map((msg: any): IMessage => ({
            _id: msg.id,
            text: msg.content,
            createdAt: new Date(msg.created_at),
            user: {
                _id: msg.sender_id,
                avatar: msg.sender_id === otherUserId ? (otherUserAvatar as string) : undefined,
            },
        }));
    }, [data, otherUserId, otherUserAvatar]);

    useEffect(() => {
        const channel = supabase
            .channel(`room:${roomId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${roomId}`,
            }, (payload) => {
                // Only update cache for incoming messages (sender is not me)
                if (payload.new.sender_id !== currentUserId) {
                    queryClient.setQueryData(['messages', roomId], (old: any) => {
                        if (!old) return old;
                        return {
                            ...old,
                            pages: [[payload.new, ...old.pages[0]], ...old.pages.slice(1)],
                        };
                    });
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId, currentUserId, queryClient]);

    const markAsRead = async () => {
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('room_id', roomId)
            .neq('sender_id', user?.id)
            .eq('is_read', false);

        if (error) console.error("Error marking read:", error);
    };

    useEffect(() => {
        if (roomId && user?.id) {
            markAsRead();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId, user?.id]);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        if (newMessages.length > 0) {
            sendMessage(newMessages[0].text);
        }
    }, [sendMessage]);

    // useEffect(() => {
    //     const keyboardDidShowListener = Keyboard.addListener(
    //         Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
    //         (e) => {
    //             setKeyboardHeight(e.endCoordinates.height);
    //         }
    //     );
    //     const keyboardDidHideListener = Keyboard.addListener(
    //         Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
    //         () => {
    //             setKeyboardHeight(0);
    //         }
    //     );

    //     return () => {
    //         keyboardDidShowListener.remove();
    //         keyboardDidHideListener.remove();
    //     };
    // }, []);


    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={Colors.text} />
                </TouchableOpacity>

                <Image source={{ uri: otherUserAvatar as string }} style={styles.avatar} />
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{otherUserName}</Text>
                    <Text style={styles.headerStatus}>Online</Text>
                </View>

                <TouchableOpacity style={styles.headerAction}>
                    <Ionicons name="ellipsis-vertical" size={24} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <GiftedChat
                messages={formattedMessages}
                onSend={onSend}
                user={{ _id: currentUserId as string }}
                loadEarlierMessagesProps={{
                    isAvailable: hasNextPage,
                    isLoading: isFetchingNextPage || isLoading,
                    isInfiniteScrollEnabled: true,
                    onPress: () => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    },
                }}
                renderBubble={(props) => <ChatBubble {...props} />}
                renderSend={(props) => (
                    <Send {...props} containerStyle={styles.sendContainer} isSendButtonAlwaysVisible>
                        <View style={styles.sendButton}>
                            <Ionicons name="send" size={20} color={Colors.white} />
                        </View>
                    </Send>
                )}
                renderChatEmpty={() => <EmptyChat otherUserName={otherUserName as string} />}
                renderInputToolbar={(props) => (
                    <InputToolbar {...props}
                        containerStyle={styles.inputToolbar}
                    />
                )}
                renderComposer={(props) => (
                    <Composer
                        {...props}
                        textInputProps={{
                            ...(props.textInputProps ?? {}),
                            style: styles.inputText,
                        }}
                    />
                )}
                messagesContainerStyle={{ backgroundColor: Colors.background }}
            />
            {Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />}
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
    },
    backButton: {
        marginRight: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        backgroundColor: Colors.greyLight,
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
    sendContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    inputToolbar: {
        backgroundColor: Colors.white,
        paddingVertical: 10,
        paddingHorizontal: 16,
        paddingBottom: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    inputText: {
        backgroundColor: Colors.greyLight,
        color: Colors.text,
        borderRadius: 20,
        paddingVertical: 10,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 0,
        marginBottom: 8,
        marginRight: 16,
    },
});
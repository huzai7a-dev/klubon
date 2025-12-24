import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const EmptyChat = ({ otherUserName }: { otherUserName: string }) => (
    <View style={styles.emptyContainer}>
        <Ionicons name="chatbubbles-outline" size={50} color={Colors.greyNeutral} />
        <Text style={styles.emptyText}>
            This is the start of your conversation with {otherUserName}.
        </Text>
        <Text style={styles.emptySubText}>Say hello!</Text>
    </View>
);


const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        paddingBottom: "100%",
        transform: [{ scaleX: -1 },{ scaleY: -1 }],
    },
    emptyText: {
        fontSize: 16,
        fontWeight: "500",
        color: Colors.text,
        marginTop: 10,
    },
    emptySubText: {
        fontSize: 14,
        color: Colors.greyNeutral,
        marginTop: 5,
    },
});

export default EmptyChat;
import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Activity } from "./ActivityChip";

interface SelectedActivityRowProps {
    activity: Activity;
    onUpdatePlayerCount: (id: string, count: number) => void;
}

export default function SelectedActivityRow({
    activity,
    onUpdatePlayerCount,
}: SelectedActivityRowProps) {
    return (
        <View style={styles.playerCountRow}>
            <View style={styles.activityInfo}>
                <Text style={styles.activityNameText}>{activity.name}</Text>
            </View>
            <TextInput
                style={styles.playerInput}
                value={activity.playerCount?.toString() || "1"}
                onChangeText={(text) => {
                    const count = parseInt(text) || 1;
                    onUpdatePlayerCount(activity.id, Math.max(1, Math.min(100, count)));
                }}
                keyboardType="number-pad"
                maxLength={3}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    playerCountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
    },
    activityInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    activityNameText: {
        fontSize: 14,
        fontWeight: "500",
        color: Colors.text,
    },
    playerInput: {
        width: 60,
        height: 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.greyLight,
        backgroundColor: Colors.white,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
        color: Colors.text,
    },
});

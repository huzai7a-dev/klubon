import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export interface Activity {
    id: string;
    name: string;
    playerCount?: number;
}

interface ActivityChipProps {
    activity: Activity;
    isSelected: boolean;
    onToggle: (activity: Activity) => void;
}

export default function ActivityChip({
    activity,
    isSelected,
    onToggle,
}: ActivityChipProps) {
    return (
        <TouchableOpacity
            style={[
                styles.activityChip,
                isSelected && styles.activityChipSelected,
            ]}
            onPress={() => onToggle(activity)}
            activeOpacity={0.7}
        >
            <Text
                style={[
                    styles.activityName,
                    isSelected && styles.activityNameSelected,
                ]}
            >
                {activity.name}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    activityChip: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        backgroundColor: Colors.white,
        flex: 1,
        margin: 4,
    },
    activityChipSelected: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    activityName: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.primary,
        textAlign: "center",
    },
    activityNameSelected: {
        color: Colors.white,
    },
});

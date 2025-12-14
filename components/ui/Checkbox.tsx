import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CheckboxProps {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    error?: string;
}

export default function Checkbox({
    label,
    value,
    onChange,
    error,
}: CheckboxProps) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.checkboxRow,
                    error && styles.checkboxRowError,
                ]}
                onPress={() => onChange(!value)}
                activeOpacity={0.7}
            >
                <View
                    style={[
                        styles.checkbox,
                        value && styles.checkboxChecked,
                    ]}
                >
                    {value && (
                        <Ionicons name="checkmark" size={16} color={Colors.white} />
                    )}
                </View>
                <Text style={styles.label}>{label}</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.greyLight,
        backgroundColor: Colors.white,
    },
    checkboxRowError: {
        borderColor: Colors.red,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.greyNormal,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        backgroundColor: Colors.white,
    },
    checkboxChecked: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    label: {
        fontSize: 15,
        color: Colors.text,
        fontWeight: "500",
        flex: 1,
    },
    error: {
        fontSize: 13,
        color: Colors.red,
        marginTop: 6,
        marginLeft: 4,
    },
});

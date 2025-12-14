import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface RadioOption {
    label: string;
    value: string;
}

interface RadioGroupProps {
    options: RadioOption[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    label?: string;
}

export default function RadioGroup({
    options,
    value,
    onChange,
    error,
    label,
}: RadioGroupProps) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.optionsContainer}>
                {options.map((option) => {
                    const isSelected = value === option.value;
                    return (
                        <TouchableOpacity
                            key={option.value}
                            style={[
                                styles.option,
                                isSelected && styles.optionSelected,
                            ]}
                            onPress={() => onChange(option.value)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.radio,
                                    isSelected && styles.radioSelected,
                                ]}
                            >
                                {isSelected && <View style={styles.radioInner} />}
                            </View>
                            <Text
                                style={[
                                    styles.optionText,
                                    isSelected && styles.optionTextSelected,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: 12,
    },
    optionsContainer: {
        gap: 10,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: Colors.greyLight,
        backgroundColor: Colors.white,
    },
    optionSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: Colors.greyNormal,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    radioSelected: {
        borderColor: Colors.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
    optionText: {
        fontSize: 15,
        color: Colors.text,
        fontWeight: "500",
    },
    optionTextSelected: {
        color: Colors.primary,
        fontWeight: "600",
    },
    error: {
        fontSize: 13,
        color: Colors.red,
        marginTop: 8,
    },
});

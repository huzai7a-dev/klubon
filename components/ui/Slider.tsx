import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    error?: string;
}

export default function Slider({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    unit = "",
    error,
}: SliderProps) {
    const handleDecrement = () => {
        const newValue = Math.max(min, value - step);
        onChange(newValue);
    };

    const handleIncrement = () => {
        const newValue = Math.min(max, value + step);
        onChange(newValue);
    };

    // Calculate progress percentage for visual bar
    const progress = ((value - min) / (max - min)) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.valueBadge}>
                    <Text style={styles.valueText}>
                        {value} {unit}
                    </Text>
                </View>
            </View>

            <View style={styles.sliderContainer}>
                <Text style={styles.minMaxText}>
                    {min} {unit}
                </Text>

                <View style={styles.trackContainer}>
                    <View style={styles.track}>
                        <View
                            style={[styles.trackFill, { width: `${progress}%` }]}
                        />
                    </View>
                </View>

                <Text style={styles.minMaxText}>
                    {max} {unit}
                </Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.button, value <= min && styles.buttonDisabled]}
                    onPress={handleDecrement}
                    disabled={value <= min}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="remove"
                        size={20}
                        color={value <= min ? Colors.greyNormal : Colors.primary}
                    />
                </TouchableOpacity>

                <View style={styles.stepIndicators}>
                    {[...Array(5)].map((_, i) => {
                        const stepValue = min + ((max - min) / 4) * i;
                        const isActive = value >= stepValue;
                        return (
                            <View
                                key={i}
                                style={[
                                    styles.stepDot,
                                    isActive && styles.stepDotActive,
                                ]}
                            />
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[styles.button, value >= max && styles.buttonDisabled]}
                    onPress={handleIncrement}
                    disabled={value >= max}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="add"
                        size={20}
                        color={value >= max ? Colors.greyNormal : Colors.primary}
                    />
                </TouchableOpacity>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.text,
    },
    valueBadge: {
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: Colors.primary,
    },
    valueText: {
        fontSize: 15,
        fontWeight: "700",
        color: Colors.primary,
    },
    sliderContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },
    trackContainer: {
        flex: 1,
    },
    track: {
        height: 6,
        backgroundColor: Colors.greyLight,
        borderRadius: 3,
        overflow: "hidden",
    },
    trackFill: {
        height: "100%",
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },
    minMaxText: {
        fontSize: 12,
        color: Colors.greyDark,
        fontWeight: "600",
        width: 50,
        textAlign: "center",
    },
    controls: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primaryLight,
        borderWidth: 2,
        borderColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonDisabled: {
        backgroundColor: Colors.greyLight,
        borderColor: Colors.greyNormal,
        opacity: 0.5,
    },
    stepIndicators: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.greyLight,
    },
    stepDotActive: {
        backgroundColor: Colors.primary,
    },
    error: {
        fontSize: 13,
        color: Colors.red,
        marginTop: 8,
    },
});

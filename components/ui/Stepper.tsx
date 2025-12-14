import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface StepConfig {
    label: string;
    icon?: string;
}

interface StepperProps {
    steps: StepConfig[];
    currentStep: number;
    style?: any;
    activeColor?: string;
    inactiveColor?: string;
    completedColor?: string;
    showLabels?: boolean;
    compact?: boolean;
}

export default function Stepper({
    steps,
    currentStep,
    style,
    activeColor = Colors.primary,
    inactiveColor = Colors.greyLight,
    completedColor = Colors.green,
    showLabels = true,
    compact = false,
}: StepperProps) {
    const progressWidth = steps.length > 1
        ? ((currentStep) / (steps.length - 1)) * 100
        : 0;

    return (
        <View style={[styles.container, style]}>
            {/* Progress Line Container */}
            <View style={styles.progressContainer}>
                {/* Background Line */}
                <View style={[styles.progressLine, { backgroundColor: inactiveColor }]} />

                {/* Active Progress Line */}
                <View
                    style={[
                        styles.progressLine,
                        styles.progressLineFill,
                        {
                            backgroundColor: activeColor,
                            width: `${progressWidth}%`,
                        },
                    ]}
                />

                {/* Step Indicators */}
                <View style={styles.stepsContainer}>
                    {steps.map((step, index) => {
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;
                        const isFuture = index > currentStep;

                        let dotColor = inactiveColor;
                        if (isCompleted) dotColor = completedColor;
                        if (isActive) dotColor = activeColor;

                        return (
                            <View key={index} style={styles.stepWrapper}>
                                <View
                                    style={[
                                        styles.stepDot,
                                        compact && styles.stepDotCompact,
                                        {
                                            backgroundColor: dotColor,
                                            borderColor: isActive ? activeColor : "transparent",
                                        },
                                    ]}
                                >
                                    {isCompleted && (
                                        <Text style={styles.checkmark}>✓</Text>
                                    )}
                                    {!isCompleted && (
                                        <Text
                                            style={[
                                                styles.stepNumber,
                                                compact && styles.stepNumberCompact,
                                                { color: isActive ? Colors.white : Colors.greyNormal },
                                            ]}
                                        >
                                            {index + 1}
                                        </Text>
                                    )}
                                </View>

                                {showLabels && (
                                    <Text
                                        style={[
                                            styles.stepLabel,
                                            compact && styles.stepLabelCompact,
                                            {
                                                color: isActive
                                                    ? activeColor
                                                    : isFuture
                                                        ? Colors.greyNormal
                                                        : Colors.greyDark,
                                                fontWeight: isActive ? "700" : "500",
                                            },
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {step.label}
                                    </Text>
                                )}
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    progressContainer: {
        position: "relative",
        height: 60,
    },
    progressLine: {
        position: "absolute",
        top: 16,
        left: 24,
        right: 24,
        height: 4,
        borderRadius: 2,
    },
    progressLineFill: {
        zIndex: 1,
    },
    stepsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        position: "relative",
        zIndex: 2,
    },
    stepWrapper: {
        alignItems: "center",
        flex: 1,
    },
    stepDot: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    stepDotCompact: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: "700",
    },
    stepNumberCompact: {
        fontSize: 12,
    },
    checkmark: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.white,
    },
    stepLabel: {
        marginTop: 8,
        fontSize: 12,
        textAlign: "center",
        maxWidth: 80,
    },
    stepLabelCompact: {
        fontSize: 10,
        marginTop: 6,
    },
});

import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownProps {
    label?: string;
    placeholder?: string;
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

export default function Dropdown({
    label,
    placeholder = "Select an option",
    options,
    value,
    onChange,
    error,
    icon,
}: DropdownProps) {
    const [visible, setVisible] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                style={[styles.trigger, error && styles.triggerError]}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.contentRow}>
                    {icon && (
                        <Ionicons
                            name={icon}
                            size={20}
                            color={error ? Colors.red : Colors.greyNormal}
                            style={styles.icon}
                        />
                    )}
                    <Text style={[styles.valueText, !selectedOption && styles.placeholderText]}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={Colors.greyNormal} />
            </TouchableOpacity>

            {error && <Text style={styles.error}>{error}</Text>}

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{label || "Select"}</Text>
                                    <TouchableOpacity onPress={() => setVisible(false)}>
                                        <Ionicons name="close" size={24} color={Colors.greyDark} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView
                                    style={styles.optionsList}
                                    contentContainerStyle={styles.optionsContent}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {options.map((option, index) => {
                                        const isSelected = value === option.value;
                                        return (
                                            <TouchableOpacity
                                                key={option.value}
                                                style={[
                                                    styles.optionItem,
                                                    isSelected && styles.optionItemSelected,
                                                    index === options.length - 1 && styles.lastOptionItem
                                                ]}
                                                onPress={() => {
                                                    onChange(option.value);
                                                    setVisible(false);
                                                }}
                                            >
                                                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                                                    {option.label}
                                                </Text>
                                                {isSelected && (
                                                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        marginTop: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: 8,
    },
    trigger: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.greyLight,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        height: 48, // Match input height roughly
    },
    triggerError: {
        borderColor: Colors.red,
        borderWidth: 1.5,
    },
    contentRow: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    icon: {
        marginRight: 8,
    },
    valueText: {
        fontSize: 16,
        color: Colors.text,
    },
    placeholderText: {
        color: Colors.greyNormal,
    },
    error: {
        fontSize: 13,
        color: Colors.red,
        marginTop: 6,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        padding: 24,
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        maxHeight: "60%",
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: Colors.text,
    },
    optionsList: {
        width: "100%",
    },
    optionsContent: {
        padding: 8,
    },
    optionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
    },
    lastOptionItem: {
        borderBottomWidth: 0,
    },
    optionItemSelected: {
        backgroundColor: Colors.primaryLight,
        borderRadius: 8,
        borderBottomWidth: 0,
    },
    optionLabel: {
        fontSize: 16,
        color: Colors.text,
    },
    optionLabelSelected: {
        color: Colors.primary,
        fontWeight: "600",
    },
});

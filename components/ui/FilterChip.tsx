import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/theme";

interface Props {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export default function FilterChip({
  label,
  isActive = false,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.chip, isActive ? styles.active : styles.inactive]}
    >
      <Text
        style={[
          styles.label,
          isActive ? styles.activeLabel : styles.inactiveLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  inactive: {
    backgroundColor: "#F6F7F8",
    borderColor: "#E6E9EE",
  },
  active: {
    // light primary background using 8-digit hex alpha (approx 13% opacity)
    backgroundColor: Colors.light.tint + "22",
    borderColor: Colors.light.tint,
  },
  inactiveLabel: {
    color: "#374151",
  },
  activeLabel: {
    color: Colors.light.tint,
  },
});

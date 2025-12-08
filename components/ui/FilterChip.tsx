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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
    marginTop: 10,
    borderWidth: 1,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  inactive: {
    backgroundColor: Colors.greyLight,
    borderColor: Colors.greyLight,
  },
  active: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  inactiveLabel: {
    color: Colors.greyDark,
  },
  activeLabel: {
    color: Colors.primary,
  },
});

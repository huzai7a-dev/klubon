import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "../../constants/theme";

interface Props {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  compact?: boolean;
}

export default function PrimaryButton({
  title = "Sign In",
  onPress,
  disabled = false,
  style,
  compact = false,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        compact && styles.btnCompact,
        { backgroundColor: disabled ? Colors.greyLight : Colors.primary },
        style,
      ]}
    >
      <Text style={[styles.title, compact && styles.titleCompact]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  btnCompact: {
    height: 44,
    marginVertical: 0,
    borderRadius: 12,
  },
  title: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
  titleCompact: {
    fontSize: 15,
    fontWeight: "600",
  },
});

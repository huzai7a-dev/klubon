import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors } from "../../constants/theme";

interface Props {
  title?: string;
  onPress?: () => void;
  disabled?: boolean;
}

export default function PrimaryButton({
  title = "Sign In",
  onPress,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        { backgroundColor: disabled ? "#CFCFCF" : Colors.light.tint },
      ]}
    >
      <Text style={styles.title}>{title}</Text>
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
  },
  title: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});

import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Colors } from "../../constants/theme";

interface Props {
  iconName: string;
  onPress?: () => void;
  isPrimary?: boolean;
  style?: ViewStyle;
}

export default function ActionIcon({
  iconName,
  onPress,
  isPrimary = false,
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.default,
        style,
      ]}
    >
      <Ionicons
        name={iconName as any}
        size={20}
        color={isPrimary ? Colors.white : Colors.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 52,
    height: 52,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  default: {
    backgroundColor: Colors.white,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
});

import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Colors } from "../../constants/theme";

interface Props {
  label: string;
  description?: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

export default function SettingToggle({
  label,
  description,
  value,
  onToggle,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#E5E7EB", true: Colors.light.tint }}
        thumbColor={"#FFFFFF"}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
  },
});

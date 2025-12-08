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
        trackColor={{ false: Colors.greyLight, true: Colors.primary }}
        thumbColor={Colors.white}
        ios_backgroundColor={Colors.greyLight}
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
    borderBottomColor: Colors.greyLight,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: Colors.greyDark,
  },
});

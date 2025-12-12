import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { Colors } from "../../constants/theme";

interface Props extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function TextInputField({
  placeholder = "",
  value,
  onChangeText,
  keyboardType = "default",
  icon,
  ...props
}: Props) {
  return (
    <View style={styles.wrap}>
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={Colors.greyNormal}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={Colors.greyNormal}
        style={[styles.input, icon ? { paddingLeft: 8 } : undefined]}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.text,
  },
});

import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function TextInputField({
  placeholder = "",
  value,
  onChangeText,
  keyboardType = "default",
  ...props
}: Props) {
  return (
    <View style={styles.wrap}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#9AA0A6"
        style={styles.input}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#FAFAFB",
    borderWidth: 1,
    borderColor: "#ECEFF1",
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginVertical: 8,
  },
  input: {
    height: 44,
    fontSize: 16,
    color: "#111",
  },
});

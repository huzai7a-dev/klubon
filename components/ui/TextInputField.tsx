import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

interface Props extends TextInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export default function TextInputField({
  placeholder = "",
  value,
  onChangeText,
  keyboardType = "default",
  icon,
  error,
  ...props
}: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.wrap, error && styles.wrapError]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? Colors.red : Colors.greyNormal}
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
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
  },
  wrap: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.greyLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  wrapError: {
    borderColor: Colors.red,
    borderWidth: 1.5,
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
  error: {
    fontSize: 13,
    color: Colors.red,
    marginTop: 6,
    marginLeft: 4,
  },
});

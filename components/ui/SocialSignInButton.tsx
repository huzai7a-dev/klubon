import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Provider = "google" | "facebook" | string;

interface Props {
  provider: Provider;
  onPress?: () => void;
}

const PROVIDER_META: Record<
  string,
  {
    label: string;
    icon: string;
    bg: string;
    textColor: string;
    borderColor?: string;
  }
> = {
  google: {
    label: "Continue with Google",
    icon: "google",
    bg: "#fff",
    textColor: "#111",
    borderColor: "#E6E6E6",
  },
  facebook: {
    label: "Continue with Facebook",
    icon: "facebook",
    bg: "#1877F2",
    textColor: "#fff",
    borderColor: "#1877F2",
  },
};

export default function SocialSignInButton({ provider, onPress }: Props) {
  const meta = PROVIDER_META[provider] || PROVIDER_META.google;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: meta.bg,
          borderColor: meta.borderColor || "#E6E6E6",
          
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          {/* Use FontAwesome for social logos which are not available in MaterialIcons */}
          <FontAwesome
            name={meta.icon as any}
            size={20}
            color={meta.textColor}
          />
        </View>

        <Text style={[styles.label, { color: meta.textColor }]}>
          {meta.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginVertical: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 28,
    alignItems: "center",
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
});

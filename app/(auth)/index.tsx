import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { IconSymbol } from "@/components/ui/IconSymbol";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SocialSignInButton from "@/components/ui/SocialSignInButton";
import TextInputField from "@/components/ui/TextInputField";
import { Colors } from "@/constants/theme";
import { useSession } from "@/contexts/AuthContext";

export default function AuthScreen() {
  const [identifier, setIdentifier] = useState<string>("");
  const { signIn } = useSession();

  const mockLogin = () => {
    signIn();
    router.replace("/discover");
  };

  const isValid = Boolean(identifier && identifier.length > 3);

  // Entrance animations for a livelier UI
  const logoScale = useRef(new Animated.Value(0.94)).current;
  const cardTranslate = useRef(new Animated.Value(22)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(cardTranslate, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [logoScale, cardTranslate, cardOpacity]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Subtle colored background area */}
        <View style={styles.background} pointerEvents="none" />

        {/* Decorative accents */}
        <View style={styles.accentTop} pointerEvents="none" />
        <View style={styles.accentBottom} pointerEvents="none" />

        <Animated.View
          style={[styles.brandWrap, { transform: [{ scale: logoScale }] }]}
        >
          <Animated.View
            style={[styles.logo, { transform: [{ scale: logoScale }] }]}
          >
            <IconSymbol
              name={"house.fill" as any}
              size={40}
              color={Colors.light.tint}
            />
          </Animated.View>
          <Text style={styles.title}>KLUBON</Text>
          <Text style={styles.subtitle}>Get back in — connect & discover</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslate }],
            },
          ]}
        >
          <TextInputField
            placeholder="Email or phone number"
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address"
          />

          <PrimaryButton
            title="Sign In "
            onPress={mockLogin}
            disabled={!isValid}
          />

          <View style={styles.separatorRow}>
            <View style={styles.line} />
            <Text style={styles.orText}> OR</Text>
            <View style={styles.line} />
          </View>

          <SocialSignInButton provider="google" onPress={mockLogin} />
          <SocialSignInButton provider="facebook" onPress={mockLogin} />
        </Animated.View>

        {/* Decorative footer to reduce empty bottom space */}
        <View style={styles.footerWrap}>
          <View style={styles.footerDot} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.light.background },
  container: {
    paddingTop: Platform.OS === "ios" ? 92 : 82,
    paddingHorizontal: 20,
    paddingBottom: 48,
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  brandWrap: {
    alignItems: "center",
    marginBottom: 18,
    marginTop: 6,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0.6,
    color: "#0B1220",
  },
  subtitle: {
    marginTop: 6,
    color: "#54606A",
    fontSize: 13,
  },
  card: {
    width: "100%",
    marginTop: 28,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#fff",
    shadowColor: "#0B1320",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: "rgba(11,19,32,0.04)",
  },
  separatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEF2F6",
  },
  orText: {
    marginHorizontal: 12,
    color: "#9AA0A6",
    fontWeight: "600",
  },
  accentTop: {
    position: "absolute",
    right: -40,
    top: -28,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.light.tint,
    opacity: 0.12,
    transform: [{ rotate: "12deg" }],
  },
  accentBottom: {
    position: "absolute",
    left: -60,
    bottom: -60,
    width: 260,
    height: 260,
    borderRadius: 140,
    backgroundColor: "#F28C28",
    opacity: 0.06,
  },
  footerWrap: {
    width: "100%",
    alignItems: "center",
    marginTop: 18,
    paddingBottom: 18,
  },
  footerDot: {
    width: 110,
    height: 110,
    borderRadius: 22,
    backgroundColor: "#FFF6ED",
    opacity: 0.9,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height * 0.45,
    backgroundColor: "#FFF9F3",
  },
});

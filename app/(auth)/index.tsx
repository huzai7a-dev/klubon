import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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

import PrimaryButton from "@/components/ui/AppButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import SocialSignInButton from "@/components/ui/SocialSignInButton";
import TextInputField from "@/components/ui/TextInputField";
import { Colors } from "@/constants/theme";
import { useSession } from "@/contexts/AuthContext";
import authService from "@/services/auth.service";

enum LoginWith {
  Email = "email",
  Facebook = "facebook",
  Google = "google",
}

export default function AuthScreen() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { signIn } = useSession();

  const handleEmailLogin = async () => {
    setLoading(true);
    setError("");

    const result = await authService.loginWithOtp(email);

    setLoading(false);

    if (result.success) {
      // Navigate to OTP screen with email as param
      router.push({
        pathname: "/(auth)/enter-otp",
        params: { email },
      });
    } else {
      setError(result.error || "Failed to send OTP. Please try again.");
    }
  };

  const mockLogin = (loginWith: LoginWith) => {
    signIn();
    router.replace("/(auth)/enter-otp");
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

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
              color={Colors.primary}
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
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError(""); // Clear error when user types
            }}
            keyboardType="email-address"
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <PrimaryButton
            title={loading ? "Sending..." : "Sign In"}
            onPress={handleEmailLogin}
            disabled={!isValid || loading}
          />

          {loading && (
            <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
          )}

          <View style={styles.separatorRow}>
            <View style={styles.line} />
            <Text style={styles.orText}> OR</Text>
            <View style={styles.line} />
          </View>

          <SocialSignInButton provider="google" onPress={() => mockLogin(LoginWith.Google)} />
          <SocialSignInButton provider="facebook" onPress={() => mockLogin(LoginWith.Facebook)} />
        </Animated.View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.background },
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
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0.6,
    color: Colors.text,
  },
  subtitle: {
    marginTop: 6,
    color: Colors.greyDark,
    fontSize: 13,
  },
  card: {
    width: "100%",
    marginTop: 28,
    padding: 20,
    borderRadius: 18,
    backgroundColor: Colors.white,
    shadowColor: Colors.text,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 4,
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
    backgroundColor: Colors.greyLight,
  },
  orText: {
    marginHorizontal: 12,
    color: Colors.greyNormal,
    fontWeight: "600",
  },
  errorText: {
    color: Colors.red,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  loader: {
    marginTop: 8,
  },
  accentTop: {
    position: "absolute",
    right: -40,
    top: -28,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    opacity: 0.06,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get("window").height * 0.45,
    backgroundColor: Colors.primaryLight,
  },
});

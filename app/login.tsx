import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import PrimaryButton from "../components/ui/PrimaryButton";
import SocialSignInButton from "../components/ui/SocialSignInButton";
import TextInputField from "../components/ui/TextInputField";
import { Colors } from "../constants/theme";

export default function AuthScreen() {
  const [identifier, setIdentifier] = useState("");

  const handleGoogle = () => console.log("Google sign-in pressed");
  const handleFacebook = () => console.log("Facebook sign-in pressed");
  const handlePrimary = () =>
    console.log("Primary sign-in pressed with:", identifier);
  const handleGuidelines = () => console.log("Community Guidelines pressed");
  const handlePrivacy = () => console.log("Privacy Policy pressed");

  const isValid = identifier && identifier.length > 3;

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandWrap}>
          <View style={styles.logo}>
            <MaterialIcons name="house" size={38} color={Colors.light.tint} />
          </View>
          <Text style={styles.title}>KLUBON</Text>
          <Text style={styles.subtitle}>
            Welcome back — sign in to continue
          </Text>
        </View>

        <View style={styles.card}>
          <SocialSignInButton provider="google" onPress={handleGoogle} />
          <SocialSignInButton provider="facebook" onPress={handleFacebook} />

          <View style={styles.separatorRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>— OR —</Text>
            <View style={styles.line} />
          </View>

          <TextInputField
            placeholder="Email or phone number"
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType="email-address"
          />

          <PrimaryButton
            title="Sign In / Continue"
            onPress={handlePrimary}
            disabled={!isValid}
          />

          <Text style={styles.otpText}>
            We'll send you a one-time code to verify your details.
          </Text>

          <Text style={styles.legalText}>
            By signing in, you agree to our{" "}
            <Text>
              <Pressable onPress={handleGuidelines}>
                <Text style={styles.linkText}>Community Guidelines</Text>
              </Pressable>
            </Text>{" "}
            &amp;{" "}
            <Text>
              <Pressable onPress={handlePrivacy}>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </Pressable>
            </Text>
            .
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.light.background },
  container: {
    paddingTop: 48,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  brandWrap: {
    alignItems: "center",
    marginBottom: 18,
  },
  logo: {
    width: 78,
    height: 78,
    borderRadius: 20,
    backgroundColor: "#FFF6ED",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#111",
  },
  subtitle: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 14,
  },

  card: {
    width: "100%",
    marginTop: 18,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
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

  otpText: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },
  legalText: {
    marginTop: 12,
    color: "#8A8F95",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  linkText: {
    color: Colors.light.tint,
    fontWeight: "700",
  },
});

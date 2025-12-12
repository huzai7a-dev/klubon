import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryButton from "@/components/ui/PrimaryButton";
import TextInputField from "@/components/ui/TextInputField";
import { Colors } from "@/constants/theme";
import { useSession } from "@/contexts/AuthContext";

export default function SetupProfileScreen() {
    const router = useRouter();
    const { setProfileCompleted } = useSession();

    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");

    const isValid = name.length > 2 && age.length > 0 && location.length > 2;

    const handleComplete = () => {
        setProfileCompleted(true);
        router.replace("/discover");
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.flex}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Profile</Text>
                        <Text style={styles.subtitle}>
                            Tell us a bit about yourself to get started.
                        </Text>
                    </View>

                    {/* Photo Placeholder */}
                    <TouchableOpacity style={styles.photoContainer}>
                        <View style={styles.photoPlaceholder}>
                            <Ionicons name="camera" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.photoText}>Add Photo</Text>
                    </TouchableOpacity>

                    {/* Form */}
                    <View style={styles.form}>
                        <TextInputField
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            icon="person"
                        />
                        <TextInputField
                            placeholder="Age"
                            value={age}
                            onChangeText={setAge}
                            keyboardType="number-pad"
                            icon="calendar"
                        />
                        <TextInputField
                            placeholder="Location (City, Country)"
                            value={location}
                            onChangeText={setLocation}
                            icon="location"
                        />
                        <TextInputField
                            placeholder="Bio (Optional)"
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={3}
                            icon="document-text"
                        />
                    </View>

                    <View style={styles.spacer} />

                    <PrimaryButton
                        title="Complete Setup"
                        onPress={handleComplete}
                        disabled={!isValid}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },
    header: {
        marginBottom: 32,
        marginTop: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.greyDark,
        lineHeight: 22,
    },
    photoContainer: {
        alignItems: "center",
        marginBottom: 32,
    },
    photoPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: "dashed",
    },
    photoText: {
        color: Colors.primary,
        fontWeight: "600",
        fontSize: 14,
    },
    form: {
        gap: 16,
    },
    spacer: {
        flex: 1,
        minHeight: 24,
    },
});

import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PhotoUploadProps {
    value?: string;
    onChange: (uri: string) => void;
    error?: string;
}

export default function PhotoUpload({
    value,
    onChange,
    error,
}: PhotoUploadProps) {
    const handlePress = async () => {
        try {
            // Request permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== "granted") {
                Alert.alert(
                    "Permission required",
                    "Sorry, we need camera roll permissions to make this work!"
                );
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                onChange(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to pick image");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.uploadButton,
                    error && styles.uploadButtonError,
                ]}
                onPress={handlePress}
                activeOpacity={0.8}
            >
                {value ? (
                    <>
                        <Image source={{ uri: value }} style={styles.image} />
                        <View style={styles.editBadge}>
                            <Ionicons name="pencil" size={16} color={Colors.white} />
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.iconContainer}>
                            <Ionicons name="camera" size={40} color={Colors.primary} />
                        </View>
                        <Text style={styles.uploadText}>Add Photo</Text>
                        <Text style={styles.uploadHint}>Tap to upload</Text>
                    </>
                )}
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 24,
    },
    uploadButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: Colors.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: "dashed",
        position: "relative",
    },
    uploadButtonError: {
        borderColor: Colors.red,
    },
    iconContainer: {
        marginBottom: 8,
    },
    uploadText: {
        fontSize: 14,
        fontWeight: "600",
        color: Colors.primary,
        marginTop: 4,
    },
    uploadHint: {
        fontSize: 11,
        color: Colors.greyDark,
        marginTop: 2,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 60,
    },
    editBadge: {
        position: "absolute",
        bottom: 5,
        right: 5,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: Colors.white,
    },
    error: {
        fontSize: 13,
        color: Colors.red,
        marginTop: 12,
        textAlign: "center",
    },
});

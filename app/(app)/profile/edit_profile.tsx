import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Activity } from "@/components/ui/ActivityChip";
import FilterChip from "@/components/ui/FilterChip";
import { Colors } from "@/constants/theme";
import { useSession } from "@/contexts/AuthContext";
import activitiesService from "@/services/activities.service";
import profileService from "@/services/profile.service";

export default function EditProfileScreen() {
    const { profile, updateUserProfile, updateUserActivities } = useSession();

    // Local state for form fields
    const [name, setName] = useState(profile?.name || "");
    const [bio, setBio] = useState(profile?.short_bio || "");
    const [playTimes, setPlayTimes] = useState(profile?.typical_play_times || "");
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [avatarUri, setAvatarUri] = useState(profile?.avatar_url || "");
    const [isSaving, setIsSaving] = useState(false);

    // Modal state for adding activities
    const [isActivityModalVisible, setIsActivityModalVisible] = useState(false);
    const [allActivities, setAllActivities] = useState<Activity[]>([]);

    useEffect(() => {
        // Initialize state from profile
        if (profile) {
            setName(profile.name);
            setBio(profile.short_bio || "");
            setPlayTimes(profile.typical_play_times || "");
            setAvatarUri(profile.avatar_url || "");

            const currentActivityIds = profile.user_activities?.map(ua => ua.activity_id) || [];
            setSelectedActivities(currentActivityIds);
        }

        // Fetch all activities for the modal
        loadAllActivities();
    }, [profile]);

    const loadAllActivities = async () => {
        const activities = await activitiesService.getAllActivities({ page: 1, limit: 100 });
        if (activities) {
            setAllActivities(activities);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setAvatarUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!profile?.id) return;
        setIsSaving(true);
        try {
            let finalAvatarUrl = profile.avatar_url;

            // 1. Upload new avatar if changed (file uri starts with file:// or content:// usually)
            if (avatarUri && avatarUri !== profile.avatar_url && !avatarUri.startsWith("http")) {
                const uploadedUrl = await profileService.uploadAvatar(profile.id, avatarUri);
                if (uploadedUrl) {
                    finalAvatarUrl = uploadedUrl;
                }
            }

            // 2. Update basic profile info
            await updateUserProfile({
                name,
                short_bio: bio,
                typical_play_times: playTimes,
                avatar_url: finalAvatarUrl || undefined,
            });

            // 3. Update activities
            await updateUserActivities(selectedActivities);

            // router.back();
            router.replace("/(app)/profile");
        } catch (error) {
            Alert.alert("Error", "Failed to update profile");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleActivitySelection = (activityId: string) => {
        setSelectedActivities(prev => {
            if (prev.includes(activityId)) {
                return prev.filter(id => id !== activityId);
            } else {
                return [...prev, activityId];
            }
        });
    };

    const removeActivity = (activityId: string) => {
        setSelectedActivities(prev => prev.filter(id => id !== activityId));
    };

    // Helper to get activity name from ID (from profile or allActivities)
    const getActivityName = (id: string) => {
        const fromProfile = profile?.user_activities?.find(ua => ua.activity_id === id)?.activities?.name;
        if (fromProfile) return fromProfile;

        const fromAll = allActivities.find(a => a.id === id)?.name;
        return fromAll || "Unknown Activity";
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.replace("/(app)/profile")} style={styles.headerButton}>
                    <Text style={styles.headerButtonText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} style={styles.headerButton} disabled={isSaving}>
                    {isSaving ? (
                        <ActivityIndicator size="small" color={Colors.primary} />
                    ) : (
                        <Text style={[styles.headerButtonText, styles.saveText]}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
                        <Image
                            source={avatarUri ? { uri: avatarUri } : { uri: "https://via.placeholder.com/150" }}
                            style={styles.avatar}
                        />
                        <View style={styles.editIconBadge}>
                            <Ionicons name="camera" size={16} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                </View>

                {/* Name Field */}
                <View style={styles.section}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your name"
                    />
                </View>

                {/* Bio Field */}
                <View style={styles.section}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself..."
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Play Times Field */}
                <View style={styles.section}>
                    <Text style={styles.label}>Typical Play Times</Text>
                    <TextInput
                        style={styles.input}
                        value={playTimes}
                        onChangeText={setPlayTimes}
                        placeholder="e.g. Weekends, Evenings"
                    />
                </View>

                {/* Activities Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.label}>My Activities</Text>
                        <TouchableOpacity onPress={() => setIsActivityModalVisible(true)}>
                            <Text style={styles.addButtonText}>+ Add</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.chipContainer}>
                        {selectedActivities.map(id => (
                            <FilterChip
                                key={id}
                                label={getActivityName(id)}
                                isActive={true}
                                onPress={() => removeActivity(id)}
                            />
                        ))}
                        {selectedActivities.length === 0 && (
                            <Text style={styles.placeholderText}>No activities selected</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Add Activity Modal */}
            <Modal
                visible={isActivityModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Select Activities</Text>
                        <TouchableOpacity onPress={() => setIsActivityModalVisible(false)}>
                            <Text style={styles.doneText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <View style={styles.chipContainer}>
                            {allActivities.map(activity => (
                                <FilterChip
                                    key={activity.id}
                                    label={activity.name}
                                    isActive={selectedActivities.includes(activity.id)}
                                    onPress={() => toggleActivitySelection(activity.id)}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
    },
    headerButton: {
        padding: 8,
    },
    headerButtonText: {
        fontSize: 16,
        color: Colors.greyDark,
    },
    saveText: {
        color: Colors.primary,
        fontWeight: "600",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.text,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.text,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.greyLight,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: Colors.text,
    },
    textArea: {
        minHeight: 100,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editIconBadge: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary,
        padding: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.white,
    },
    changePhotoText: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    addButtonText: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: "600",
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    placeholderText: {
        color: Colors.greyDark,
        fontStyle: 'italic',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    doneText: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.primary,
    },
    modalContent: {
        padding: 16,
    },
});

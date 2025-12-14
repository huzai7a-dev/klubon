import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import profileService from "@/services/profile.service";

import ActivitySelectionStep from "@/components/profile/ActivitySelectionStep";
import PersonalInfoStep from "@/components/profile/PersonalInfoStep";
import PreferencesStep from "@/components/profile/PreferencesStep";
import AppButton from "@/components/ui/AppButton";
import Stepper, { StepConfig } from "@/components/ui/Stepper";
import { Colors } from "@/constants/theme";
import { useSession } from "@/contexts/AuthContext";
import {
  activitySelectionSchema,
  CombinedProfileData,
  combinedProfileSchema,
  personalInfoSchema,
  preferencesSchema,
} from "@/schemas/profileSchema";

// Define the steps for profile creation
const PROFILE_STEPS: StepConfig[] = [
  { label: "Personal Info" },
  { label: "Activities" },
  { label: "Preferences" },
];

export default function SetupProfileScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateProfileState } = useSession();

  const methods = useForm<CombinedProfileData>({
    resolver: zodResolver(combinedProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      user_gender: undefined,
      short_bio: "",
      city: "",
      distance_radius_km: 50,
      avatar_uri: "",
      activities: [],
      prefers_male: false,
      prefers_female: false,
      prefers_other: false,
    },
  });

  const { trigger, watch } = methods;
  watch();

  const isCurrentStepValid = () => {
    const data = methods.getValues();
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = personalInfoSchema.safeParse(data).success;
        break;
      case 1:
        isValid = activitySelectionSchema.safeParse({
          activities: data.activities,
        }).success;
        break;
      case 2:
        // Construct the object expected by preferencesSchema
        const prefData = {
          prefers_male: data.prefers_male,
          prefers_female: data.prefers_female,
          prefers_other: data.prefers_other,
        };
        isValid = preferencesSchema.safeParse(prefData).success;
        break;
      default:
        isValid = false;
    }
    return isValid;
  };

  const handleNext = async () => {
    let isStepValid = false;

    if (currentStep === 0) {
      isStepValid = await trigger([
        "name",
        "user_gender",
        "city",
        "distance_radius_km",
        "avatar_uri",
        "short_bio",
      ]);
    } else if (currentStep === 1) {
      isStepValid = await trigger("activities");
    } else if (currentStep === 2) {
      isStepValid = await trigger([
        "prefers_male",
        "prefers_female",
        "prefers_other",
      ]);
      if (isStepValid) {
        const data = methods.getValues();
        const prefData = {
          prefers_male: data.prefers_male,
          prefers_female: data.prefers_female,
          prefers_other: data.prefers_other,
        };
        isStepValid = preferencesSchema.safeParse(prefData).success;
      }
    }

    if (isStepValid) {
      if (currentStep < PROFILE_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert("Error", "No user session found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const flatData = methods.getValues();

      const profile = await profileService.createProfile(user.id, flatData);

      if (profile) {

        updateProfileState(profile);

        Alert.alert(
          "Success",
          "Profile created successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/discover");
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert("Error", "Failed to create profile. Please try again.");
      }
    } catch (error) {
      console.error("Profile creation error:", error);
      Alert.alert("Error", "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <ActivitySelectionStep />;
      case 2:
        return <PreferencesStep />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <FormProvider {...methods}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          {/* Stepper */}
          <Stepper
            steps={PROFILE_STEPS}
            currentStep={currentStep}
            style={styles.stepper}
          />

          {/* Step Content */}
          <View style={styles.contentContainer}>{renderStepContent()}</View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={Colors.primary}
                />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            <AppButton
              title={
                isSubmitting
                  ? "Creating..."
                  : currentStep === PROFILE_STEPS.length - 1
                    ? "Complete"
                    : "Next"
              }
              onPress={handleNext}
              disabled={!isCurrentStepValid() || isSubmitting}
              style={styles.nextButton}
              loading={isSubmitting}
            />
          </View>
        </KeyboardAvoidingView>
      </FormProvider>
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
  stepper: {
    paddingHorizontal: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },
  contentContainer: {
    flex: 1,
  },
  navigationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 12,
    gap: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.greyLight,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 6,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  nextButton: {
    flex: 1,
    marginVertical: 8,
  },
});

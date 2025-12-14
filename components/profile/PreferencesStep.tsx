import Checkbox from "@/components/ui/Checkbox";
import { Colors } from "@/constants/theme";
import { CombinedProfileData } from "@/schemas/profileSchema";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Slider from "../ui/Slider";

export default function PreferencesStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CombinedProfileData>();

  const hasError = errors.prefers_male?.message;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Gender Preferences</Text>
        <Text style={styles.subtitle}>
          Select the gender(s) you'd like to connect with. You can choose
          multiple options.
        </Text>
      </View>

      <View style={styles.preferencesContainer}>
        <Text style={styles.label}>I prefer to connect with:</Text>

        <View style={styles.checkboxes}>
          <Controller
            control={control}
            name="prefers_male"
            render={({ field: { onChange, value } }) => (
              <Checkbox
                label="Male"
                value={value}
                onChange={onChange}
                error={hasError}
              />
            )}
          />

          <Controller
            control={control}
            name="prefers_female"
            render={({ field: { onChange, value } }) => (
              <Checkbox label="Female" value={value} onChange={onChange} />
            )}
          />

          <Controller
            control={control}
            name="prefers_other"
            render={({ field: { onChange, value } }) => (
              <Checkbox label="Other" value={value} onChange={onChange} />
            )}
          />
          <Controller
            control={control}
            name="distance_radius_km"
            render={({ field: { onChange, value } }) => (
              <Slider
                label="Distance Radius"
                value={value}
                onChange={onChange}
                min={5}
                max={200}
                step={5}
                unit="km"
                error={errors.distance_radius_km?.message}
              />
            )}
          />
        </View>

        {hasError && <Text style={styles.error}>{hasError}</Text>}
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 These preferences help us show you relevant connections based on
          your interests
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.greyDark,
    lineHeight: 20,
  },
  preferencesContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  checkboxes: {
    gap: 12,
  },
  error: {
    fontSize: 14,
    color: Colors.red,
    marginTop: 12,
    fontWeight: "500",
  },
  infoBox: {
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: 16,
  },
  infoText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 18,
  },
});

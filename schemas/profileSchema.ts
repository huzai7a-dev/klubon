import { z } from "zod";

// Step 1: Personal Info Schema
export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  user_gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
  short_bio: z
    .string()
    .max(150, "Bio must not exceed 150 characters")
    .optional()
    .or(z.literal("")),
  city: z.string().min(2, "City must be at least 2 characters"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  distance_radius_km: z
    .number()
    .min(5, "Distance must be at least 5 km")
    .max(200, "Distance must not exceed 200 km"),
  avatar_uri: z.string().min(1, "Profile image is required"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// Step 2: Activity Selection Schema
export const activitySelectionSchema = z.object({
  activities: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        playerCount: z
          .number()
          .min(1, "Player count must be at least 1")
          .max(100, "Player count must not exceed 100"),
      })
    )
    .min(1, "Please select at least one activity"),
});

export type ActivitySelectionFormData = z.infer<typeof activitySelectionSchema>;

// Step 3: Preferences Schema
export const preferencesSchema = z
  .object({
    prefers_male: z.boolean(),
    prefers_female: z.boolean(),
    prefers_other: z.boolean(),
  })
  .refine(
    (data) => data.prefers_male || data.prefers_female || data.prefers_other,
    {
      message: "Please select at least one gender preference",
      path: ["prefers_male"], // This will show the error on the first checkbox
    }
  );

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

export const combinedProfileSchema = z.object({
  ...personalInfoSchema.shape,
  ...activitySelectionSchema.shape,
  ...preferencesSchema.shape,
});

export type CombinedProfileData = z.infer<typeof combinedProfileSchema>;

// Keep the nested one if needed for API payload structure later
export interface ProfileData {
  personalInfo: PersonalInfoFormData;
  activities: ActivitySelectionFormData;
  preferences: PreferencesFormData;
}

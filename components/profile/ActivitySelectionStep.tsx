import ActivitySelector from "@/components/profile/ActivitySelector";
import { Activity } from "@/components/ui/ActivityChip";
import SelectedActivityRow from "@/components/ui/SelectedActivityRow";
import { Colors } from "@/constants/theme";
import { CombinedProfileData } from "@/schemas/profileSchema";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivitySelectionStep() {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const {
    control,
    formState: { errors },
  } = useFormContext<CombinedProfileData>();

  const toggleActivity = (
    activity: Activity,
    currentSelected: Activity[],
    onChange: (val: Activity[]) => void
  ) => {
    const exists = currentSelected.some((a) => a.id === activity.id);

    if (exists) {
      onChange(currentSelected.filter((a) => a.id !== activity.id));
    } else {
      onChange([...currentSelected, { ...activity, playerCount: 1 }]);
    }
  };

  const updatePlayerCount = (
    activityId: string,
    count: number,
    currentSelected: Activity[],
    onChange: (val: Activity[]) => void
  ) => {
    onChange(
      currentSelected.map((a) =>
        a.id === activityId ? { ...a, playerCount: count } : a
      )
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <Text style={styles.title}>Select Activities</Text>
        <Text style={styles.subtitle}>
          Choose the activities you enjoy and how many players you prefer
        </Text>

        <Text style={styles.sectionTitle}>Available Activities</Text>

        {errors.activities && (
          <Text style={styles.error}>{errors.activities.message}</Text>
        )}
      </View>

      <Controller
        control={control}
        name="activities"
        render={({ field: { onChange, value } }) => (
          <>
            <ActivitySelector
              selectedActivityIds={value.map((a) => a.id)}
              onToggle={(activity) => toggleActivity(activity, value, onChange)}
            />

            {/* FLOATING BAR */}
            {value.length > 0 && (
              <View style={styles.floatingBar}>
                <Text style={styles.barText}>
                  {value.length} Activit
                  {value.length === 1 ? "y" : "ies"} Selected
                </Text>

                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => setIsReviewOpen(true)}
                >
                  <Text style={styles.reviewButtonText}>Review</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* REVIEW MODAL */}
            <Modal
              visible={isReviewOpen}
              animationType="slide"
              presentationStyle="pageSheet"
              onRequestClose={() => setIsReviewOpen(false)}
            >
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Review Selection</Text>
                  <TouchableOpacity onPress={() => setIsReviewOpen(false)}>
                    <Text style={styles.closeButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={value}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.modalContent}
                  renderItem={({ item }) => (
                    <SelectedActivityRow
                      activity={item}
                      onUpdatePlayerCount={(id, count) =>
                        updatePlayerCount(id, count, value, onChange)
                      }
                    />
                  )}
                />
              </SafeAreaView>
            </Modal>
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerWrapper: {
    padding: 24,
    paddingBottom: 0,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.greyDark,
    marginVertical: 8,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },

  error: {
    color: Colors.red,
    marginTop: 8,
  },

  floatingBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.text,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  barText: {
    color: Colors.white,
    fontWeight: "600",
  },

  reviewButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  reviewButtonText: {
    color: Colors.white,
    fontWeight: "700",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  closeButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },

  modalContent: {
    padding: 16,
  },
});

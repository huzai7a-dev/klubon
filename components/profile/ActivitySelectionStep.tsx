import ActivityChip, { Activity } from "@/components/ui/ActivityChip";
import SelectedActivityRow from "@/components/ui/SelectedActivityRow";
import { Colors } from "@/constants/theme";
import {
    CombinedProfileData,
} from "@/schemas/profileSchema";
import activitiesService from "@/services/activities.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";

const PAGE_SIZE = 20;

export default function ActivitySelectionStep() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounce(searchQuery, 500);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["activities", debouncedSearch],
        queryFn: ({ pageParam = 1 }) =>
            activitiesService.getAllActivities({
                search: debouncedSearch,
                page: pageParam,
                limit: PAGE_SIZE,
            }),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage && lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined;
        },
        initialPageParam: 1,
    });

    const activities = data?.pages.flatMap((page) => page || []) || [];

    const {
        control,
        formState: { errors },
    } = useFormContext<CombinedProfileData>();

    const toggleActivity = (
        activity: Activity,
        currentSelected: Activity[],
        onChange: (val: Activity[]) => void
    ) => {
        const isSelected = currentSelected.some((a) => a.id === activity.id);
        if (isSelected) {
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

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <Text style={styles.title}>Select Activities</Text>
                <Text style={styles.subtitle}>
                    Choose the activities you enjoy and how many players you prefer
                </Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={Colors.greyDark}
                />
            </View>

            <Text style={styles.sectionTitle}>Available Activities</Text>
            {errors.activities && (
                <Text style={styles.error}>{errors.activities.message}</Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Controller
                control={control}
                name="activities"
                render={({ field: { onChange, value } }) => (
                    <>
                        <FlatList
                            data={activities}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            contentContainerStyle={[
                                styles.content,
                                value.length > 0 && styles.contentWithFooter,
                            ]}
                            columnWrapperStyle={styles.columnWrapper}
                            ListHeaderComponent={renderHeader}
                            renderItem={({ item }) => (
                                <ActivityChip
                                    activity={item}
                                    isSelected={value.some((a) => a.id === item.id)}
                                    onToggle={(activity) =>
                                        toggleActivity(activity, value, onChange)
                                    }
                                />
                            )}
                            onEndReached={() => {
                                if (hasNextPage) fetchNextPage();
                            }}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                (isFetchingNextPage || isLoading) ? (
                                    <ActivityIndicator
                                        style={styles.loader}
                                        color={Colors.primary}
                                    />
                                ) : null
                            }
                        />

                        {/* Floating Summary Bar */}
                        {value.length > 0 && (
                            <View style={styles.floatingBar}>
                                <View style={styles.barContent}>
                                    <Text style={styles.barText}>
                                        {value.length} Activit{value.length === 1 ? 'y' : 'ies'} Selected
                                    </Text>
                                    <TouchableOpacity
                                        style={styles.reviewButton}
                                        onPress={() => setIsReviewOpen(true)}
                                    >
                                        <Text style={styles.reviewButtonText}>Review</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Review Modal */}
                        <Modal
                            visible={isReviewOpen}
                            animationType="slide"
                            presentationStyle="pageSheet"
                            onRequestClose={() => setIsReviewOpen(false)}
                        >
                            <SafeAreaView style={styles.modalContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Review Selection</Text>
                                    <TouchableOpacity
                                        onPress={() => setIsReviewOpen(false)}
                                        style={styles.closeButton}
                                    >
                                        <Text style={styles.closeButtonText}>Done</Text>
                                    </TouchableOpacity>
                                </View>

                                <FlatList
                                    data={value}
                                    keyExtractor={item => item.id}
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
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    contentWithFooter: {
        paddingBottom: 100, // Make room for floating bar
    },
    header: {
        marginBottom: 24,
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: Colors.text,
        marginBottom: 12,
        marginTop: 8,
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        height: 48,
        borderWidth: 1,
        borderColor: Colors.greyLight,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text,
        backgroundColor: Colors.white,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    loader: {
        paddingVertical: 20,
    },
    error: {
        fontSize: 13,
        color: Colors.red,
        marginBottom: 12,
    },
    // Floating Bar Styles
    floatingBar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: Colors.text, // Dark background
        borderRadius: 16,
        padding: 16,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    barContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    barText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    reviewButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    reviewButtonText: {
        color: Colors.white,
        fontWeight: '700',
        fontSize: 14,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.greyLight,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    modalContent: {
        padding: 16,
    },
});

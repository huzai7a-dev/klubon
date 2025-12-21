import ActivityChip, { Activity } from "@/components/ui/ActivityChip";
import { PAGE_SIZE } from "@/constants";
import { Colors } from "@/constants/theme";
import activitiesService from "@/services/activities.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { useDebounce } from "use-debounce";

interface ActivitySelectorProps {
    selectedActivityIds: string[];
    onToggle: (activity: Activity) => void;
}

export default function ActivitySelector({
    selectedActivityIds,
    onToggle,
}: ActivitySelectorProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounce(searchQuery, 500);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        useInfiniteQuery({
            queryKey: ["activities", debouncedSearch],
            queryFn: ({ pageParam = 1 }) =>
                activitiesService.getAllActivities({
                    search: debouncedSearch,
                    page: pageParam,
                    limit: PAGE_SIZE,
                }),
            getNextPageParam: (lastPage, allPages) =>
                lastPage?.length === PAGE_SIZE ? allPages.length + 1 : undefined,
            initialPageParam: 1,
        });

    const activities = data?.pages.flatMap((page) => page ?? []) ?? [];

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor={Colors.greyDark}
                />
            </View>

            <FlatList
                data={activities}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.content}
                renderItem={({ item }) => (
                    <ActivityChip
                        activity={item}
                        isSelected={selectedActivityIds.includes(item.id)}
                        onToggle={onToggle}
                    />
                )}
                onEndReached={() => hasNextPage && fetchNextPage()}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    isFetchingNextPage || isLoading ? (
                        <ActivityIndicator style={styles.loader} color={Colors.primary} />
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
        backgroundColor: Colors.white,
    },
    content: {
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    loader: {
        paddingVertical: 20,
    },
});

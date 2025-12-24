import ProfileCard from "@/components/ProfileCard";
import RoundAvatar from "@/components/ui/RoundAvatar";
import { PAGE_SIZE } from "@/constants";
import { Colors } from "@/constants/theme";
import { useSession } from "@/contexts/AuthContext";
import profileService from "@/services/profile.service";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Image, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


// const FILTERS = [
//   "Basketball",
//   "Casual",
//   "5km radius",
//   "Female",
//   "Table Tennis",
// ];

export default function DiscoverScreen() {
  const { profile } = useSession()
  const router = useRouter()
  // const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { data: profiles, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["profiles"],
      queryFn: ({ pageParam = 1 }) =>
        profileService.getDiscoveredProfiles({}, pageParam, PAGE_SIZE,),
      getNextPageParam: (lastPage, allPages) =>
        lastPage?.length === PAGE_SIZE ? allPages.length + 1 : undefined,
      initialPageParam: 1,
    });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo-black.png")}
          style={styles.logo}
        />
        <View style={styles.headerRight}>
          {/* <Ionicons name="options-outline" size={22} color={Colors.text} /> */}
          <RoundAvatar url={profile?.avatar_url} onPress={() => router.push("/profile")} />
        </View>
      </View>

      {/* <View style={styles.filterBarWrap}>
        <FlatList
          data={FILTERS}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <FilterChip
              label={item}
              isActive={activeFilter === item}
              onPress={() => {
                console.log("Filter chip pressed: " + item);
                setActiveFilter((prev) => (prev === item ? null : item));
              }}
            />
          )}
        />
      </View> */}

      <FlatList
        data={profiles?.pages.flatMap((page) => page ?? []) ?? []}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ProfileCard user={item} />}
        showsVerticalScrollIndicator={false}
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage || isLoading ? (
            <ActivityIndicator style={styles.loader} color={Colors.primary} />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "ios" ? 48 : 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.text,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  filterBarWrap: {
    height: 56,
    marginBottom: 12,
  },
  filterRow: {
    alignItems: "center",
    paddingLeft: 2,
    paddingRight: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  list: {
    paddingBottom: 130,
  },
  logo: {
    width: 40,
    height: 40,
  },
  loader: {
    paddingVertical: 20,
  },
});

import FilterChip from "@/components/ui/FilterChip";
import ProfileCard from "@/components/ui/ProfileCard";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const MOCK_USERS = [
  {
    id: "1",
    name: "Alex Carter",
    distance: "3.1 km",
    activities: ["Basketball", "Casual", "Running"],
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "2",
    name: "Maya Gonzales",
    distance: "1.8 km",
    activities: ["Table Tennis", "Casual"],
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "3",
    name: "Jordan Lee",
    distance: "5.0 km",
    activities: ["Basketball", "Competitve"],
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "4",
    name: "Sofia Rivera",
    distance: "0.9 km",
    activities: ["Casual", "Yoga"],
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
  },
  {
    id: "5",
    name: "Liam Brown",
    distance: "12 km",
    activities: ["Cycling", "Running"],
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
  },
];

const FILTERS = [
  "Basketball",
  "Casual",
  "5km radius",
  "Female",
  "Table Tennis",
];

export default function DiscoverScreen() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeFilter) return MOCK_USERS;
    // simple mock filtering based on activities or distance/gender keywords
    return MOCK_USERS.filter(
      (u) =>
        u.activities.some((a) =>
          a.toLowerCase().includes(activeFilter.toLowerCase())
        ) ||
        u.distance.includes(activeFilter) ||
        activeFilter === "Female" // mock gender
    );
  }, [activeFilter]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KLUBON</Text>
        <Ionicons name="options-outline" size={22} color="#0B1220" />
      </View>

      <View style={styles.filterBarWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => (
            <FilterChip
              key={f}
              label={f}
              isActive={activeFilter === f}
              onPress={() => {
                console.log("Filter chip pressed: " + f);
                setActiveFilter((prev) => (prev === f ? null : f));
              }}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <ProfileCard user={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F9FB",
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "ios" ? 64 : 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0B1220",
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
  list: {
    paddingBottom: 80,
  },
});

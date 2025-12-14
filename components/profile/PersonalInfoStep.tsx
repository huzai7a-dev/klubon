import Dropdown, { DropdownOption } from "@/components/ui/Dropdown";
import PhotoUpload from "@/components/ui/PhotoUpload";
import Slider from "@/components/ui/Slider";
import TextInputField from "@/components/ui/TextInputField";
import { Colors } from "@/constants/theme";
import { CombinedProfileData } from "@/schemas/profileSchema";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDebounce } from "use-debounce";

const GENDER_OPTIONS: DropdownOption[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

interface SearchResult {
  place_id: number;
  description: string;
  lat: string;
  lon: string;
}

export default function PersonalInfoStep() {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useFormContext<CombinedProfileData>();

  const [isLocating, setIsLocating] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(mapSearchQuery, 500);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address) {
        const city = address.city || address.region || address.subregion || "";
        if (city) {
          setValue("city", city, { shouldValidate: true });
          clearErrors("city");
        }
      }
    } catch (error) {
      console.log("Reverse geocoding failed", error);
    }
  };

  const handleDetectLocation = async (isManual = false) => {
    setIsLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("city", {
          type: "manual",
          message: "Location is required. Please select manually.",
        });
        if (isManual) {
          Alert.alert(
            "Permission Denied",
            "Permission to access location was denied. Please select from the map."
          );
        }
        setIsLocating(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setValue("latitude", latitude);
      setValue("longitude", longitude);

      await reverseGeocode(latitude, longitude);
    } catch (error) {
      setError("city", {
        type: "manual",
        message: "Location detection failed.",
      });
      if (isManual) {
        Alert.alert("Error", "Failed to detect location.");
      }
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    handleDetectLocation(false);
  }, []);

  // Search Suggestions Effect
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      try {
        // Using OpenStreetMap Nominatim API for type-ahead suggestions
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            debouncedSearchQuery
          )}&addressdetails=1&limit=5`,
          {
            headers: {
              "User-Agent": "KlubonApp/1.0", // Nominatim requires a User-Agent
            },
          }
        );
        const data = await response.json();

        const results: SearchResult[] = data.map((item: any) => ({
          place_id: item.place_id,
          description: item.display_name,
          lat: item.lat,
          lon: item.lon,
        }));

        setSearchResults(results);
      } catch (error) {
        console.error("Search failed", error);
      }
    };

    fetchSuggestions();
  }, [debouncedSearchQuery]);

  const openMap = () => {
    const currentLat = getValues("latitude");
    const currentLong = getValues("longitude");

    if (currentLat && currentLong) {
      setMapRegion({
        ...mapRegion,
        latitude: currentLat,
        longitude: currentLong,
      });
      setSelectedLocation({ latitude: currentLat, longitude: currentLong });
    }
    setIsMapVisible(true);
  };

  const onMapPress = (e: MapPressEvent) => {
    setSelectedLocation(e.nativeEvent.coordinate);
    // Clear search flow if user taps map
    setSearchResults([]);
    // Dismiss keyboard
  };

  const confirmMapSelection = async () => {
    if (selectedLocation) {
      setValue("latitude", selectedLocation.latitude);
      setValue("longitude", selectedLocation.longitude);
      await reverseGeocode(
        selectedLocation.latitude,
        selectedLocation.longitude
      );
      setIsMapVisible(false);
    }
  };

  const selectSuggestion = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);

    setMapRegion({
      ...mapRegion,
      latitude: lat,
      longitude: lon,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setSelectedLocation({ latitude: lat, longitude: lon });
    setSearchResults([]);
    setMapSearchQuery(result.description.split(",")[0]); // Just concise name
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>
          Tell us about yourself to help others find you
        </Text>
      </View>

      <Controller
        control={control}
        name="avatar_uri"
        render={({ field: { onChange, value } }) => (
          <PhotoUpload
            value={value}
            onChange={onChange}
            error={errors.avatar_uri?.message}
          />
        )}
      />

      <View style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputField
              placeholder="Full Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              icon="person"
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="user_gender"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              placeholder="Select Gender"
              options={GENDER_OPTIONS}
              value={value}
              onChange={onChange}
              error={errors.user_gender?.message}
              icon="people"
            />
          )}
        />

        {/* Location Section */}
        <View style={[styles.fieldContainer, { zIndex: -1 }]}>
          <TouchableOpacity
            // onPress={openMap}
            activeOpacity={0.8}
          >
            <View pointerEvents="none">
              <Controller
                control={control}
                name="city"
                render={({ field: { value } }) => (
                  <TextInputField
                    placeholder="City / Location"
                    value={value}
                    editable={false}
                    icon="location"
                    error={errors.city?.message}
                  />
                )}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* <Controller
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
                /> */}

        <Controller
          control={control}
          name="short_bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputField
              placeholder="Short Bio (Optional)"
              value={value || ""}
              onChangeText={onChange}
              onBlur={onBlur}
              multiline
              numberOfLines={3}
              icon="document-text"
              error={errors.short_bio?.message}
            />
          )}
        />
      </View>

      {/* Fetching Location Modal */}
      <Modal visible={isLocating} transparent={true} animationType="fade">
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Fetching location...</Text>
          </View>
        </View>
      </Modal>

      {/* Map Selection Modal */}
      <Modal
        visible={isMapVisible}
        animationType="slide"
        onRequestClose={() => setIsMapVisible(false)}
      >
        <SafeAreaView style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <TouchableOpacity onPress={() => setIsMapVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Select Location</Text>
            <TouchableOpacity
              onPress={confirmMapSelection}
              disabled={!selectedLocation}
            >
              <Text
                style={[
                  styles.confirmText,
                  !selectedLocation && styles.disabledText,
                ]}
              >
                Confirm
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={20}
                color={Colors.greyDark}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search city..."
                value={mapSearchQuery}
                onChangeText={setMapSearchQuery}
                returnKeyType="search"
                placeholderTextColor={Colors.greyDark}
              />
              {mapSearchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setMapSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={Colors.greyDark}
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* Search Results List */}
            {searchResults.length > 0 && (
              <View style={styles.resultsList}>
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.place_id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() => selectSuggestion(item)}
                    >
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color={Colors.greyDark}
                      />
                      <Text style={styles.resultText} numberOfLines={1}>
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            )}
          </View>

          <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={setMapRegion}
            onPress={onMapPress}
          >
            {selectedLocation && <Marker coordinate={selectedLocation} />}
          </MapView>
        </SafeAreaView>
      </Modal>
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
  form: {
    gap: 4,
  },
  fieldContainer: {
    marginBottom: 8,
  },
  locationButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    justifyContent: "flex-start",
  },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  locationBtnText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "600",
  },
  // Loading Modal
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingBox: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: "500",
  },
  // Map Modal
  mapContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mapHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
    zIndex: 1,
    backgroundColor: Colors.white,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  closeText: {
    fontSize: 15,
    color: Colors.greyDark,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.greyLight,
  },
  searchContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10, // Ensure it's above the map
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.greyLight,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: Colors.text,
  },
  resultsList: {
    marginTop: 6,
    backgroundColor: Colors.white,
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  resultItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resultText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

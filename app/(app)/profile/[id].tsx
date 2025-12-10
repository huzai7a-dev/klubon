import RatingSummary from "@/components/RatingSummary";
import ActionIcon from "@/components/ui/ActionIcon";
import FilterChip from "@/components/ui/FilterChip";
import { Colors } from "@/constants/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock review data
const MOCK_REVIEWS = [
  {
    id: "1",
    reviewerName: "Sarah Johnson",
    rating: 5,
    comment: "Great player! Very competitive and fair. Had an amazing game together.",
    timeAgo: "2 days ago",
    reviewerPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    reviewerName: "Mike Chen",
    rating: 4,
    comment: "Reliable partner for weekend matches. Always on time and brings good energy.",
    timeAgo: "1 week ago",
    reviewerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    reviewerName: "Emma Davis",
    rating: 5,
    comment: "Excellent skills and sportsmanship. Highly recommend playing with Alex!",
    timeAgo: "2 weeks ago",
    reviewerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "4",
    reviewerName: "James Wilson",
    rating: 4,
    comment: "Good player, very competitive. Enjoyed our matches.",
    timeAgo: "3 weeks ago",
    reviewerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "5",
    reviewerName: "Lisa Anderson",
    rating: 5,
    comment: "One of the best players I've matched with. Great communication and skills!",
    timeAgo: "1 month ago",
    reviewerPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
];

// Mock user profile data
const MOCK_USER_PROFILE = {
  id: "1",
  name: "Alex Carter",
  city: "San Francisco, CA",
  bio: "Passionate basketball player looking for competitive games and casual weekend matches. Always up for a good challenge!",
  photoUrl:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=60",
  activities: ["Basketball", "Casual", "Running", "Table Tennis", "Cycling"],
  playStyle: "Competitive",
  playTimes: ["Weekends", "Evenings"],
  averageRating: 4.5,
  reviewCount: 12,
  isFavorited: false,
};

function ReviewItem({ review }: { review: typeof MOCK_REVIEWS[0] }) {
  const [imageError, setImageError] = React.useState(false);
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <MaterialIcons
        key={i}
        name={i <= review.rating ? "star" : "star-border"}
        size={16}
        color={Colors.yellow}
        style={styles.reviewStar}
      />
    );
  }

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        {!imageError ? (
          <Image
            source={{ uri: review.reviewerPhoto }}
            style={styles.reviewerAvatar}
            onError={() => setImageError(true)}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.reviewerAvatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={24} color={Colors.greyNormal} />
          </View>
        )}
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{review.reviewerName}</Text>
          <View style={styles.reviewRatingRow}>
            <View style={styles.reviewStars}>{stars}</View>
            <Text style={styles.reviewTime}>{review.timeAgo}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
    </View>
  );
}

export default function ProfileDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = React.useState(
    MOCK_USER_PROFILE.isFavorited
  );
  const [reviewsExpanded, setReviewsExpanded] = React.useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    console.log("Toggle favorite for user:", id);
  };

  const handleMessage = () => {
    console.log("Open message for user:", id);
  };

  const handleViewAllReviews = () => {
    setReviewsExpanded(!reviewsExpanded);
    console.log("Toggle reviews list for user:", id);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Photo */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: MOCK_USER_PROFILE.photoUrl }}
            style={styles.headerImage}
            resizeMode="cover"
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>

          {/* Information Overlay */}
          <View style={styles.infoOverlay}>
            <View style={styles.overlayGradient} />
            <View style={styles.overlayContent}>
              <Text style={styles.userName}>{MOCK_USER_PROFILE.name}</Text>
              <View style={styles.locationRow}>
                <Ionicons
                  name="location"
                  size={16}
                  color="rgba(255,255,255,0.9)"
                />
                <Text style={styles.city}>{MOCK_USER_PROFILE.city}</Text>
              </View>
              <Text style={styles.bio} numberOfLines={2}>
                {MOCK_USER_PROFILE.bio}
              </Text>
            </View>
          </View>
        </View>

        {/* Action & Summary Bar */}
        <View style={styles.actionBar}>
          <View style={styles.actionButtons}>
            <ActionIcon
              iconName={isFavorited ? "heart" : "heart-outline"}
              onPress={handleFavorite}
              isPrimary={isFavorited}
              style={styles.actionButton}
            />
            <ActionIcon
              iconName="chatbubble-outline"
              onPress={handleMessage}
              style={styles.actionButton}
            />
          </View>

          <View style={styles.ratingContainer}>
            <RatingSummary
              averageRating={MOCK_USER_PROFILE.averageRating}
              reviewCount={MOCK_USER_PROFILE.reviewCount}
              onPress={handleViewAllReviews}
              align="vertical"
            />
          </View>
        </View>

        {/* Detail Sections */}
        <View style={styles.detailsContainer}>
          {/* Activities Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activities & Skills</Text>
            <View style={styles.activitiesContainer}>
              {MOCK_USER_PROFILE.activities.map((activity) => (
                <FilterChip
                  key={activity}
                  label={activity}
                  isActive={true}
                  onPress={() => console.log("Activity pressed:", activity)}
                />
              ))}
            </View>
          </View>

          {/* Preferences Section */}
          {/* <View style={styles.section}>
            <Text style={styles.sectionTitle}>Play Style</Text>
            <View style={styles.preferenceCard}>
              <View style={styles.preferenceRow}>
                <Text style={styles.preferenceLabel}>Style:</Text>
                <View style={styles.preferenceValue}>
                  <Text style={styles.preferenceText}>
                    {MOCK_USER_PROFILE.playStyle}
                  </Text>
                </View>
              </View>
              <View style={[styles.preferenceRow, styles.preferenceRowLast]}>
                <Text style={styles.preferenceLabel}>Available:</Text>
                <View style={styles.preferenceTags}>
                  {MOCK_USER_PROFILE.playTimes.map((time) => (
                    <View key={time} style={styles.timeTag}>
                      <Text style={styles.timeTagText}>{time}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View> */}

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.reviewsSectionTitle}>Ratings & Reviews</Text>
              <TouchableOpacity
                onPress={handleViewAllReviews}
                activeOpacity={0.7}
                style={styles.viewAllButton}
              >
                <Text style={styles.viewAllText}>
                  {reviewsExpanded
                    ? "Hide Reviews"
                    : `View All ${MOCK_USER_PROFILE.reviewCount} Reviews`}
                </Text>
                <Ionicons
                  name={reviewsExpanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={Colors.primary}
                  style={styles.chevronIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Reviews List - Collapsible */}
            {reviewsExpanded && (
              <View style={styles.reviewsListContainer}>
                <FlatList
                  data={MOCK_REVIEWS}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => <ReviewItem review={item} />}
                  scrollEnabled={false}
                  ItemSeparatorComponent={() => (
                    <View style={styles.reviewSeparator} />
                  )}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const HEADER_HEIGHT = 320;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    width: "100%",
    height: HEADER_HEIGHT,
    position: "relative",
    backgroundColor: Colors.greyLight,
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  infoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  overlayContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
  },
  userName: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.white,
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  city: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.95)",
    marginLeft: 4,
    letterSpacing: -0.2,
  },
  bio: {
    fontSize: 14,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyLight,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  actionButton: {
    marginRight: 12,
  },
  moreButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  ratingContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  activitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  preferenceCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  preferenceRowLast: {
    marginBottom: 0,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.greyDark,
    width: 100,
    marginTop: 2,
  },
  preferenceValue: {
    flex: 1,
  },
  preferenceText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text,
  },
  preferenceTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  timeTag: {
    backgroundColor: Colors.greyLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  timeTagText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.greyDark,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewsSectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginRight: 4,
  },
  chevronIcon: {
    marginLeft: 2,
  },
  reviewsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  reviewsListContainer: {
    marginTop: 8,
  },
  reviewItem: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: Colors.greyLight,
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.greyLight,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  reviewRatingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewStars: {
    flexDirection: "row",
    marginRight: 8,
  },
  reviewStar: {
    marginRight: 2,
  },
  reviewTime: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.greyDark,
  },
  reviewComment: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.greyDark,
    lineHeight: 20,
  },
  reviewSeparator: {
    height: 12,
  },
});

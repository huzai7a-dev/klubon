import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/theme";

interface Props {
  averageRating: number; // 1-5
  reviewCount: number;
  onPress?: () => void;
  align?: "vertical" | "horizontal"
}

export default function RatingSummary({
  averageRating,
  reviewCount,
  onPress,
  align = "vertical"
}: Props) {
  const stars = [];
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <MaterialIcons
          key={i}
          name="star"
          size={24}
          color={Colors.yellow}
          style={styles.star}
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <MaterialIcons
          key={i}
          name="star-half"
          size={24}
          color={Colors.yellow}
          style={styles.star}
        />
      );
    } else {
      stars.push(
        <MaterialIcons
          key={i}
          name="star-border"
          size={24}
          color={Colors.yellow}
          style={styles.star}
        />
      );
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress || (() => console.log("Navigate to All Reviews"))}
      activeOpacity={0.7}
      style={{ ...styles.container, flexDirection: align == "vertical" ? "column" : "row" }}
    >
      <View style={styles.starsContainer}>{stars}</View>
      <View style={styles.ratingInfo}>
        <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
        <Text style={styles.reviewCountText}>
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
  },
  star: {
    marginRight: 1,
  },
  ratingInfo: {
    flexDirection: "row",
    alignItems: "baseline",
    flexWrap: "wrap",
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
    marginRight: 4,
  },
  reviewCountText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.greyDark,
  },
});


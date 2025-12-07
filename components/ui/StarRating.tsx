import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

interface Props {
  rating: number; // current rating (e.g. 4.5)
  max?: number; // maximum stars (default 5)
  size?: number;
  color?: string;
  showNumber?: boolean; // show numeric value next to stars
  style?: ViewStyle;
}

export default function StarRating({
  rating,
  max = 5,
  size = 16,
  color = "#FFD700",
  showNumber = true,
  style,
}: Props) {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    const full = rating >= i;
    const half = !full && rating >= i - 0.5;
    const name = full ? "star" : half ? "star-half" : "star-border";

    stars.push(
      <MaterialIcons
        key={i}
        name={name as any}
        size={size}
        color={color}
        style={styles.star}
        accessibilityLabel={`Star ${i} of ${max}`}
      />
    );
  }

  return (
    <View style={[styles.container, style] as any}>
      <View style={styles.starsRow}>{stars}</View>
      {showNumber && (
        <Text
          style={styles.text}
          accessibilityLabel={`Rating ${rating} out of ${max}`}
        >
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: 4,
  },
  text: {
    marginLeft: 8,
    color: "#E6EEF8",
    fontSize: 12,
  },
});

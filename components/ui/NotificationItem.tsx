import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Image,
    ImageStyle,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

export interface Notification {
  id: string;
  type: "message" | "match" | "review" | "general";
  senderName: string;
  timeAgo: string; // e.g. '2h', '3d'
  message: string;
  photoUrl?: string;
  isRead: boolean;
}

interface Props {
  notification: Notification;
  onPress?: (id: string) => void;
  style?: ViewStyle;
}

const TYPE_ICON_MAP: Record<
  Notification["type"],
  { icon: keyof typeof MaterialIcons.glyphMap; color: string }
> = {
  message: { icon: "chat", color: "#4F46E5" }, // indigo
  match: { icon: "favorite", color: "#EF4444" }, // red
  review: { icon: "star", color: "#F59E0B" }, // amber
  general: { icon: "notifications", color: "#10B981" }, // green
};

function getNotificationVisuals(type: Notification["type"]) {
  return TYPE_ICON_MAP[type] || TYPE_ICON_MAP.general;
}

const NotificationItem: React.FC<Props> = ({
  notification,
  onPress,
  style,
}) => {
  const visuals = getNotificationVisuals(notification.type);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const containerStyle = [
    styles.container,
    !notification.isRead && styles.unread,
    style,
  ];

  const hasPhoto = notification.photoUrl && !imageError;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress && onPress(notification.id)}
      style={containerStyle}
    >
      <View style={styles.leftCol}>
        {hasPhoto ? (
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: notification.photoUrl }}
              style={styles.avatar}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons
                  name="person"
                  size={24}
                  color={visuals.color + "80"}
                />
              </View>
            )}
            <View style={styles.iconOverlay}>
              <View
                style={[
                  styles.iconBadge,
                  { backgroundColor: visuals.color },
                ]}
              >
                <MaterialIcons
                  name={visuals.icon}
                  size={14}
                  color="#FFFFFF"
                />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.iconAvatar,
              { backgroundColor: visuals.color + "15" },
            ]}
          >
            <MaterialIcons
              name={visuals.icon}
              size={26}
              color={visuals.color}
            />
          </View>
        )}

        {/* Unread indicator */}
        {!notification.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: visuals.color }]} />
        )}
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.senderContainer}>
            <Text style={styles.sender} numberOfLines={1} ellipsizeMode="tail">
              {notification.senderName}
            </Text>
            {!notification.isRead && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>New</Text>
              </View>
            )}
          </View>
          <Text style={styles.time}>{notification.timeAgo}</Text>
        </View>

        <Text
          style={[
            styles.message,
            !notification.isRead && styles.messageUnread,
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {notification.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const AVATAR_SIZE = 64;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  unread: {
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 3,
    borderLeftColor: "#4F46E5",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  leftCol: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginRight: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    position: "relative",
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    resizeMode: "cover",
    backgroundColor: "#F3F4F6",
  } as ImageStyle,
  imagePlaceholder: {
    position: "absolute",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  iconAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  iconOverlay: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  unreadDot: {
    position: "absolute",
    right: -4,
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  senderContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  sender: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  newBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  time: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    fontWeight: "400",
  },
  messageUnread: {
    color: "#374151",
    fontWeight: "500",
  },
});

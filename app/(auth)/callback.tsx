import { useSession } from "@/contexts/AuthContext";
import { ActivityIndicator, View } from "react-native";

export default function AuthCallback() {
  const { session, profile, isInitializing, isLoading } = useSession();

  // useEffect(() => {
  //   if (isInitializing || isLoading) return;

  //   if (session) {
  //     if (profile) {
  //       router.replace("/(app)/discover");
  //     } else {
  //       router.replace("/(auth)/setup-profile");
  //     }
  //   } else {
  //     router.replace("/(auth)");
  //   }
  // }, [session, profile, isInitializing, isLoading]);

  // useEffect(() => {
  //   router.replace("/");
  // }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
    </View>
  );
}

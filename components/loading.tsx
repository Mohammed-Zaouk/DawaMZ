import BackgroundBubbles from "@/components/background_bubbles";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Loading() {
  return (
    <SafeAreaView style={styles.loading_container}>
      <BackgroundBubbles />
      <ActivityIndicator size="large" color="#ffffff" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  //loading
  loading_container: {
    flex: 1,
    backgroundColor: "#2196F3",
    gap: 20,
    paddingHorizontal: 10,
    paddingTop: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

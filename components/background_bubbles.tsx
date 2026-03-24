import { StyleSheet, View } from "react-native";

export default function BackgroundBubbles() {
  return (
    <>
      <View style={styles.bubble_top_right} />
      <View style={styles.bubble_bottom_left} />
    </>
  );
}

const styles = StyleSheet.create({
  bubble_top_right: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  bubble_bottom_left: {
    position: "absolute",
    bottom: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
});

import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

export function PulseDot({ color }: { color: string }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[styles.pulse_dot, { backgroundColor: color, opacity }]}
    />
  );
}

const styles = StyleSheet.create({
  pulse_dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

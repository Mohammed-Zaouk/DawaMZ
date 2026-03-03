import { StyleSheet, View, ViewStyle } from "react-native";

interface DividerProps {
  style?: ViewStyle;
}

export default function Divider({ style: customStyle }: DividerProps) {
  return <View style={[styles.divider, customStyle]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
});

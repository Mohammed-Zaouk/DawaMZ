// app/(tabs)/menu.tsx
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Menu() {
  // ← Add "export default"
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Menu Screen</Text>
    </SafeAreaView>
  );
}

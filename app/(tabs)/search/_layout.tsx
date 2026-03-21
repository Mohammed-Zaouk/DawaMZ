import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search_index" options={{ title: "Select Region" }} />
      <Stack.Screen name="cities" options={{ title: "Select City" }} />
      <Stack.Screen name="pharmacies" options={{ title: "Pharmacies" }} />
    </Stack>
  );
}

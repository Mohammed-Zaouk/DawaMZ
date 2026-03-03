import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="search_index"
        options={{ title: "Select Region", headerShown: false }}
      />
      <Stack.Screen
        name="cities"
        options={{ title: "Select City", headerShown: false }}
      />
      <Stack.Screen
        name="pharmacies"
        options={{ title: "Pharmacies", headerShown: false }}
      />
    </Stack>
  );
}

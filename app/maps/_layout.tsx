import { Stack } from "expo-router";

export default function MapsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auto-map" options={{ title: "Auto Search Map" }} />
      <Stack.Screen
        name="pharmacy-location"
        options={{ title: "Pharmacy Location" }}
      />
      <Stack.Screen
        name="pharmacy-direction"
        options={{ title: "Pharmacy Direction" }}
      />
    </Stack>
  );
}

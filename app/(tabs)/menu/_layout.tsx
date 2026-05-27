import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="language"
        options={{ title: "Language", headerShown: false }}
      />
      <Stack.Screen
        name="privacy"
        options={{ title: "Privacy Policy", headerShown: false }}
      />
      <Stack.Screen
        name="terms"
        options={{ title: "Terms of Service", headerShown: false }}
      />
      <Stack.Screen
        name="about"
        options={{ title: "About", headerShown: false }}
      />
      <Stack.Screen
        name="pharmacy_suggestion"
        options={{ title: "pharmacy_suggestion", headerShown: false }}
      />
      <Stack.Screen
        name="city_suggestion"
        options={{ title: "city_suggestion", headerShown: false }}
      />
    </Stack>
  );
}

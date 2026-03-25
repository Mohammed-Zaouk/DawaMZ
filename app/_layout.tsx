import { LanguageProvider } from "@/context/LanguageContext";
import { getLanguage } from "@/utils/getLanguage";
import { Stack, useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key) return;
    checkLanguage();
  }, [navigationState?.key]);

  const checkLanguage = async () => {
    try {
      if (!getLanguage) {
        router.replace("/onboarding/language_selection");
      }
    } catch (error) {
      console.error("Error checking language:", error);
    }
  };

  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding/language_selection" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="maps" />
      </Stack>
    </LanguageProvider>
  );
}

import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
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
    <ThemeProvider>
      <LanguageProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 200,
            gestureEnabled: true,
            gestureDirection: "horizontal",
          }}
        >
          <Stack.Screen
            name="onboarding/language_selection"
            options={{ animation: "fade" }}
          />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen name="maps" />
        </Stack>
      </LanguageProvider>
    </ThemeProvider>
  );
}

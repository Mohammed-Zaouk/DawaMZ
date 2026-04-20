import BackgroundBubbles from "@/components/background_bubbles";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Language = "ar" | "fr" | "en";

const LANGUAGES = [
  { code: "ar", label: "العربية", flag: "🇲🇦", sub: "Arabic" },
  { code: "en", label: "English", flag: "🇬🇧", sub: "English" },
  { code: "fr", label: "Français", flag: "🇫🇷", sub: "French" },
] as const;

export default function LanguageSelectionPage() {
  const { setLanguage } = useLanguage();
  const { theme, isDark, setTheme } = useTheme();
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null,
  );

  const getText = () => {
    if (selectedLanguage === "ar") {
      return { next: "التالي", skip: "تخطي" };
    } else if (selectedLanguage === "fr") {
      return { next: "Suivant", skip: "Passer" };
    } else {
      return { next: "Next", skip: "Skip" };
    }
  };

  const text = getText();

  const handleNext = async () => {
    if (!selectedLanguage) return;
    try {
      await setLanguage(selectedLanguage);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.screenBg }]}
    >
      <BackgroundBubbles />

      {/* Logo & Title */}
      <View style={styles.image_container}>
        <Image
          source={require("../../assets/images/logo/logo.png")}
          style={styles.logo}
        />
        <Text
          style={[styles.title, { color: theme.pageTitle }]}
          numberOfLines={1}
        >
          DawaMZ
        </Text>
        <Text
          style={[styles.tagline, { color: theme.pageSubtitle }]}
          numberOfLines={1}
        >
          Locate open & on-guard pharmacies near you
        </Text>
      </View>

      {/* Language prompt */}
      <View style={styles.prompt_container}>
        <View
          style={[styles.divider_line, { backgroundColor: theme.sideLine }]}
        />
        <View style={styles.prompt_text_group}>
          <Text
            style={[styles.prompt_line, { color: theme.pageTitle }]}
            numberOfLines={1}
          >
            اختر اللغة
          </Text>
          <Text
            style={[styles.prompt_line, { color: theme.pageTitle }]}
            numberOfLines={1}
          >
            Choose Your Language
          </Text>
          <Text
            style={[styles.prompt_line, { color: theme.pageTitle }]}
            numberOfLines={1}
          >
            Choisissez la langue
          </Text>
        </View>
        <View
          style={[styles.divider_line, { backgroundColor: theme.sideLine }]}
        />
      </View>

      {/* Language Buttons — selectable */}
      <View style={styles.button_container}>
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.lang_button,
                { backgroundColor: theme.card, borderColor: "transparent" },
                isSelected &&
                  !isDark && {
                    borderColor: "rgba(255,255,255,0.5)",
                    backgroundColor: "#2099fc",
                  },
                isSelected &&
                  isDark && {
                    borderColor: theme.selectedBorder,
                    backgroundColor: theme.selectedBg,
                  },
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
              activeOpacity={0.75}
            >
              <Text style={styles.flag_text}>{lang.flag}</Text>
              <Text
                style={[
                  styles.lang_label,
                  { color: theme.text },
                  isSelected && !isDark && { color: "#FFFFFF" },
                  isSelected && isDark && { color: theme.selectedText },
                ]}
                numberOfLines={1}
              >
                {lang.label}
              </Text>
              <View
                style={[
                  styles.lang_badge,
                  { backgroundColor: theme.cardIcon },
                  isSelected &&
                    !isDark && {
                      backgroundColor: "rgba(255,255,255,0.25)",
                    },
                  isSelected &&
                    isDark && {
                      backgroundColor: theme.selectedBg,
                    },
                ]}
              >
                <Text
                  style={[
                    styles.lang_sub,
                    { color: theme.itemDescription },
                    isSelected &&
                      !isDark && {
                        color: "#FFFFFF",
                        fontWeight: "600",
                      },
                    isSelected &&
                      isDark && {
                        color: theme.selectedText,
                        fontWeight: "600",
                      },
                  ]}
                  numberOfLines={1}
                >
                  {lang.sub}
                </Text>
              </View>

              {/* Checkmark indicator */}
              {isSelected && (
                <View
                  style={[
                    styles.check_circle,
                    {
                      backgroundColor: isDark
                        ? theme.selectedBorder
                        : "rgba(255,255,255,0.35)",
                    },
                  ]}
                >
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color={isDark ? "#FFFFFF" : "#1565C0"}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Theme Toggle */}
      <View style={styles.theme_row}>
        <View
          style={[styles.divider_line, { backgroundColor: theme.sideLine }]}
        />
        <View style={styles.theme_toggle_group}>
          <Ionicons
            name="sunny-outline"
            size={20}
            color={!isDark ? theme.pageTitle : theme.pageSubtitle}
          />
          <Switch
            value={isDark}
            onValueChange={(val) => setTheme(val ? "dark" : "light")}
            trackColor={{
              false: "rgba(255,255,255,0.3)",
              true: isDark ? "#2099fc" : "rgba(255,255,255,0.5)",
            }}
            thumbColor={isDark ? "#2099fc" : "#FFFFFF"}
            ios_backgroundColor="rgba(255,255,255,0.3)"
          />
          <Ionicons
            name="moon-outline"
            size={20}
            color={isDark ? theme.pageTitle : theme.pageSubtitle}
          />
        </View>
        <View
          style={[styles.divider_line, { backgroundColor: theme.sideLine }]}
        />
      </View>

      {/* Next / Skip Buttons */}
      <View style={styles.action_row}>
        <TouchableOpacity
          style={[styles.skip_button, { borderColor: theme.sideLine }]}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.skip_text, { color: theme.pageTitle }]}
            numberOfLines={1}
          >
            {text.skip}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.next_button,
            { backgroundColor: theme.card },
            !selectedLanguage && {
              backgroundColor: theme.cardIcon,
              shadowOpacity: 0,
              elevation: 0,
            },
          ]}
          onPress={handleNext}
          activeOpacity={selectedLanguage ? 0.8 : 1}
          disabled={!selectedLanguage}
        >
          <Text
            style={[styles.next_text, { color: theme.selectedText }]}
            numberOfLines={1}
          >
            {text.next}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={16}
            color={theme.selectedText}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Screen
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    gap: 30,
  },

  // Logo & Title
  image_container: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 50,
  },
  logo: {
    width: 180,
    height: 170,
    marginBottom: -45,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 13,
    letterSpacing: 0.3,
    fontWeight: "400",
    marginTop: 5,
  },

  // Language Prompt
  prompt_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  divider_line: {
    flex: 1,
    height: 1,
  },
  prompt_text_group: {
    alignItems: "center",
    gap: 1,
  },
  prompt_line: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },

  // Language Buttons
  button_container: {
    gap: 10,
    width: "85%",
    alignItems: "center",
  },
  lang_button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    width: "100%",
    borderWidth: 1.5,
    shadowColor: "rgba(0,0,0,0.15)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
    gap: 12,
  },
  flag_text: {
    fontSize: 20,
  },
  lang_label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  lang_badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  lang_sub: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  check_circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -4,
  },

  // Theme Toggle
  theme_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  theme_toggle_group: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // Actions
  action_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    gap: 20,
    marginTop: "auto",
  },
  skip_button: {
    width: 90,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1.5,
  },
  skip_text: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  next_button: {
    flex: 1,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    shadowColor: "rgba(0,0,0,0.2)",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  next_text: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Language() {
  const { language, setLanguage } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const saveLanguage = async () => {
    if (!selectedLanguage) return;
    setIsLoading(true);
    await setLanguage(selectedLanguage);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push("/(tabs)/menu");
  };

  const getText = () => {
    if (selectedLanguage === "ar") {
      return { saveButton: "حفظ التغييرات", saving: "جاري الحفظ..." };
    } else if (selectedLanguage === "fr") {
      return {
        saveButton: "Enregistrer les modifications",
        saving: "Enregistrement...",
      };
    } else {
      return { saveButton: "Save Changes", saving: "Saving..." };
    }
  };

  const text = getText();

  const languages = [
    { code: "ar", flag: "🇲🇦", nativeName: "العربية", label: "Arabic" },
    { code: "en", flag: "🇬🇧", nativeName: "English", label: "English" },
    { code: "fr", flag: "🇫🇷", nativeName: "Français", label: "French" },
  ] as const;

  return (
    <SafeAreaView style={styles.screen_container}>
      <BackgroundBubbles />
      <Header />

      <View style={styles.content_container}>
        <View style={styles.title_section}>
          <View style={styles.title_divider_row}>
            <View style={styles.title_line} />
            <View style={styles.title_text_block}>
              <Text style={styles.title_arabic}>اختر اللغة</Text>
              <Text style={styles.title_main}>Choose Your Language</Text>
              <Text style={styles.title_sub}>Choisissez la langue</Text>
            </View>
            <View style={styles.title_line} />
          </View>
        </View>

        <View style={styles.buttons_section}>
          {languages.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => setSelectedLanguage(lang.code)}
                style={[
                  styles.language_row,
                  isSelected && styles.language_row_selected,
                ]}
                activeOpacity={0.75}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.language_name,
                    isSelected && styles.language_name_selected,
                  ]}
                >
                  {lang.nativeName}
                </Text>
                <View
                  style={[
                    styles.language_badge,
                    isSelected && styles.language_badge_selected,
                  ]}
                >
                  <Text
                    style={[
                      styles.language_badge_text,
                      isSelected && styles.language_badge_text_selected,
                    ]}
                  >
                    {lang.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.save_section}>
          <Button
            mode="contained"
            onPress={saveLanguage}
            style={styles.save_button}
            contentStyle={styles.save_button_content}
            labelStyle={styles.save_button_label}
            buttonColor="#2196F3"
            textColor="#FFFFFF"
            disabled={!selectedLanguage || isLoading}
            loading={isLoading}
          >
            {isLoading ? text.saving : text.saveButton}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: "#2196F3",
    gap: 50,
  },
  content_container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 28,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: -30,
    justifyContent: "space-between",
  },

  // --- Title section ---
  title_section: {
    alignItems: "center",
    marginBottom: 24,
  },
  title_divider_row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  title_line: {
    flex: 1,
    height: 1,
    backgroundColor: "#DDDDDD",
  },
  title_text_block: {
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 4,
  },
  title_arabic: {
    fontSize: 12,
    color: "#AAAAAA",
    letterSpacing: 0.8,
  },
  title_main: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D2D2D",
    letterSpacing: 0.1,
  },
  title_sub: {
    fontSize: 13,
    fontWeight: "400",
    color: "#999999",
    letterSpacing: 0.1,
  },

  // --- Language rows ---
  buttons_section: {
    flex: 1,
    gap: 14,
    alignItems: "center",
    paddingTop: 4,
  },
  language_row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  language_row_selected: {
    borderColor: "#09C849",
    backgroundColor: "#F4FFF8",
  },
  flag: {
    fontSize: 26,
    marginRight: 14,
  },
  language_name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  language_name_selected: {
    color: "#09C849",
  },
  language_badge: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  language_badge_selected: {
    backgroundColor: "#E0F9E8",
  },
  language_badge_text: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888888",
  },
  language_badge_text_selected: {
    color: "#09C849",
    fontWeight: "600",
  },

  // --- Save button ---
  save_section: {
    paddingBottom: 30,
    alignItems: "center",
  },
  save_button: {
    width: "100%",
    maxWidth: 330,
    borderRadius: 16,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  save_button_content: {
    height: 54,
  },
  save_button_label: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});

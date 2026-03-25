import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
      return {
        pageTitle: "اختر اللغة",
        pageSubtitle: "اختر لغتك المفضلة",
        saveButton: "حفظ التغييرات",
        saving: "جاري الحفظ...",
      };
    } else if (selectedLanguage === "fr") {
      return {
        pageTitle: "Sélectionner la langue",
        pageSubtitle: "Choisissez votre langue préférée",
        saveButton: "Enregistrer les modifications",
        saving: "Enregistrement...",
      };
    } else {
      return {
        pageTitle: "Select Language",
        pageSubtitle: "Choose your preferred language",
        saveButton: "Save Changes",
        saving: "Saving...",
      };
    }
  };

  const text = getText();

  return (
    <SafeAreaView style={styles.screen_container}>
      <BackgroundBubbles />
      <Header />

      <View style={styles.content_container}>
        <View style={styles.title_section}>
          <Text style={styles.page_title}>{text.pageTitle}</Text>
          <Text style={styles.page_subtitle}>{text.pageSubtitle}</Text>
        </View>

        <View style={styles.buttons_section}>
          <Button
            mode="contained"
            onPress={() => setSelectedLanguage("ar")}
            style={styles.language_button}
            buttonColor={selectedLanguage === "ar" ? "#09C849" : "#FFFFFF"}
            textColor={selectedLanguage === "ar" ? "#FFFFFF" : "#1E7FC1"}
          >
            🇲🇦 العربية
          </Button>

          <Button
            mode="contained"
            onPress={() => setSelectedLanguage("en")}
            style={styles.language_button}
            buttonColor={selectedLanguage === "en" ? "#09C849" : "#FFFFFF"}
            textColor={selectedLanguage === "en" ? "#FFFFFF" : "#1E7FC1"}
          >
            🇬🇧 English
          </Button>

          <Button
            mode="contained"
            onPress={() => setSelectedLanguage("fr")}
            style={styles.language_button}
            buttonColor={selectedLanguage === "fr" ? "#09C849" : "#FFFFFF"}
            textColor={selectedLanguage === "fr" ? "#FFFFFF" : "#1E7FC1"}
          >
            🇫🇷 Français
          </Button>
        </View>

        <View style={styles.save_section}>
          <Button
            mode="contained"
            onPress={saveLanguage}
            style={styles.save_button}
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
    backgroundColor: "#f0f0f0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: -30,
    justifyContent: "space-between",
  },
  title_section: {
    alignItems: "center",
    marginBottom: 20,
  },
  page_title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 8,
  },
  page_subtitle: {
    fontSize: 14,
    color: "#666666",
  },
  buttons_section: {
    flex: 1,
    gap: 15,
    alignItems: "center",
    paddingTop: 10,
  },
  language_button: {
    width: "100%",
    maxWidth: 320,
    height: 55,
    justifyContent: "center",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  save_section: {
    paddingBottom: 30,
    alignItems: "center",
  },
  save_button: {
    width: "100%",
    maxWidth: 320,
    height: 50,
    justifyContent: "center",
    borderRadius: 12,
  },
});

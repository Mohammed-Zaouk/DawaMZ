import BackgroundBubbles from "@/components/background_bubbles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LANGUAGES = [
  { code: "ar", label: "العربية", flag: "🇲🇦", sub: "Arabic" },
  { code: "en", label: "English", flag: "🇬🇧", sub: "English" },
  { code: "fr", label: "Français", flag: "🇫🇷", sub: "French" },
];

export default function LanguageSelectionPage() {
  const router = useRouter();

  const saveLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem("selectedLanguage", language);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundBubbles />

      <View style={styles.image_container}>
        <Image
          source={require("../../assets/images/logo/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title} numberOfLines={1}>
          DawaMZ
        </Text>
        <Text style={styles.tagline} numberOfLines={1}>
          Locate open & on-guard pharmacies near you
        </Text>
      </View>

      <View style={styles.prompt_container}>
        <View style={styles.divider_line} />
        <View style={styles.prompt_text_group}>
          <Text style={styles.prompt_line} numberOfLines={1}>
            اختر اللغة
          </Text>
          <Text style={styles.prompt_line} numberOfLines={1}>
            Choose Your Language
          </Text>
          <Text style={styles.prompt_line} numberOfLines={1}>
            Choisissez la langue
          </Text>
        </View>
        <View style={styles.divider_line} />
      </View>

      <View style={styles.button_container}>
        {LANGUAGES.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={styles.lang_button}
            onPress={() => saveLanguage(lang.code)}
            activeOpacity={0.75}
          >
            <Text style={styles.flag_text}>{lang.flag}</Text>
            <Text style={styles.lang_label} numberOfLines={1}>
              {lang.label}
            </Text>
            <View style={styles.lang_badge}>
              <Text style={styles.lang_sub} numberOfLines={1}>
                {lang.sub}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    gap: 30,
  },

  // Image & Title
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
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 0.3,
    fontWeight: "400",
    marginTop: 5,
  },

  // Language prompt
  prompt_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  divider_line: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  prompt_text_group: {
    alignItems: "center",
    gap: 1,
  },
  prompt_line: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    textAlign: "center",
  },

  // Buttons
  button_container: {
    gap: 10,
    width: "85%",
    alignItems: "center",
  },
  lang_button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    width: "100%",
    borderWidth: 1.5,
    borderColor: "transparent",
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
    color: "#1E7FC1",
  },
  lang_badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "#E8F1FD",
  },
  lang_sub: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1E7FC1",
    letterSpacing: 0.3,
  },
});

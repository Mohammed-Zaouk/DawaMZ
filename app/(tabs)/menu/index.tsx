import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { useLanguage } from "@/context/LanguageContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Divider, List, Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Menu() {
  const { language } = useLanguage();
  const [themeMode, setThemeMode] = useState<boolean>(false);
  const router = useRouter();
  const navigating = useRef(false);

  const handleNavigate = (route: string) => {
    if (navigating.current) return;
    navigating.current = true;
    router.push(route as any);
    setTimeout(() => {
      navigating.current = false;
    }, 500);
  };

  const getText = () => {
    if (language === "ar") {
      return {
        title: "القائمة",
        settings: "الإعدادات",
        language: "اللغة",
        darkMode: "الوضع الداكن",
        lightMode: "الوضع الفاتح",
        legal: "قانوني",
        privacy: "سياسة الخصوصية",
        terms: "شروط الخدمة",
        about: "حول",
        aboutApp: "حول DawaMZ",
        rate: "قيم التطبيق",
        share: "شارك التطبيق",
        version: "الإصدار",
        currentLang: "العربية",
      };
    } else if (language === "fr") {
      return {
        title: "Menu",
        settings: "Paramètres",
        language: "Langue",
        darkMode: "Mode sombre",
        lightMode: "Mode clair",
        legal: "Légal",
        privacy: "Politique de confidentialité",
        terms: "Conditions d'utilisation",
        about: "À propos",
        aboutApp: "À propos de DawaMZ",
        rate: "Évaluer l'application",
        share: "Partager l'application",
        version: "Version",
        currentLang: "Français",
      };
    } else {
      return {
        title: "Menu",
        settings: "Settings",
        language: "Language",
        darkMode: "Dark Mode",
        lightMode: "Light Mode",
        legal: "Legal",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
        about: "About",
        aboutApp: "About DawaMZ",
        rate: "Rate the App",
        share: "Share the App",
        version: "Version",
        currentLang: "English",
      };
    }
  };

  const text = getText();

  return (
    <SafeAreaView style={styles.screen_container}>
      <BackgroundBubbles />
      <Header />
      <ScrollView
        style={styles.content_container}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.section_header_row}>
            <Ionicons name="settings-outline" size={15} color="#2196F3" />
            <Text style={styles.section_header}>{text.settings}</Text>
          </View>
          <View style={styles.section_card}>
            <List.Item
              title={text.language}
              description={text.currentLang}
              titleStyle={styles.item_title}
              descriptionStyle={styles.item_description}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="language" size={22} color="#2196F3" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              )}
              onPress={() => handleNavigate("/(tabs)/menu/language")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={themeMode ? text.darkMode : text.lightMode}
              titleStyle={styles.item_title}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name={themeMode ? "moon-outline" : "sunny-outline"}
                    size={22}
                    color="#2196F3"
                  />
                </View>
              )}
              right={() => (
                <View style={styles.switch_wrapper}>
                  <Switch
                    value={themeMode}
                    onValueChange={setThemeMode}
                    color="#2196F3"
                  />
                </View>
              )}
              style={styles.list_item}
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <View style={styles.section_header_row}>
            <Ionicons name="scale-outline" size={15} color="#2196F3" />
            <Text style={styles.section_header}>{text.legal}</Text>
          </View>
          <View style={styles.section_card}>
            <List.Item
              title={text.privacy}
              titleStyle={styles.item_title}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={22}
                    color="#2196F3"
                  />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              )}
              onPress={() => handleNavigate("/(tabs)/menu/privacy")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.terms}
              titleStyle={styles.item_title}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="#2196F3"
                  />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              )}
              onPress={() => handleNavigate("/(tabs)/menu/terms")}
              style={styles.list_item}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.section_header_row}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color="#2196F3"
            />
            <Text style={styles.section_header}>{text.about}</Text>
          </View>
          <View style={styles.section_card}>
            <List.Item
              title={text.aboutApp}
              titleStyle={styles.item_title}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#2196F3"
                  />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              )}
              onPress={() => handleNavigate("/(tabs)/menu/about")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.rate}
              titleStyle={styles.item_title}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="star-outline" size={22} color="#2196F3" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              )}
              onPress={() => handleNavigate("/menu")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.share}
              titleStyle={styles.item_title}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="share-social-outline"
                    size={22}
                    color="#2196F3"
                  />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              )}
              onPress={() => handleNavigate("/menu")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.version}
              description="1.0.0"
              titleStyle={styles.item_title}
              descriptionStyle={styles.item_description}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#2196F3"
                  />
                </View>
              )}
              style={styles.list_item}
            />
          </View>
        </View>

        <View style={styles.footer_spacing} />
      </ScrollView>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    marginHorizontal: 10,
    marginBottom: -30,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  section_header_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  section_header: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2196F3",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  section_card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  list_item: {
    paddingLeft: 15,
  },
  item_title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a2e",
  },
  item_description: {
    fontSize: 12,
    color: "#aab0be",
    fontWeight: "500",
  },
  icon_wrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 0,
  },
  switch_wrapper: {
    // Add your styles
  },
  item_divider: {
    marginHorizontal: 20,
  },
  footer_spacing: {
    height: 40,
  },
});

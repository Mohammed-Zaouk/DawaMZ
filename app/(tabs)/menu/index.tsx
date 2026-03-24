import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { getLanguage } from "@/utils/getLanguage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Divider, List, Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Menu() {
  const [language, setLanguage] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<boolean>(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadLanguage();
    }, []),
  );

  const loadLanguage = async () => {
    const lang = await getLanguage();
    setLanguage(lang);
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
      <ScrollView style={styles.content_container}>
        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.section_header}>{text.settings} ⚙️</Text>
          <View style={styles.section_card}>
            <List.Item
              title={text.language}
              description={text.currentLang}
              left={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="translate" color="#2196F3" />
                </View>
              )}
              right={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="chevron-right" color="#999" />
                </View>
              )}
              onPress={() => router.push("/(tabs)/menu/language")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={themeMode ? text.darkMode : text.lightMode}
              left={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon
                    {...props}
                    icon={
                      themeMode ? "moon-waning-crescent" : "white-balance-sunny"
                    }
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
          <Text style={styles.section_header}>{text.legal} ⚖️</Text>
          <View style={styles.section_card}>
            <List.Item
              title={text.privacy}
              left={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="shield-account" color="#2196F3" />
                </View>
              )}
              right={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="chevron-right" color="#999" />
                </View>
              )}
              onPress={() => router.push("/(tabs)/menu/privacy")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.terms}
              left={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="file-document" color="#2196F3" />
                </View>
              )}
              right={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="chevron-right" color="#999" />
                </View>
              )}
              onPress={() => router.push("/(tabs)/menu/terms")}
              style={styles.list_item}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.section_header}>{text.about} ℹ️</Text>
          <View style={styles.section_card}>
            <List.Item
              title={text.aboutApp}
              left={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="information" color="#2196F3" />
                </View>
              )}
              right={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="chevron-right" color="#999" />
                </View>
              )}
              onPress={() => router.push("/(tabs)/menu/about")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.rate}
              left={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="star" color="#2196F3" />
                </View>
              )}
              right={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="chevron-right" color="#999" />
                </View>
              )}
              onPress={() => router.push("/menu")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.share}
              left={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="share-variant" color="#2196F3" />
                </View>
              )}
              right={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon {...props} icon="chevron-right" color="#999" />
                </View>
              )}
              onPress={() => router.push("/menu")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.version}
              description="1.0.0"
              left={(props) => (
                <View style={styles.icon_wrapper}>
                  <List.Icon
                    {...props}
                    icon="information-outline"
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
    backgroundColor: "#f0f0f0",
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
  section_header: {
    marginBottom: 10,
  },
  section_card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  list_item: {
    // Add your styles
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
    // Add your styles
  },
  footer_spacing: {
    height: 40,
  },
});

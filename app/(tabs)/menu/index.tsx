import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useRef } from "react";
import {
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Divider, List, Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Menu() {
  const { language } = useLanguage();
  const { theme, isDark, setTheme } = useTheme();
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

  const handleLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  const APP_URL =
    "https://play.google.com/store/apps/details?id=com.dawamzsorganization.dawamz";

  const PLAY_STORE_URL = "market://details?id=com.dawamzsorganization.dawamz";
  const PLAY_STORE_FALLBACK =
    "https://play.google.com/store/apps/details?id=com.dawamzsorganization.dawamz";

  const handleRate = () => {
    Linking.canOpenURL(PLAY_STORE_URL)
      .then((supported) =>
        Linking.openURL(supported ? PLAY_STORE_URL : PLAY_STORE_FALLBACK),
      )
      .catch((err) => console.error("Failed to open store:", err));
  };

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const handleShare = async () => {
    const shareMessages: Record<string, string> = {
      ar: `اكتشف DawaMZ، التطبيق الذي يساعدك على إيجاد صيدلية المناوبة بسهولة!\n${APP_URL}`,
      fr: `Découvrez DawaMZ, l'app pour trouver facilement une pharmacie de garde !\n${APP_URL}`,
      en: `Check out DawaMZ, the app to easily find on-call pharmacies near you!\n${APP_URL}`,
    };
    try {
      await Share.share({
        message: shareMessages[language] ?? shareMessages.en,
        url: APP_URL, // iOS only — shows a separate URL preview
      });
    } catch (err) {
      console.error("Share error:", err);
    }
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
        website: "زيارة موقعنا",
        rate: "قيم التطبيق",
        share: "شارك التطبيق",
        version: "الإصدار",
        currentLang: "العربية",
        contact: "تواصل معنا",
        email: "راسلنا عبر البريد",
        instagram: "انستغرام",
        facebook: "فيسبوك",
        whatsapp: "واتساب",
        suggestions: "اقتراحات",
        suggestPharmacy: "اقتراح صيدلية",
        suggestPharmacyDesc: "أضف صيدلية غير مدرجة",
        suggestCity: "اقتراح مدينة",
        suggestCityDesc: "اطلب إضافة مدينة جديدة",
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
        website: "Visiter notre site",
        rate: "Évaluer l'application",
        share: "Partager l'application",
        version: "Version",
        currentLang: "Français",
        contact: "Contactez-nous",
        email: "Envoyer un e-mail",
        instagram: "Instagram",
        facebook: "Facebook",
        whatsapp: "WhatsApp",
        suggestions: "Suggestions",
        suggestPharmacy: "Suggérer une pharmacie",
        suggestPharmacyDesc: "Ajouter une pharmacie manquante",
        suggestCity: "Suggérer une ville",
        suggestCityDesc: "Demander l'ajout d'une nouvelle ville",
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
        website: "Visit our Website",
        rate: "Rate the App",
        share: "Share the App",
        version: "Version",
        currentLang: "English",
        contact: "Contact Us",
        email: "Send us an Email",
        instagram: "Instagram",
        facebook: "Facebook",
        whatsapp: "WhatsApp",
        suggestions: "Suggestions",
        suggestPharmacy: "Suggest a Pharmacy",
        suggestPharmacyDesc: "Add a pharmacy that's not listed",
        suggestCity: "Suggest a City",
        suggestCityDesc: "Request a new city to be added",
      };
    }
  };

  const text = getText();

  return (
    <SafeAreaView
      style={[styles.screen_container, { backgroundColor: theme.screenBg }]}
    >
      <BackgroundBubbles />
      <Header />
      <ScrollView
        style={[styles.content_container, { backgroundColor: theme.contentBg }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.section_header_row}>
            <Ionicons
              name="settings-outline"
              size={15}
              color={theme.sectionHeader}
            />
            <Text
              style={[styles.section_header, { color: theme.sectionHeader }]}
            >
              {text.settings}
            </Text>
          </View>
          <View
            style={[
              styles.section_card,
              { backgroundColor: theme.sectionCard },
            ]}
          >
            <List.Item
              title={text.language}
              description={text.currentLang}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              descriptionStyle={[
                styles.item_description,
                { color: theme.itemDescription },
              ]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="language" size={22} color="#2196F3" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() => handleNavigate("/(tabs)/menu/language")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={isDark ? text.darkMode : text.lightMode}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name={isDark ? "moon-outline" : "sunny-outline"}
                    size={22}
                    color="#2196F3"
                  />
                </View>
              )}
              right={() => (
                <Switch
                  value={isDark}
                  onValueChange={(val) => setTheme(val ? "dark" : "light")}
                  color="#2196F3"
                />
              )}
              style={styles.list_item}
            />
          </View>
        </View>

        {/* Suggestions Section */}
        <View style={styles.section}>
          <View style={styles.section_header_row}>
            <Ionicons
              name="bulb-outline"
              size={15}
              color={theme.sectionHeader}
            />
            <Text
              style={[styles.section_header, { color: theme.sectionHeader }]}
            >
              {text.suggestions}
            </Text>
          </View>
          <View
            style={[
              styles.section_card,
              { backgroundColor: theme.sectionCard },
            ]}
          >
            <List.Item
              title={text.suggestPharmacy}
              description={text.suggestPharmacyDesc}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              descriptionStyle={[
                styles.item_description,
                { color: theme.itemDescription },
              ]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="medkit-outline" size={22} color="#2196F3" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() => handleNavigate("/(tabs)/menu/pharmacy_suggestion")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.suggestCity}
              description={text.suggestCityDesc}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              descriptionStyle={[
                styles.item_description,
                { color: theme.itemDescription },
              ]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="location-outline" size={22} color="#2196F3" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() => handleNavigate("/(tabs)/menu/city_suggestion")}
              style={styles.list_item}
            />
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <View style={styles.section_header_row}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={15}
              color={theme.sectionHeader}
            />
            <Text
              style={[styles.section_header, { color: theme.sectionHeader }]}
            >
              {text.contact}
            </Text>
          </View>
          <View
            style={[
              styles.section_card,
              { backgroundColor: theme.sectionCard },
            ]}
          >
            <List.Item
              title={text.email}
              description="contact@dawamz.com"
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              descriptionStyle={[
                styles.item_description,
                { color: theme.itemDescription },
              ]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="mail-outline" size={22} color="#2196F3" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() => handleLink("mailto:contact@dawamz.com")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.whatsapp}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() => handleLink("https://wa.me/212659911786")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.instagram}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="logo-instagram" size={22} color="#E1306C" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() => handleLink("https://www.instagram.com/dawa.mz/")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.facebook}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="logo-facebook" size={22} color="#1877F2" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() =>
                handleLink(
                  "https://www.facebook.com/people/DawaMZ/61589490633245/",
                )
              }
              style={styles.list_item}
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <View style={styles.section_header_row}>
            <Ionicons
              name="scale-outline"
              size={15}
              color={theme.sectionHeader}
            />
            <Text
              style={[styles.section_header, { color: theme.sectionHeader }]}
            >
              {text.legal}
            </Text>
          </View>
          <View
            style={[
              styles.section_card,
              { backgroundColor: theme.sectionCard },
            ]}
          >
            <List.Item
              title={text.privacy}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
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
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() => handleNavigate("/(tabs)/menu/privacy")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.terms}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
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
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
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
              color={theme.sectionHeader}
            />
            <Text
              style={[styles.section_header, { color: theme.sectionHeader }]}
            >
              {text.about}
            </Text>
          </View>
          <View
            style={[
              styles.section_card,
              { backgroundColor: theme.sectionCard },
            ]}
          >
            <List.Item
              title={text.aboutApp}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
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
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() => handleNavigate("/(tabs)/menu/about")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            {/* Website Item */}
            <List.Item
              title={text.website}
              description="www.dawamz.com"
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              descriptionStyle={[
                styles.item_description,
                { color: theme.itemDescription },
              ]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="globe-outline" size={22} color="#2196F3" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="open-outline"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={() => handleLink("https://www.dawamz.com")}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.rate}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              left={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons name="star-outline" size={22} color="#2196F3" />
                </View>
              )}
              right={() => (
                <View style={styles.icon_wrapper}>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={handleRate}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.share}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
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
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.chevron}
                  />
                </View>
              )}
              onPress={handleShare}
              style={styles.list_item}
            />
            <Divider style={styles.item_divider} />
            <List.Item
              title={text.version}
              description={appVersion}
              titleStyle={[styles.item_title, { color: theme.itemTitle }]}
              descriptionStyle={[
                styles.item_description,
                { color: theme.itemDescription },
              ]}
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
  // Screen
  screen_container: {
    flex: 1,
    gap: 50,
  },

  // ScrollView
  content_container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    marginHorizontal: 10,
    marginBottom: -30,
  },

  // Section
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
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  section_card: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },

  // List items
  list_item: {
    paddingLeft: 15,
  },
  item_title: {
    fontSize: 15,
    fontWeight: "600",
  },
  item_description: {
    fontSize: 12,
    fontWeight: "500",
  },
  icon_wrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 0,
  },
  item_divider: {
    marginHorizontal: 20,
  },

  // Footer
  footer_spacing: {
    height: 40,
  },
});

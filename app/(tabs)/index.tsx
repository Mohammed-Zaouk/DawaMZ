import BackgroundBubbles from "@/components/background_bubbles";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { getUserLocation } from "@/utils/location/getLocation";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Divider from "../../components/divider_line";

export default function Index() {
  const router = useRouter();
  const { language } = useLanguage();
  const { theme } = useTheme();

  const navigating = useRef(false);

  const withGuard = (action: () => void) => {
    if (navigating.current) return;
    navigating.current = true;
    action();
    setTimeout(() => {
      navigating.current = false;
    }, 500);
  };

  const mapRedirect = async () => {
    if (navigating.current) return;
    navigating.current = true;
    try {
      const loc = await getUserLocation();
      if (loc) {
        router.push({
          pathname: "/maps/auto-map",
          params: { latitude: loc.latitude, longitude: loc.longitude },
        });
      } else {
        Alert.alert(text.alertTitle, text.alertMessage, [
          { text: text.alertButton },
        ]);
      }
    } finally {
      setTimeout(() => {
        navigating.current = false;
      }, 500);
    }
  };

  const handleNavigate = () => {
    withGuard(() => router.push("/(tabs)/search/search_index"));
  };

  const getText = () => {
    if (language === "ar") {
      return {
        title: "ابحث عن الصيدليات",
        subtitle: "صيدليات المناوبة - صيدليات الليل...إلخ",
        autoTitle: "البحث التلقائي",
        autoSubtitle: "يبحث تلقائياً عن الصيدليات القريبة منك",
        manualTitle: "البحث اليدوي",
        manualSubtitle: "البحث حسب المنطقة/المدينة",
        autoBadge: "Auto",
        alertTitle: "الموقع مطلوب",
        alertMessage:
          "يرجى اعطاء صلاحيات الوصول للموقع لاستخدام البحث التلقائي.",
        alertButton: "حسناً",
      };
    } else if (language === "fr") {
      return {
        title: "Rechercher des pharmacies",
        subtitle: "Pharmacies de garde - Pharmacies de nuit...etc",
        autoTitle: "Recherche automatique",
        autoSubtitle: "Recherche automatiquement les pharmacies près de vous",
        manualTitle: "Recherche manuelle",
        manualSubtitle: "Rechercher par région/ville",
        autoBadge: "Auto",
        alertTitle: "Localisation requise",
        alertMessage:
          "Veuillez donner les permissions d'accès à la localisation pour utiliser la recherche automatique.",
        alertButton: "OK",
      };
    } else {
      return {
        title: "Search for pharmacies",
        subtitle: "On-call pharmacies - Night pharmacies...etc",
        autoTitle: "Auto Search",
        autoSubtitle: "It automatically searches for pharmacies near you",
        manualTitle: "Manual search",
        manualSubtitle: "Search by region/city",
        autoBadge: "Auto",
        alertTitle: "Location Required",
        alertMessage:
          "Please grant location access permissions to use automatic search.",
        alertButton: "OK",
      };
    }
  };

  const text = getText();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.screenBg }]}
    >
      <BackgroundBubbles />

      {/* Logo */}
      <View style={styles.logo_section}>
        <Image
          source={require("../../assets/images/logo/logo.png")}
          style={styles.logo_image}
        />
        <Text style={styles.logo_title} numberOfLines={1} ellipsizeMode="tail">
          DawaMZ
        </Text>
      </View>

      {/* Header */}
      <View style={styles.header_section}>
        <View style={[styles.side_line, { backgroundColor: theme.sideLine }]} />
        <View style={styles.header_text}>
          <Text
            style={[styles.page_title, { color: theme.pageTitle }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text.title}
          </Text>
          <Text
            style={[styles.page_subtitle, { color: theme.pageSubtitle }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text.subtitle}
          </Text>
        </View>
        <View style={[styles.side_line, { backgroundColor: theme.sideLine }]} />
      </View>

      {/* Search Cards */}
      <View style={styles.cards_container}>
        {/* Auto Search */}
        <TouchableOpacity onPress={mapRedirect} activeOpacity={0.85}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View
              style={[
                styles.icon_container,
                { backgroundColor: theme.cardIcon },
              ]}
            >
              <Ionicons
                name="locate"
                size={28}
                color="#2196F3"
                style={{ padding: 7 }}
              />
            </View>
            <View style={styles.card_text}>
              <View style={styles.title_row}>
                <Text
                  style={[styles.card_title, { color: theme.text }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {text.autoTitle}
                </Text>
                <View style={styles.auto_badge}>
                  <View style={styles.badge_dot} />
                  <Text style={styles.badge_text}>{text.autoBadge}</Text>
                </View>
              </View>
              <Divider style={{ marginVertical: 3 }} />
              <Text
                style={[styles.card_subtitle, { color: theme.subtext }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {text.autoSubtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.chevron} />
          </View>
        </TouchableOpacity>

        {/* Manual Search */}
        <TouchableOpacity onPress={handleNavigate} activeOpacity={0.85}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View
              style={[
                styles.icon_container,
                { backgroundColor: theme.cardIcon },
              ]}
            >
              <Ionicons
                name="map-outline"
                size={26}
                color="#2196F3"
                style={{ padding: 7 }}
              />
            </View>
            <View style={styles.card_text}>
              <Text style={[styles.card_title, { color: theme.text }]}>
                {text.manualTitle}
              </Text>
              <Divider style={{ marginVertical: 3 }} />
              <Text style={[styles.card_subtitle, { color: theme.subtext }]}>
                {text.manualSubtitle}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.chevron} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // SafeAreaView
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    gap: 30,
  },

  // Logo
  logo_section: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 50,
  },
  logo_image: {
    width: 180,
    height: 170,
    marginBottom: -55,
  },
  logo_title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Header
  header_section: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  side_line: {
    height: 1,
    flex: 1,
  },
  header_text: {
    alignItems: "center",
  },
  page_title: {
    fontSize: 21,
    fontWeight: "semibold",
    textAlign: "center",
  },
  page_subtitle: {
    fontSize: 13,
    textAlign: "center",
    opacity: 0.85,
  },

  // Cards
  cards_container: {
    width: "100%",
    gap: 15,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    height: 90,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 18,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon_container: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  card_text: {
    flex: 1,
    justifyContent: "center",
  },
  title_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },
  card_title: {
    fontSize: 15,
    fontWeight: "700",
  },
  card_subtitle: {
    fontSize: 12,
    lineHeight: 17,
  },
  auto_badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  badge_dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#43A047",
  },
  badge_text: {
    color: "#43A047",
    fontSize: 11,
    fontWeight: "700",
  },
});

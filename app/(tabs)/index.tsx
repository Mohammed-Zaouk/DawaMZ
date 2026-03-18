import { getLanguage } from "@/utils/getLanguage";
import { getUserLocation } from "@/utils/location/getLocation";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
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
  const [language, setLanguage] = useState<string | null>();
  useFocusEffect(
    useCallback(() => {
      loadLanguage();
    }, []),
  );
  const loadLanguage = async () => {
    const lang = await getLanguage();
    setLanguage(lang);
  };
  const mapRedirect = async () => {
    const loc = await getUserLocation();
    if (loc) {
      router.push({
        pathname: "/(tabs)/search/maps/auto-map",
        params: {
          latitude: loc.latitude,
          longitude: loc.longitude,
        },
      });
    } else {
      Alert.alert(
        "Location Required",
        "Please enable location permissions to use auto search.",
        [{ text: "OK" }],
      );
    }
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
      };
    }
  };

  const text = getText();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen_container}>
      <View style={styles.logo_section}>
        <Image
          source={require("../../assets/images/logo/logo.png")}
          style={styles.logo_image}
        />
        <Text style={styles.logo_title}>DawaMZ</Text>
      </View>
      <View style={styles.header_section}>
        <Text style={styles.page_title}>{text.title}</Text>
        <Divider />
        <Text style={styles.page_subtitle}>{text.subtitle}</Text>
      </View>
      <View style={styles.search_cards_container}>
        <TouchableOpacity onPress={mapRedirect}>
          <View style={styles.search_card}>
            <View style={styles.tag_container}>
              <Ionicons
                name="location"
                size={32}
                color="#333"
                style={{ padding: 5 }}
              />
            </View>

            <View style={styles.card_text_section}>
              <Text style={styles.card_title}>{text.autoTitle}</Text>
              <Divider style={{ marginVertical: 3 }} />
              <Text style={styles.card_subtitle}>{text.autoSubtitle}</Text>
            </View>

            <View style={styles.auto_badge}>
              <Text style={styles.badge_text}>{text.autoBadge}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/search/search_index")}
        >
          <View style={styles.search_card}>
            <View style={styles.tag_container}>
              <Ionicons
                name="map"
                size={32}
                color="#333"
                style={{ padding: 5 }}
              />
            </View>

            <View style={styles.card_text_section}>
              <Text style={styles.card_title}>{text.manualTitle}</Text>
              <Divider style={{ marginVertical: 3 }} />
              <Text style={styles.card_subtitle}>{text.manualSubtitle}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    gap: 30,
  },
  logo_section: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 60,
  },
  logo_image: {
    width: 214,
    height: 201,
    marginBottom: -55,
  },
  logo_title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: "System",
  },
  header_section: {
    // Add your styles
  },
  page_title: {
    fontSize: 23,
    fontWeight: "semibold",
    color: "#EAF3FF",
    textAlign: "center",
  },
  page_subtitle: {
    fontSize: 14,
    color: "#D9DEE3",
    textAlign: "center",
    opacity: 0.85,
  },
  search_cards_container: {
    width: "100%",
    gap: 20,
  },
  search_card: {
    flexDirection: "row",
    alignItems: "center",
    height: 90,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card_text_section: {
    justifyContent: "center",
    flex: 1,
  },
  card_title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E1E1E",
    marginBottom: 4,
  },
  card_subtitle: {
    fontSize: 12,
    color: "#666666",
  },
  auto_badge: {
    backgroundColor: "#4CAF50",
    position: "absolute",
    right: 0,
    top: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  badge_text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  tag_container: {
    borderRadius: 100,
    backgroundColor: "#8EBEF4",
  },
});

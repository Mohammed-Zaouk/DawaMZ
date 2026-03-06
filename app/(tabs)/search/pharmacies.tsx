import Divider from "@/components/divider_line";
import { pharmaciesByCity } from "@/data/pharmacies";
import { getLanguage } from "@/utils/getLanguage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

function PulseDot({ color }: { color: string }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [opacity]);
  return (
    <Animated.View
      style={[styles.pulse_dot, { backgroundColor: color, opacity }]}
    />
  );
}

export default function PharmaciesPage() {
  const [searchPharmacie, setSearchPharmacie] = useState("");
  const [language, setLanguage] = useState<string | null>(null);
  const { cityId } = useLocalSearchParams();
  const pharmacies = pharmaciesByCity[cityId as string] || [];

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const lang = await getLanguage();
    setLanguage(lang);
  };

  return (
    <SafeAreaView style={styles.screen_container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchPharmacie}
        style={styles.search_bar}
        value={searchPharmacie}
      />
      <FlatList
        data={pharmacies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardItem
            id={item.id}
            nameAr={item.nameAr}
            name={item.name}
            addressAr={item.addressAr}
            address={item.address}
            phone={item.phone}
            open={item.open}
            language={language}
          />
        )}
        contentContainerStyle={styles.list_container}
      />
    </SafeAreaView>
  );
}

function CardItem({
  id,
  nameAr,
  name,
  addressAr,
  address,
  phone,
  open,
  language,
}: {
  id: string;
  nameAr: string;
  name: string;
  addressAr: string;
  address: string;
  phone: string;
  open: boolean;
  language: string | null;
}) {
  const getText = () => {
    if (language === "ar") {
      return {
        openBadge: "مفتوح الآن",
        closedBadge: "مغلقة",
        directionsButton: "عرض الاتجاهات ‹",
        locationButton: "عرض الموقع ‹",
      };
    } else if (language === "fr") {
      return {
        openBadge: "Ouvert maintenant",
        closedBadge: "Fermé",
        directionsButton: "Itinéraire ›",
        locationButton: "Localisation ›",
      };
    } else {
      return {
        openBadge: "Open now",
        closedBadge: "Closed",
        directionsButton: "Directions ›",
        locationButton: "Location ›",
      };
    }
  };

  const text = getText();

  return (
    <View style={styles.card}>
      <View style={styles.card_content}>
        <View style={styles.card_header}>
          <View style={styles.badge_container}>
            <PulseDot color={open ? "#22c55e" : "#ef4444"} />
            <Text style={open ? styles.badge_open : styles.badge_closed}>
              {open ? text.openBadge : text.closedBadge}
            </Text>
          </View>
          <Text
            style={styles.card_title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {language === "ar" ? nameAr : name}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.info_container}>
          <View style={styles.info_row}>
            <Text style={styles.info_text}>
              {language === "ar" ? addressAr : address}
            </Text>
            <Ionicons name="location-outline" size={15} color="#828282" />
          </View>
          <View style={styles.info_row}>
            <Text style={styles.info_text}>{phone}</Text>
            <Ionicons name="call-outline" size={15} color="#828282" />
          </View>
        </View>

        <View style={styles.button_container}>
          <TouchableOpacity
            onPress={() => console.log("directions")}
            style={styles.card_button}
          >
            <Text style={styles.button_text}>{text.directionsButton}</Text>
            <Ionicons name="walk-outline" size={15} color="#3385FF" />
          </TouchableOpacity>
          <View style={styles.upward_divider} />
          <TouchableOpacity
            onPress={() => console.log("location")}
            style={styles.card_button}
          >
            <Text style={styles.button_text}>{text.locationButton}</Text>
            <Ionicons name="location-outline" size={15} color="#3385FF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Screen
  screen_container: {
    flex: 1,
    backgroundColor: "#2196F3",
    gap: 20,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  search_bar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
  },
  list_container: {
    gap: 15,
  },
  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  card_content: {
    flex: 1,
  },
  card_header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card_title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#274796",
    textAlign: "right",
    writingDirection: "rtl",
    flex: 1,
    marginLeft: 8,
  },
  // Badge
  badge_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  pulse_dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badge_open: {
    color: "#22c55e",
    fontSize: 12,
  },
  badge_closed: {
    color: "#ef4444",
    fontSize: 12,
  },
  divider: {
    marginVertical: 5,
  },
  // Info
  info_container: {
    gap: 4,
  },
  info_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  info_text: {
    fontSize: 15,
    color: "#828282",
    textAlign: "right",
    writingDirection: "rtl",
  },
  // Buttons
  button_container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    marginTop: 10,
    height: 44,
  },
  upward_divider: {
    backgroundColor: "#DADADA",
    width: 1,
    height: 30,
  },
  card_button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  button_text: {
    fontSize: 13,
    color: "#3385FF",
  },
});

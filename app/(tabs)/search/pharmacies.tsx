import BackgroundBubbles from "@/components/background_bubbles";
import Divider from "@/components/divider_line";
import { PulseDot } from "@/components/pulse_dot";
import { useLanguage } from "@/context/LanguageContext";
import { pharmaciesByCity } from "@/data/pharmacies";
import {
  calculateDistance,
  formatDistance,
} from "@/utils/location/calculateDistance";
import { getUserLocation } from "@/utils/location/getLocation";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PharmaciesPage() {
  const [searchParmacy, setSearchParmacy] = useState("");
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const { cityId, cityName, cityNameAr } = useLocalSearchParams();
  const pharmacies = pharmaciesByCity[cityId as string] || [];
  const [pharmaciesWithDistance, setPharmaciesWithDistance] =
    useState<((typeof pharmacies)[0] & { distance?: number })[]>(pharmacies);

  useEffect(() => {
    calcDistance();
  }, []);

  const calcDistance = async () => {
    const loc = await getUserLocation();
    if (loc) {
      const updated = pharmacies
        .map((pharmacy) => ({
          ...pharmacy,
          distance: calculateDistance(
            loc.latitude,
            loc.longitude,
            pharmacy.latitude,
            pharmacy.longitude,
          ),
        }))
        .sort((a, b) => a.distance - b.distance);
      setPharmaciesWithDistance(updated);
    }
  };

  const getText = () => {
    if (language === "ar") {
      return {
        openBadge: "مفتوح الآن",
        closedBadge: "مغلقة",
        directionsButton: "عرض الاتجاهات",
        locationButton: "عرض الموقع",
        filterAll: "الكل",
        filterNight: "ليلية",
        filterOnCall: "في الخدمة",
        distance: "المسافة",
        locationPermission: "يرجى تفعيل الموقع لعرض المسافة",
        search: "ابحث عن صيدلية...",
      };
    } else if (language === "fr") {
      return {
        openBadge: "Ouvert maintenant",
        closedBadge: "Fermé",
        directionsButton: "Itinéraire",
        locationButton: "Localisation",
        filterAll: "Toutes",
        filterNight: "Nuit",
        filterOnCall: "De garde",
        distance: "Distance",
        locationPermission:
          "Veuillez activer la localisation pour voir la distance",
        search: "Rechercher une pharmacie...",
      };
    } else {
      return {
        openBadge: "Open now",
        closedBadge: "Closed",
        directionsButton: "Directions",
        locationButton: "Location",
        filterAll: "All",
        filterNight: "Night",
        filterOnCall: "On Call",
        distance: "Distance",
        locationPermission: "Please enable location to see distance",
        search: "Search pharmacies...",
      };
    }
  };

  const text = getText();

  const filteredPharmacies = pharmaciesWithDistance.filter((pharmacy) => {
    if (activeFilter === "all") return true;
    else if (activeFilter === "night") return pharmacy.isNightPharmacy === true;
    else return pharmacy.isOnCall === true;
  });

  const filterData = filteredPharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchParmacy.toLowerCase()) ||
      pharmacy.nameAr.includes(searchParmacy),
  );

  return (
    <SafeAreaView style={styles.screen_container}>
      <BackgroundBubbles />
      <Searchbar
        placeholder={text.search}
        onChangeText={setSearchParmacy}
        value={searchParmacy}
        style={styles.search_bar}
        iconColor="#2196F3"
        placeholderTextColor="#a0b4c8"
        inputStyle={{ color: "#1a3a6e", fontSize: 16, paddingBottom: 9 }}
      />
      <View style={styles.filter_bar_wrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filter_bar}
        >
          <Button
            mode="contained"
            onPress={() => setActiveFilter("all")}
            style={[
              styles.filter_button,
              activeFilter === "all" && styles.filter_button_active,
            ]}
            textColor={activeFilter === "all" ? "#FFFFFF" : "#1A73E8"}
            buttonColor={activeFilter === "all" ? "#1A73E8" : "#FFFFFF"}
            icon={() => (
              <Ionicons
                name="grid-outline"
                size={16}
                color={activeFilter === "all" ? "#FFFFFF" : "#1A73E8"}
              />
            )}
          >
            {text.filterAll}
          </Button>
          <Button
            mode="contained"
            onPress={() => setActiveFilter("night")}
            style={[
              styles.filter_button,
              activeFilter === "night" && styles.filter_button_active,
            ]}
            textColor={activeFilter === "night" ? "#FFFFFF" : "#1A73E8"}
            buttonColor={activeFilter === "night" ? "#1A73E8" : "#FFFFFF"}
            icon={() => (
              <Ionicons
                name="moon-outline"
                size={16}
                color={activeFilter === "night" ? "#FFFFFF" : "#1A73E8"}
              />
            )}
          >
            {text.filterNight}
          </Button>
          <Button
            mode="contained"
            onPress={() => setActiveFilter("oncall")}
            style={[
              styles.filter_button,
              activeFilter === "oncall" && styles.filter_button_active,
            ]}
            textColor={activeFilter === "oncall" ? "#FFFFFF" : "#1A73E8"}
            buttonColor={activeFilter === "oncall" ? "#1A73E8" : "#FFFFFF"}
            icon={() => (
              <Ionicons
                name="call-outline"
                size={16}
                color={activeFilter === "oncall" ? "#FFFFFF" : "#1A73E8"}
              />
            )}
          >
            {text.filterOnCall}
          </Button>
        </ScrollView>
      </View>
      <FlatList
        data={filterData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardItem
            id={item.id}
            nameAr={item.nameAr}
            name={item.name}
            cityId={cityId as string}
            cityName={cityName as string}
            cityNameAr={cityNameAr as string}
            addressAr={item.addressAr}
            address={item.address}
            phone={item.phone}
            open={item.open}
            dutyStart={item.dutyStart}
            dutyEnd={item.dutyEnd}
            distance={item.distance}
            language={language}
            text={text}
          />
        )}
        contentContainerStyle={styles.list_container}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function CardItem({
  id,
  nameAr,
  name,
  cityId,
  cityName,
  cityNameAr,
  addressAr,
  address,
  phone,
  open,
  dutyStart,
  dutyEnd,
  distance,
  language,
  text,
}: {
  id: string;
  nameAr: string;
  name: string;
  cityId: string;
  cityName: string;
  cityNameAr: string;
  addressAr: string;
  address: string;
  phone: string;
  open: boolean;
  dutyStart: string;
  dutyEnd: string;
  distance?: number;
  language: string | null;
  text: any;
}) {
  const router = useRouter();

  const mapRedirect = async () => {
    const loc = await getUserLocation();
    if (loc) {
      router.push({ pathname: "/maps/pharmacy-direction" });
    } else {
      Alert.alert(
        "Location Required",
        "Please enable location permissions to use auto search.",
        [{ text: "OK" }],
      );
    }
  };

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
            <Text
              style={styles.info_text}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {language === "ar" ? addressAr : address}
            </Text>
            <View style={styles.info_icon_wrap}>
              <Ionicons name="location-outline" size={13} color="#3385FF" />
            </View>
          </View>
          <View style={styles.info_row}>
            <Text
              style={styles.info_text}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {phone}
            </Text>
            <View style={styles.info_icon_wrap}>
              <Ionicons name="call-outline" size={13} color="#3385FF" />
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.info_row}>
            <Text
              style={styles.info_text}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {distance !== undefined
                ? formatDistance(distance)
                : text.locationPermission}
            </Text>
            <View style={styles.info_icon_wrap}>
              <Ionicons name="walk-outline" size={13} color="#3385FF" />
            </View>
          </View>
          <View style={styles.info_row}>
            <Text
              style={styles.info_text}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {dutyStart} -- {dutyEnd}
            </Text>
            <View style={styles.info_icon_wrap}>
              <Ionicons name="calendar-outline" size={13} color="#3385FF" />
            </View>
          </View>
        </View>

        <View style={styles.button_container}>
          <TouchableOpacity onPress={mapRedirect} style={styles.card_button}>
            <Ionicons name="navigate-outline" size={14} color="#3385FF" />
            <Text style={styles.button_text}>{text.directionsButton}</Text>
          </TouchableOpacity>
          <View style={styles.upward_divider} />
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/maps/pharmacy-location",
                params: {
                  pharmacyId: id,
                  cityId: cityId,
                  distance: distance,
                  cityName: cityName,
                  cityNameAr: cityNameAr,
                },
              })
            }
            style={styles.card_button}
          >
            <Ionicons name="map-outline" size={14} color="#3385FF" />
            <Text style={styles.button_text}>{text.locationButton}</Text>
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
    gap: 15,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  search_bar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "rgba(33, 150, 243, 0.2)",
  },
  // Filter
  filter_bar_wrapper: {
    height: 50,
  },
  filter_bar: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  filter_button: {
    borderRadius: 50,
    borderWidth: 1.5,
  },
  filter_button_active: {
    borderColor: "#1A73E8",
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
    fontSize: 17.3,
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
  badge_open: {
    color: "#22c55e",
    fontSize: 11.5,
  },
  badge_closed: {
    color: "#ef4444",
    fontSize: 11.5,
  },
  divider: {
    marginVertical: 7,
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
  info_icon_wrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
  },
  // Buttons
  button_container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#F0F6FF",
    borderRadius: 12,
    marginTop: 10,
    height: 44,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  upward_divider: {
    backgroundColor: "#DBEAFE",
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

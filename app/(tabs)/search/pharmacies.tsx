import BackgroundBubbles from "@/components/background_bubbles";
import Divider from "@/components/divider_line";
import { PulseDot } from "@/components/pulse_dot";
import { useLanguage } from "@/context/LanguageContext";
import {
  calculateDistance,
  formatDistance,
} from "@/utils/location/calculateDistance";
import { getUserLocation } from "@/utils/location/getLocation";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

type TimeRange = { open: string; close: string };
type DaySchedule = TimeRange[] | null;
type Schedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

type Pharmacy = {
  id: string;
  name: string;
  name_ar: string;
  address: string;
  address_ar: string;
  phone: string;
  latitude: number;
  longitude: number;
  open: boolean;
  rating?: number;
  is_night_pharmacy?: boolean;
  is_on_call?: boolean;
  duty_start: string;
  duty_end: string;
  schedule: Schedule | null;
  distance?: number;
};

export default function PharmaciesPage() {
  const [searchParmacy, setSearchParmacy] = useState("");
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const { cityId, cityName, cityNameAr } = useLocalSearchParams();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [pharmaciesWithDistance, setPharmaciesWithDistance] = useState<
    Pharmacy[]
  >([]);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pharmacies")
      .select("*")
      .eq("city_id", cityId);

    if (error) {
      console.error("Failed to fetch pharmacies:", error.message);
      setLoading(false);
      return;
    }

    setPharmacies(data ?? []);
    await calcDistance(data ?? []);
    setLoading(false);
  };

  const calcDistance = async (data: Pharmacy[]) => {
    const loc = await getUserLocation();
    if (loc) {
      const updated = data
        .map((pharmacy) => ({
          ...pharmacy,
          distance: calculateDistance(
            loc.latitude,
            loc.longitude,
            pharmacy.latitude,
            pharmacy.longitude,
          ),
        }))
        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
      setPharmaciesWithDistance(updated);
    } else {
      setPharmaciesWithDistance(data);
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
        noResults: "لا توجد صيدليات مطابقة",
        noResultsSub: "متأكد من الاسم؟ اقترحها لإضافتها.",
        suggestButton: "اقتراح صيدلية",
        noData: "لا توجد صيدليات مفتوحة",
        noDataSub: "لا توجد صيدليات مفتوحة حالياً في هذه المدينة",
        noNightData: "لا توجد صيدليات ليلية مفتوحة",
        noNightDataSub: "لا توجد صيدليات ليلية مفتوحة حالياً في هذه المدينة",
        noOnCallData: "لا توجد صيدليات مناوبة مفتوحة",
        noOnCallDataSub: "لا توجد صيدليات مناوبة مفتوحة حالياً في هذه المدينة",
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
        noResults: "Aucune pharmacie trouvée",
        noResultsSub: "Vous êtes sûr du nom ? Suggérez-la pour l'ajouter.",
        suggestButton: "Suggérer une pharmacie",
        noData: "Aucune pharmacie ouverte",
        noDataSub:
          "Aucune pharmacie n'est ouverte en ce moment dans cette ville",
        noNightData: "Aucune pharmacie de nuit ouverte",
        noNightDataSub:
          "Aucune pharmacie de nuit n'est ouverte en ce moment dans cette ville",
        noOnCallData: "Aucune pharmacie de garde ouverte",
        noOnCallDataSub:
          "Aucune pharmacie de garde n'est ouverte en ce moment dans cette ville",
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
        noResults: "No pharmacies found",
        noResultsSub: "Sure of the name? Tap below to suggest adding it.",
        suggestButton: "Suggest a Pharmacy",
        noData: "No open pharmacies",
        noDataSub: "No pharmacies are currently open in this city",
        noNightData: "No open night pharmacies",
        noNightDataSub: "No night pharmacies are currently open in this city",
        noOnCallData: "No open on-call pharmacies",
        noOnCallDataSub:
          "No on-call pharmacies are currently open in this city",
      };
    }
  };

  const text = getText();

  const filteredPharmacies = pharmaciesWithDistance.filter((pharmacy) => {
    if (activeFilter === "night") return pharmacy.is_night_pharmacy === true;
    else if (activeFilter === "oncall") return pharmacy.is_on_call === true;
    return pharmacy.open === true;
  });

  const filterData = filteredPharmacies.filter(
    (pharmacy) =>
      pharmacy.name.toLowerCase().includes(searchParmacy.toLowerCase()) ||
      pharmacy.name_ar.includes(searchParmacy),
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.screen_container, styles.loading_container]}>
        <BackgroundBubbles />
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

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
            nameAr={item.name_ar}
            name={item.name}
            cityName={cityName as string}
            cityNameAr={cityNameAr as string}
            addressAr={item.address_ar}
            address={item.address}
            phone={item.phone}
            open={item.open}
            dutyStart={item.duty_start}
            dutyEnd={item.duty_end}
            distance={item.distance}
            language={language}
            text={text}
          />
        )}
        contentContainerStyle={styles.list_container}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            text={text}
            isSearching={searchParmacy.length > 0}
            activeFilter={activeFilter}
          />
        }
      />
    </SafeAreaView>
  );
}

function EmptyState({
  text,
  isSearching,
  activeFilter,
}: {
  text: any;
  isSearching: boolean;
  activeFilter: string;
}) {
  const getContent = () => {
    if (isSearching) {
      return {
        icon: "search-outline" as const,
        title: text.noResults,
        subtitle: text.noResultsSub,
      };
    }
    if (activeFilter === "night") {
      return {
        icon: "moon-outline" as const,
        title: text.noNightData,
        subtitle: text.noNightDataSub,
      };
    }
    if (activeFilter === "oncall") {
      return {
        icon: "call-outline" as const,
        title: text.noOnCallData,
        subtitle: text.noOnCallDataSub,
      };
    }
    return {
      icon: "medkit-outline" as const,
      title: text.noData,
      subtitle: text.noDataSub,
    };
  };

  const { icon, title, subtitle } = getContent();

  return (
    <View style={styles.empty_container}>
      <View style={styles.empty_icon_wrapper}>
        <Ionicons name={icon} size={32} color="#90b8e0" />
      </View>
      <Text style={styles.empty_title}>{title}</Text>
      <Text style={styles.empty_subtitle}>{subtitle}</Text>
      {isSearching && (
        <TouchableOpacity style={styles.suggest_button} onPress={() => {}}>
          <Ionicons name="add-circle-outline" size={15} color="#ffffff" />
          <Text style={styles.suggest_button_label}>{text.suggestButton}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function CardItem({
  id,
  nameAr,
  name,
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
  loading_container: {
    alignItems: "center",
    justifyContent: "center",
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
  // Empty State
  empty_container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  empty_icon_wrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  empty_title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  empty_subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "400",
  },
  suggest_button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)",
  },
  suggest_button_label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
});

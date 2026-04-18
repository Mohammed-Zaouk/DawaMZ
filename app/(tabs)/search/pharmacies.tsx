import BackgroundBubbles from "@/components/background_bubbles";
import Divider from "@/components/divider_line";
import Loading from "@/components/loading";
import { PulseDot } from "@/components/pulse_dot";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/services/supabase";
import { getScheduleStatus, isOpenNow, ScheduleStatus } from "@/utils/isOpen";
import {
  calculateDistance,
  formatDistance,
} from "@/utils/location/calculateDistance";
import { getUserLocation } from "@/utils/location/getLocation";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const ITEMS_PER_PAGE = 15;

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

// ─── helpers ───────────────────────────────────────────────────────────────

const formatDate = (dateStr: string, language: string | null) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString(
    language === "ar" ? "ar-MA" : language === "fr" ? "fr-FR" : "en-GB",
    { day: "numeric", month: "short" },
  );
};

const getTodayLabel = (language: string | null) => {
  return new Date().toLocaleDateString(
    language === "ar" ? "ar-MA" : language === "fr" ? "fr-FR" : "en-GB",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" },
  );
};

// ─── page ──────────────────────────────────────────────────────────────────

export default function PharmaciesPage() {
  const [searchParmacy, setSearchParmacy] = useState("");
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const { cityId, cityName, cityNameAr } = useLocalSearchParams();
  const [pharmaciesWithDistance, setPharmaciesWithDistance] = useState<
    Pharmacy[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  // Reset to page 1 whenever search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParmacy, activeFilter]);

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

  // ── Memoized so CardItem's `text` prop stays stable between renders ──
  const text = useMemo(() => {
    if (language === "ar") {
      return {
        openBadge: "مفتوح الآن",
        closingBadge: "يغلق قريباً",
        lunchBadge: "استراحة الغداء",
        closedBadge: "مغلقة",
        directionsButton: "عرض الاتجاهات",
        locationButton: "عرض الموقع",
        filterAll: "الكل",
        filterNight: "ليلية",
        filterOnCall: "في الخدمة",
        locationPermission: "يرجى اعطاء صلاحيات الوصول للموقع لعرض المسافة",
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
        dutyLabel: "مناوبة",
        nightLabel: "ليلية",
        alwaysOpen: "مفتوح 24 ساعة",
        closingSoon: (t: number) => `يغلق خلال ${t} دقيقة`,
        lunchReopens: (t: string) => `يعيد الفتح · ${t}`,
        opensAt: (day: string, t: string) => `يفتح ${day} · ${t}`,
        dutyPeriod: (s: string, e: string) => `مناوبة: ${s} — ${e}`,
        dutyStartsOn: (s: string) => `تبدأ المناوبة: ${s}`,
        tomorrow: "غداً",
        noPhone: "رقم الهاتف غير متوفر",
        page: (c: number, t: number) => `${c} / ${t}`,
        prevPage: "السابق",
        nextPage: "التالي",
      };
    } else if (language === "fr") {
      return {
        openBadge: "Ouvert maintenant",
        closingBadge: "Ferme bientôt",
        lunchBadge: "Pause déjeuner",
        closedBadge: "Fermé",
        directionsButton: "Itinéraire",
        locationButton: "Localisation",
        filterAll: "Toutes",
        filterNight: "Nuit",
        filterOnCall: "De garde",
        locationPermission:
          "Veuillez autoriser la localisation pour voir la distance",
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
        dutyLabel: "Garde",
        nightLabel: "Nuit",
        alwaysOpen: "Ouvert 24h/24",
        closingSoon: (t: number) => `Ferme dans ${t} min`,
        lunchReopens: (t: string) => `Réouvre à ${t}`,
        opensAt: (day: string, t: string) => `Ouvre ${day} à ${t}`,
        dutyPeriod: (s: string, e: string) => `Garde: ${s} — ${e}`,
        dutyStartsOn: (s: string) => `Garde commence: ${s}`,
        tomorrow: "demain",
        noPhone: "Numéro non disponible",
        page: (c: number, t: number) => `${c} / ${t}`,
        prevPage: "Précédent",
        nextPage: "Suivant",
      };
    } else {
      return {
        openBadge: "Open now",
        closingBadge: "Closing soon",
        lunchBadge: "Lunch break",
        closedBadge: "Closed",
        directionsButton: "Directions",
        locationButton: "Location",
        filterAll: "All",
        filterNight: "Night",
        filterOnCall: "On Call",
        locationPermission: "Please allow location access to see the distance",
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
        dutyLabel: "On Call",
        nightLabel: "Night",
        alwaysOpen: "Open 24 hours",
        closingSoon: (t: number) => `Closes in ${t} min`,
        lunchReopens: (t: string) => `Reopens at ${t}`,
        opensAt: (day: string, t: string) => `Opens ${day} · ${t}`,
        dutyPeriod: (s: string, e: string) => `On call: ${s} — ${e}`,
        dutyStartsOn: (s: string) => `On call starts: ${s}`,
        tomorrow: "tomorrow",
        noPhone: "Phone number unavailable",
        page: (c: number, t: number) => `${c} / ${t}`,
        prevPage: "Previous",
        nextPage: "Next",
      };
    }
  }, [language]);

  const filteredPharmacies = useMemo(
    () =>
      pharmaciesWithDistance.filter((pharmacy) => {
        const open = isOpenNow(
          pharmacy.schedule,
          pharmacy.is_on_call ?? false,
          pharmacy.duty_start,
          pharmacy.duty_end,
          pharmacy.is_night_pharmacy ?? false,
        );
        if (activeFilter === "night")
          return pharmacy.is_night_pharmacy === true && open;
        if (activeFilter === "oncall")
          return pharmacy.is_on_call === true && open;
        return open;
      }),
    [pharmaciesWithDistance, activeFilter],
  );

  const filterData = useMemo(
    () =>
      filteredPharmacies.filter(
        (pharmacy) =>
          pharmacy.name.toLowerCase().includes(searchParmacy.toLowerCase()) ||
          pharmacy.name_ar.includes(searchParmacy),
      ),
    [filteredPharmacies, searchParmacy],
  );

  const totalPages = Math.max(1, Math.ceil(filterData.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedData = useMemo(
    () =>
      filterData.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE,
      ),
    [filterData, safePage, currentPage],
  );

  const handlePrevPage = useCallback(() => {
    setCurrentPage((p) => Math.max(1, p - 1));
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [totalPages]);

  // ── Stable renderItem — won't change unless deps change ──
  const renderItem = useCallback(
    ({ item }: { item: Pharmacy }) => (
      <CardItem
        pharmacy={item}
        cityName={cityName as string}
        cityNameAr={cityNameAr as string}
        language={language}
        text={text}
      />
    ),
    [cityName, cityNameAr, language, text],
  );

  // ── Stable keyExtractor ──
  const keyExtractor = useCallback((item: Pharmacy) => item.id, []);

  if (loading) return <Loading />;

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

      <View style={styles.date_strip}>
        <View style={styles.side_line} />
        <Text style={styles.date_strip_text}>{getTodayLabel(language)}</Text>
        <View style={styles.side_line} />
      </View>

      <FlatList
        ref={flatListRef}
        data={pagedData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list_container}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={5}
        windowSize={5}
        ListEmptyComponent={
          <EmptyState
            text={text}
            isSearching={searchParmacy.length > 0}
            activeFilter={activeFilter}
          />
        }
      />

      {/* Pagination pinned at the bottom, outside FlatList */}
      {filterData.length > ITEMS_PER_PAGE && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
          label={text.page(safePage, totalPages)}
          prevLabel={text.prevPage}
          nextLabel={text.nextPage}
        />
      )}
    </SafeAreaView>
  );
}

// ─── pagination ────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  label,
  prevLabel,
  nextLabel,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  label: string;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <View style={styles.pagination_container}>
      <TouchableOpacity
        onPress={onPrev}
        disabled={currentPage === 1}
        style={[
          styles.pagination_button,
          currentPage === 1 && styles.pagination_button_disabled,
        ]}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-back"
          size={16}
          color={currentPage === 1 ? "rgba(255,255,255,0.3)" : "#FFFFFF"}
        />
        <Text
          style={[
            styles.pagination_button_text,
            currentPage === 1 && styles.pagination_button_text_disabled,
          ]}
        >
          {prevLabel}
        </Text>
      </TouchableOpacity>

      <View style={styles.pagination_label_wrap}>
        <Text style={styles.pagination_label}>{label}</Text>
      </View>

      <TouchableOpacity
        onPress={onNext}
        disabled={currentPage === totalPages}
        style={[
          styles.pagination_button,
          currentPage === totalPages && styles.pagination_button_disabled,
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.pagination_button_text,
            currentPage === totalPages &&
              styles.pagination_button_text_disabled,
          ]}
        >
          {nextLabel}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={
            currentPage === totalPages ? "rgba(255,255,255,0.3)" : "#FFFFFF"
          }
        />
      </TouchableOpacity>
    </View>
  );
}

// ─── empty state ───────────────────────────────────────────────────────────

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
    if (isSearching)
      return {
        icon: "search-outline" as const,
        title: text.noResults,
        subtitle: text.noResultsSub,
      };
    if (activeFilter === "night")
      return {
        icon: "moon-outline" as const,
        title: text.noNightData,
        subtitle: text.noNightDataSub,
      };
    if (activeFilter === "oncall")
      return {
        icon: "call-outline" as const,
        title: text.noOnCallData,
        subtitle: text.noOnCallDataSub,
      };
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

// ─── card ──────────────────────────────────────────────────────────────────

const CardItem = React.memo(function CardItem({
  pharmacy,
  cityName,
  cityNameAr,
  language,
  text,
}: {
  pharmacy: Pharmacy;
  cityName: string;
  cityNameAr: string;
  language: string | null;
  text: any;
}) {
  const router = useRouter();
  const navigating = useRef(false);

  const status: ScheduleStatus = useMemo(
    () =>
      getScheduleStatus(
        pharmacy.schedule,
        pharmacy.is_on_call ?? false,
        pharmacy.duty_start,
        pharmacy.duty_end,
        pharmacy.is_night_pharmacy ?? false,
      ),
    [pharmacy],
  );

  const isOpen =
    status.type === "always_open" ||
    status.type === "open" ||
    status.type === "lunch_break";

  const mapRedirect = async () => {
    if (navigating.current) return;
    navigating.current = true;
    try {
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
    } finally {
      setTimeout(() => {
        navigating.current = false;
      }, 500);
    }
  };

  const handleLocationNavigate = () => {
    if (navigating.current) return;
    navigating.current = true;
    router.push({
      pathname: "/maps/pharmacy-location",
      params: {
        pharmacyId: pharmacy.id,
        distance: pharmacy.distance,
        cityName: cityName,
        cityNameAr: cityNameAr,
      },
    });
    setTimeout(() => {
      navigating.current = false;
    }, 500);
  };

  const badge = useMemo(() => {
    if (status.type === "open" && status.closingSoon)
      return { label: text.closingBadge, color: "#d97706", dot: "#f59e0b" };
    if (status.type === "lunch_break")
      return { label: text.lunchBadge, color: "#d97706", dot: "#f59e0b" };
    if (isOpen)
      return { label: text.openBadge, color: "#22c55e", dot: "#22c55e" };
    return { label: text.closedBadge, color: "#ef4444", dot: "#ef4444" };
  }, [status, isOpen, text]);

  const scheduleRow = useMemo(() => {
    switch (status.type) {
      case "always_open":
        return {
          label: text.alwaysOpen,
          color: "#22c55e",
          icon: "time-outline" as const,
          bg: "#f0fdf4",
        };
      case "open":
        if (status.closingSoon)
          return {
            label: text.closingSoon(status.minsLeft),
            color: "#d97706",
            icon: "time-outline" as const,
            bg: "#fffbeb",
          };
        return {
          label: status.nextSlot
            ? `${status.slot.open} — ${status.slot.close} · ${status.nextSlot.open} — ${status.nextSlot.close}`
            : `${status.slot.open} — ${status.slot.close}`,
          color: "#828282",
          icon: "time-outline" as const,
          bg: "#EEF4FF",
        };
      case "lunch_break":
        return {
          label: text.lunchReopens(status.reopensAt),
          color: "#d97706",
          icon: "restaurant-outline" as const,
          bg: "#fffbeb",
        };
      case "closed":
        if (status.opensDay === "duty")
          return {
            label: text.dutyStartsOn(formatDate(status.opensAt, language)),
            color: "#7c3aed",
            icon: "calendar-outline" as const,
            bg: "#f5f3ff",
          };
        return {
          label: text.opensAt(
            status.opensDay === "tomorrow" ? text.tomorrow : status.opensDay,
            status.opensAt,
          ),
          color: "#ef4444",
          icon: "time-outline" as const,
          bg: "#fef2f2",
        };
      default:
        return {
          label: "—",
          color: "#828282",
          icon: "time-outline" as const,
          bg: "#EEF4FF",
        };
    }
  }, [status, language, text]);

  const showDutyPeriod =
    (pharmacy.is_on_call || pharmacy.is_night_pharmacy) &&
    pharmacy.duty_start &&
    pharmacy.duty_end &&
    pharmacy.duty_start !== "24h";

  const warningBanner = useMemo(() => {
    if (status.type === "open" && status.closingSoon && status.nextSlot)
      return text.lunchReopens(status.nextSlot.open);
    return null;
  }, [status, text]);

  return (
    <View style={styles.card}>
      <View style={styles.card_content}>
        {/* header */}
        <View style={styles.card_header}>
          <View style={styles.badge_container}>
            <PulseDot color={badge.dot} />
            <Text style={[styles.badge_text, { color: badge.color }]}>
              {badge.label}
            </Text>
          </View>
          <View style={styles.title_row}>
            {pharmacy.is_night_pharmacy && (
              <View style={[styles.type_pill, styles.pill_night]}>
                <Text style={styles.pill_night_text}>{text.nightLabel}</Text>
              </View>
            )}
            {pharmacy.is_on_call && (
              <View style={[styles.type_pill, styles.pill_oncall]}>
                <Text style={styles.pill_oncall_text}>{text.dutyLabel}</Text>
              </View>
            )}
            <Text
              style={styles.card_title}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {language === "ar" ? pharmacy.name_ar : pharmacy.name}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* info rows */}
        <View style={styles.info_container}>
          <View style={styles.info_row}>
            <Text
              style={styles.info_text}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {language === "ar" ? pharmacy.address_ar : pharmacy.address}
            </Text>
            <View style={styles.info_icon_wrap}>
              <Ionicons name="location-outline" size={13} color="#3385FF" />
            </View>
          </View>

          <View style={styles.info_row}>
            <Text
              style={[
                styles.info_text,
                !pharmacy.phone && styles.info_text_unavailable,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {pharmacy.phone ?? text.noPhone}
            </Text>
            <View style={styles.info_icon_wrap}>
              <Ionicons name="call-outline" size={13} color="#3385FF" />
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.info_row}>
            <Text
              style={[
                styles.info_text,
                !pharmacy.distance && styles.info_text_unavailable,
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {pharmacy.distance !== undefined
                ? formatDistance(pharmacy.distance)
                : text.locationPermission}
            </Text>
            <View style={styles.info_icon_wrap}>
              <Ionicons name="walk-outline" size={13} color="#3385FF" />
            </View>
          </View>

          {/* duty period */}
          {showDutyPeriod && (
            <View style={styles.info_row}>
              <Text
                style={[
                  styles.info_text,
                  { color: "#3385FF", fontWeight: "500" },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {text.dutyPeriod(
                  formatDate(pharmacy.duty_start, language),
                  formatDate(pharmacy.duty_end, language),
                )}
              </Text>
              <View
                style={[styles.info_icon_wrap, { backgroundColor: "#f5f3ff" }]}
              >
                <Ionicons name="calendar-outline" size={13} color="#3385FF" />
              </View>
            </View>
          )}

          {/* schedule row */}
          <View style={styles.info_row}>
            <Text
              style={[
                styles.info_text,
                { color: scheduleRow.color, fontWeight: "500" },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {scheduleRow.label}
            </Text>
            <View
              style={[
                styles.info_icon_wrap,
                { backgroundColor: scheduleRow.bg },
              ]}
            >
              <Ionicons
                name={scheduleRow.icon}
                size={13}
                color={scheduleRow.color}
              />
            </View>
          </View>

          {/* warning banner */}
          {warningBanner && (
            <View style={styles.warning_banner}>
              <Text style={styles.warning_banner_text}>{warningBanner}</Text>
              <Ionicons
                name="information-circle-outline"
                size={13}
                color="#3385FF"
              />
            </View>
          )}
        </View>

        {/* action buttons */}
        <View style={styles.button_container}>
          <TouchableOpacity onPress={mapRedirect} style={styles.card_button}>
            <Ionicons name="navigate-outline" size={14} color="#3385FF" />
            <Text style={styles.button_text}>{text.directionsButton}</Text>
          </TouchableOpacity>
          <View style={styles.upward_divider} />
          <TouchableOpacity
            onPress={handleLocationNavigate}
            style={styles.card_button}
          >
            <Ionicons name="map-outline" size={14} color="#3385FF" />
            <Text style={styles.button_text}>{text.locationButton}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

// ─── styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Screen
  screen_container: {
    flex: 1,
    backgroundColor: "#2196F3",
    gap: 15,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  date_strip: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  side_line: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.35)",
    flex: 1,
  },
  date_strip_text: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
    letterSpacing: 0.3,
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
    paddingBottom: 8,
  },
  // Pagination — pinned bar at the bottom of the screen
  pagination_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    marginBottom: -10,
  },
  pagination_button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    minWidth: 100,
    justifyContent: "center",
  },
  pagination_button_disabled: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  pagination_button_text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  pagination_button_text_disabled: {
    color: "rgba(255,255,255,0.3)",
  },
  pagination_label_wrap: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    minWidth: 64,
    alignItems: "center",
  },
  pagination_label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.5,
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
    marginBottom: 3,
  },
  title_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    flex: 1,
    justifyContent: "flex-end",
    marginLeft: 8,
  },
  card_title: {
    fontSize: 17.3,
    fontWeight: "700",
    color: "#274796",
    textAlign: "right",
    writingDirection: "rtl",
    flexShrink: 1,
  },
  type_pill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 50,
    flexShrink: 0,
  },
  pill_night: { backgroundColor: "#EEEDFE" },
  pill_night_text: { fontSize: 10, color: "#534AB7", fontWeight: "600" },
  pill_oncall: { backgroundColor: "#E1F5EE" },
  pill_oncall_text: { fontSize: 10, color: "#0F6E56", fontWeight: "600" },
  badge_container: { flexDirection: "row", alignItems: "center", gap: 5 },
  badge_text: { fontSize: 11.5, fontWeight: "500" },
  divider: { marginVertical: 7 },
  info_container: { gap: 7 },
  info_row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  info_text: {
    fontSize: 15,
    paddingLeft: 25,
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
  info_text_unavailable: {
    fontStyle: "italic",
    color: "#828282",
  },
  warning_banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    backgroundColor: "#EEF4FF",
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 1,
  },
  warning_banner_text: {
    fontSize: 15,
    color: "#3385FF",
    fontWeight: "500",
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
  button_text: { fontSize: 13, color: "#3385FF" },
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
    textAlign: "center",
  },
  empty_subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "400",
    textAlign: "center",
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

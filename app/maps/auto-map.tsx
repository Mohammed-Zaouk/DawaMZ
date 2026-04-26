import Loading from "@/components/loading";
import { PulseDot } from "@/components/pulse_dot";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { formatDistance } from "@/utils/location/calculateDistance";
import { useOSRM } from "@/utils/location/getRoute";
import { findNearestOpenPharmacy } from "@/utils/location/nearest-open-pharmacy";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, Region, UrlTile } from "react-native-maps";
import { Button, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const MAPTILER_API_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY;

type NearbyPharmacy = Awaited<ReturnType<typeof findNearestOpenPharmacy>>;

export default function AutoMap() {
  const { language } = useLanguage();
  const { theme, isDark } = useTheme();
  const { routeCoords, status, fetchRoute, clearRoute } = useOSRM();

  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [noRouteModal, setNoRouteModal] = useState<boolean>(false);
  const [nearbypharmacy, setNearbypharmacy] = useState<NearbyPharmacy>(null);
  const [loading, setLoading] = useState(true);

  const { latitude, longitude } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
  }>();
  const router = useRouter();

  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: Number(latitude),
    longitude: Number(longitude),
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const tileStyle = isDark ? "streets-v2-dark" : "streets-v2";
  const MAPTILER_TILE_URL = `https://api.maptiler.com/maps/${tileStyle}/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`;

  const isLoadingRoute =
    status === "fetching" || status === "requesting_permission";
  const hasRoute = status === "success" && routeCoords.length > 0;

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const result = await findNearestOpenPharmacy(
        Number(latitude),
        Number(longitude),
      );
      setNearbypharmacy(result);
      if (result) {
        setRegion({
          latitude: result.latitude,
          longitude: result.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  // ── Watch OSRM status changes ──────────────────────────────────────────────
  useEffect(() => {
    if (status === "permission_denied") {
      showSnackbar(getText().locationWarning);
    }
    if (status === "no_route" || status === "error") {
      setNoRouteModal(true);
    }
    if (status === "success" && routeCoords.length > 0) {
      mapRef.current?.fitToCoordinates(routeCoords, {
        edgePadding: { top: 80, right: 60, bottom: 160, left: 60 },
        animated: true,
      });
    }
  }, [status]);

  if (loading || !nearbypharmacy) return <Loading />;

  // ── Translations ───────────────────────────────────────────────────────────
  const getText = () => {
    if (language === "ar") {
      return {
        title: nearbypharmacy.name_ar,
        description: nearbypharmacy.address_ar,
        directions: "الاتجاهات",
        clearRoute: "إلغاء المسار",
        loadingRoute: "جاري تحميل المسار...",
        call: "اتصال",
        copy: "نسخ",
        copied: "تم نسخ العنوان",
        noPhone: "رقم الهاتف غير متوفر",
        locationWarning: "يرجى اعطاء صلاحيات الوصول للموقع لعرض المسافة",
        displayCityName: nearbypharmacy.cityNameAr,
        noRouteTitle: "لم يتم العثور على مسار",
        noRouteBody:
          "تعذر تحميل المسار. يمكنك فتح خرائط Google للحصول على الاتجاهات.",
        openGoogleMaps: "فتح خرائط Google",
        cancel: "إلغاء",
      };
    } else if (language === "fr") {
      return {
        title: nearbypharmacy.name,
        description: nearbypharmacy.address,
        directions: "Itinéraire",
        clearRoute: "Effacer",
        loadingRoute: "Chargement...",
        call: "Appeler",
        copy: "Copier",
        copied: "Adresse copiée",
        noPhone: "Numéro de téléphone non disponible",
        locationWarning:
          "Veuillez autoriser la localisation pour voir la distance",
        displayCityName: nearbypharmacy.cityName,
        noRouteTitle: "Itinéraire introuvable",
        noRouteBody:
          "Impossible de calculer l'itinéraire. Vous pouvez ouvrir Google Maps à la place.",
        openGoogleMaps: "Ouvrir Google Maps",
        cancel: "Annuler",
      };
    } else {
      return {
        title: nearbypharmacy.name,
        description: nearbypharmacy.address,
        directions: "Directions",
        clearRoute: "Clear Route",
        loadingRoute: "Loading route...",
        call: "Call",
        copy: "Copy",
        copied: "Address copied to clipboard",
        noPhone: "Phone number not available",
        locationWarning: "Please allow location access to see the distance",
        displayCityName: nearbypharmacy.cityName,
        noRouteTitle: "No Route Found",
        noRouteBody:
          "We couldn't find a route to this pharmacy. You can open Google Maps for directions instead.",
        openGoogleMaps: "Open Google Maps",
        cancel: "Cancel",
      };
    }
  };

  const text = getText();
  const isOpen = nearbypharmacy.open;
  const hasPhone = !!nearbypharmacy.phone;
  const distance = formatDistance(nearbypharmacy.distance);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // ── Directions handler ─────────────────────────────────────────────────────
  const handleDirections = async () => {
    if (hasRoute) {
      clearRoute();
      goToPharmacy();
      return;
    }
    await fetchRoute({
      latitude: nearbypharmacy.latitude,
      longitude: nearbypharmacy.longitude,
    });
  };

  // ── Open Google Maps fallback ──────────────────────────────────────────────
  const openGoogleMaps = () => {
    setNoRouteModal(false);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${nearbypharmacy.latitude},${nearbypharmacy.longitude}`;
    Linking.openURL(url);
  };

  // ── Map controls ───────────────────────────────────────────────────────────
  const zoomIn = () => {
    mapRef.current?.animateToRegion(
      {
        ...region,
        latitudeDelta: region.latitudeDelta / 2,
        longitudeDelta: region.longitudeDelta / 2,
      },
      300,
    );
  };

  const zoomOut = () => {
    mapRef.current?.animateToRegion(
      {
        ...region,
        latitudeDelta: region.latitudeDelta * 2,
        longitudeDelta: region.longitudeDelta * 2,
      },
      300,
    );
  };

  const resetNorth = () => {
    mapRef.current?.animateCamera({ heading: 0 }, { duration: 300 });
  };

  const goToPharmacy = () => {
    mapRef.current?.animateToRegion({
      latitude: nearbypharmacy.latitude,
      longitude: nearbypharmacy.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
  };

  const handleCall = () => {
    if (!hasPhone) {
      showSnackbar(text.noPhone);
      return;
    }
    Linking.openURL(`tel:${nearbypharmacy.phone}`);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text.description as string);
    showSnackbar(text.copied);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.card }]}>
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.back_button, { backgroundColor: theme.cardIcon }]}
        >
          <Ionicons name="chevron-back" size={18} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.header_info}>
          <Text
            style={[styles.header_title, { color: theme.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text.title}
          </Text>
          <Text
            style={[styles.header_subtitle, { color: theme.itemDescription }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text.description}
          </Text>
        </View>
        <View style={styles.header_badge}>
          <PulseDot color={isOpen ? "#22c55e" : "#ef4444"} />
        </View>
      </View>

      {/* ── Map ─────────────────────────────────────────────────────────────── */}
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={(r) => setRegion(r)}
          mapType="none"
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
          pitchEnabled={true}
          showsCompass={false}
          showsScale={false}
          showsBuildings={true}
          showsTraffic={false}
          showsUserLocation={true}
        >
          {/* Maptiler tiles */}
          <UrlTile
            urlTemplate={MAPTILER_TILE_URL}
            maximumZ={19}
            flipY={false}
            shouldReplaceMapContent={true}
            zIndex={-1}
          />

          {/* Pharmacy marker */}
          <Marker
            coordinate={{
              latitude: nearbypharmacy.latitude,
              longitude: nearbypharmacy.longitude,
            }}
            title={text.title as string}
            description={text.description as string}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.marker_wrapper}>
              <View
                style={[
                  styles.marker_bubble,
                  { backgroundColor: isOpen ? "#09C849" : "#EF4444" },
                ]}
              >
                <Ionicons name="medkit" size={16} color="#fff" />
              </View>
              <View
                style={[
                  styles.marker_tail,
                  { borderTopColor: isOpen ? "#09C849" : "#EF4444" },
                ]}
              />
            </View>
          </Marker>

          {/* OSRM route polyline */}
          {hasRoute && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#1A73E8"
              strokeWidth={4}
              lineDashPattern={[0]}
            />
          )}
        </MapView>

        {/* City Card */}
        <View style={[styles.city_card, { backgroundColor: theme.card }]}>
          <Ionicons
            name="location"
            size={14}
            color="#1A73E8"
            style={{ marginRight: 3 }}
          />
          <Text style={[styles.city_text, { color: theme.text }]}>
            {text.displayCityName}
          </Text>
        </View>

        {/* Distance Card */}
        {distance && (
          <View style={[styles.distance_card, { backgroundColor: theme.card }]}>
            <Ionicons
              name="navigate"
              size={14}
              color="#1A73E8"
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.distance_text, { color: theme.text }]}>
              {distance}
            </Text>
          </View>
        )}

        {/* Route loading indicator */}
        {isLoadingRoute && (
          <View style={[styles.route_loading, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="small" color="#1A73E8" />
            <Text style={[styles.route_loading_text, { color: theme.text }]}>
              {text.loadingRoute}
            </Text>
          </View>
        )}

        {/* Zoom Controls */}
        <View style={styles.zoom_controls}>
          <View style={[styles.btn_group, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.map_btn} onPress={zoomIn}>
              <Ionicons name="add" size={22} color={theme.text} />
            </TouchableOpacity>
            <View
              style={[
                styles.group_divider,
                { backgroundColor: theme.sideLine },
              ]}
            />
            <TouchableOpacity style={styles.map_btn} onPress={zoomOut}>
              <Ionicons name="remove" size={22} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Controls */}
        <View style={styles.nav_controls}>
          <View style={[styles.btn_group, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={styles.map_btn} onPress={resetNorth}>
              <Ionicons name="compass-outline" size={22} color={theme.text} />
            </TouchableOpacity>
            <View
              style={[
                styles.group_divider,
                { backgroundColor: theme.sideLine },
              ]}
            />
            <TouchableOpacity
              style={styles.map_btn_pharmacy}
              onPress={goToPharmacy}
            >
              <Ionicons name="medkit-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <View style={[styles.footer, { backgroundColor: theme.card }]}>
        <View style={[styles.handle, { backgroundColor: theme.chevron }]} />
        <View style={styles.action_bar}>
          {/* Directions / Clear Route */}
          <Button
            mode="contained"
            icon={() =>
              isLoadingRoute ? (
                <ActivityIndicator size={14} color="#fff" />
              ) : (
                <Ionicons
                  name={hasRoute ? "close" : "navigate-outline"}
                  size={14}
                  color="#fff"
                />
              )
            }
            buttonColor={hasRoute ? "#EF4444" : "#1A73E8"}
            textColor="#fff"
            style={styles.action_button_primary}
            labelStyle={styles.action_button_label}
            onPress={handleDirections}
            disabled={isLoadingRoute}
          >
            {hasRoute ? text.clearRoute : text.directions}
          </Button>

          {/* Call */}
          <Button
            mode="outlined"
            icon={() => (
              <Ionicons
                name="call-outline"
                size={14}
                color={hasPhone ? "#1A73E8" : theme.itemDescription}
              />
            )}
            textColor={hasPhone ? "#1A73E8" : theme.itemDescription}
            style={[
              styles.action_button_secondary,
              {
                backgroundColor: theme.cardIcon,
                borderColor: theme.headerBg,
                opacity: hasPhone ? 1 : 0.5,
              },
            ]}
            labelStyle={[
              styles.action_button_secondary_label,
              { color: hasPhone ? "#1A73E8" : theme.itemDescription },
            ]}
            onPress={handleCall}
          >
            {text.call}
          </Button>

          {/* Copy */}
          <Button
            mode="outlined"
            icon={() => (
              <Ionicons name="copy-outline" size={14} color="#1A73E8" />
            )}
            textColor="#1A73E8"
            style={[
              styles.action_button_secondary,
              {
                backgroundColor: theme.cardIcon,
                borderColor: theme.headerBg,
              },
            ]}
            labelStyle={styles.action_button_secondary_label}
            onPress={handleCopy}
          >
            {text.copy}
          </Button>
        </View>
      </View>

      {/* ── No Route Modal ───────────────────────────────────────────────────── */}
      <Modal
        visible={noRouteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setNoRouteModal(false)}
      >
        <Pressable
          style={styles.modal_overlay}
          onPress={() => setNoRouteModal(false)}
        >
          <Pressable
            style={[styles.modal_card, { backgroundColor: theme.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <View style={styles.modal_icon_wrapper}>
              <Ionicons name="map-outline" size={32} color="#1A73E8" />
            </View>

            {/* Title */}
            <Text style={[styles.modal_title, { color: theme.text }]}>
              {text.noRouteTitle}
            </Text>

            {/* Body */}
            <Text style={[styles.modal_body, { color: theme.itemDescription }]}>
              {text.noRouteBody}
            </Text>

            {/* Actions */}
            <View style={styles.modal_actions}>
              <TouchableOpacity
                style={[
                  styles.modal_btn_secondary,
                  { borderColor: theme.sideLine },
                ]}
                onPress={() => setNoRouteModal(false)}
              >
                <Text
                  style={[
                    styles.modal_btn_secondary_text,
                    { color: theme.text },
                  ]}
                >
                  {text.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modal_btn_primary}
                onPress={openGoogleMaps}
              >
                <Ionicons
                  name="navigate"
                  size={14}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.modal_btn_primary_text}>
                  {text.openGoogleMaps}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Snackbar ─────────────────────────────────────────────────────────── */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: -25,
  },

  // Header
  header: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  back_button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  header_info: {
    flex: 1,
    paddingHorizontal: 12,
  },
  header_title: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  header_subtitle: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.1,
  },
  header_badge: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  // Map
  map: {
    flex: 1,
  },

  // Marker
  marker_wrapper: {
    alignItems: "center",
  },
  marker_bubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  marker_tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },

  // Overlays
  city_card: {
    position: "absolute",
    top: 16,
    left: 20,
    flexDirection: "row",
    alignItems: "baseline",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  city_text: {
    fontSize: 12,
    fontWeight: "600",
  },
  distance_card: {
    position: "absolute",
    top: 16,
    right: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  distance_text: {
    fontSize: 12,
    fontWeight: "600",
  },
  route_loading: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  route_loading_text: {
    fontSize: 12,
    fontWeight: "600",
  },

  // Map controls
  zoom_controls: {
    position: "absolute",
    right: 12,
    top: 70,
  },
  nav_controls: {
    position: "absolute",
    right: 12,
    bottom: 16,
  },
  btn_group: {
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 10,
    elevation: 3,
  },
  map_btn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  map_btn_pharmacy: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A73E8",
  },
  group_divider: {
    height: 0.5,
    marginHorizontal: 8,
  },

  // Footer
  footer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 25,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 14,
  },
  action_bar: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  action_button_primary: {
    borderRadius: 50,
    flex: 2,
  },
  action_button_label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  action_button_secondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
  },
  action_button_secondary_label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A73E8",
    letterSpacing: 0.1,
  },

  // No Route Modal
  modal_overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modal_card: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 10,
  },
  modal_icon_wrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modal_title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  modal_body: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modal_actions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  modal_btn_secondary: {
    flex: 1,
    height: 42,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modal_btn_secondary_text: {
    fontSize: 13,
    fontWeight: "600",
  },
  modal_btn_primary: {
    flex: 2,
    height: 42,
    borderRadius: 50,
    backgroundColor: "#1A73E8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modal_btn_primary_text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },

  // Snackbar
  snackbar: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 120,
    backgroundColor: "#1C1C1E",
  },
});

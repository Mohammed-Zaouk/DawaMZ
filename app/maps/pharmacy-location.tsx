import Loading from "@/components/loading";
import { PulseDot } from "@/components/pulse_dot";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/services/supabase";
import { formatDistance } from "@/utils/location/calculateDistance";
import { checkLocationPermission } from "@/utils/location/getLocation";
import { useOSRM } from "@/utils/location/getRoute";
import { Ionicons } from "@expo/vector-icons";
import {
  Camera,
  CameraRef,
  LineLayer,
  MapView,
  MapViewRef,
  MarkerView,
  ShapeSource,
  UserLocation,
  setAccessToken,
} from "@maplibre/maplibre-react-native";
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
import { Button, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

setAccessToken(null);

const MAPTILER_API_KEY = process.env.EXPO_PUBLIC_MAPTILER_API_KEY;

// OSM raster fallback
const OSM_STYLE_URL = "https://demotiles.maplibre.org/style.json";

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
};

export default function PharmacyMap() {
  const router = useRouter();
  const { pharmacyId, distance, cityName, cityNameAr, autoDirection } =
    useLocalSearchParams();

  const { language } = useLanguage();
  const { theme, isDark } = useTheme();
  const { routeCoords, status, fetchRoute, clearRoute } = useOSRM();

  const [check, setCheck] = useState<boolean>(true);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [noRouteModal, setNoRouteModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [useOSMFallback, setUseOSMFallback] = useState<boolean>(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const userLocationRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapRef = useRef<MapViewRef>(null);
  const cameraRef = useRef<CameraRef>(null);

  const tileStyle = isDark ? "streets-v2-dark" : "streets-v2";
  const MAPTILER_STYLE_URL = `https://api.maptiler.com/maps/${tileStyle}/style.json?key=${MAPTILER_API_KEY}`;

  const activeMapStyle = useOSMFallback ? OSM_STYLE_URL : MAPTILER_STYLE_URL;

  const hasPhone = !!pharmacy?.phone;
  const isLoadingRoute =
    status === "fetching" || status === "requesting_permission";
  const hasRoute = status === "success" && routeCoords.length > 0;

  // Build GeoJSON for the route polyline
  const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> | null =
    hasRoute && routeCoords.length > 0
      ? {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: routeCoords.map((c) => [c.longitude, c.latitude]),
          },
          properties: {},
        }
      : null;

  // ── Data fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    fetchPharmacy();
    loadCheck();
  }, []);

  const fetchPharmacy = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pharmacies")
      .select("*")
      .eq("id", pharmacyId)
      .single();
    if (!error && data) {
      setPharmacy(data);
      cameraRef.current?.setCamera({
        centerCoordinate: [data.longitude, data.latitude],
        zoomLevel: 15,
        animationDuration: 0,
      });
    }
    setLoading(false);
  };

  const loadCheck = async () => {
    const ch = await checkLocationPermission();
    setCheck(ch);
  };

  useEffect(() => {
    if (autoDirection === "true" && pharmacy) {
      fetchRoute({
        latitude: pharmacy.latitude,
        longitude: pharmacy.longitude,
      });
    }
  }, [pharmacy]);

  // ── Watch OSRM status changes ──────────────────────────────────────────────
  useEffect(() => {
    if (status === "permission_denied") {
      showSnackbar(text.locationWarning);
    }
    if (status === "no_route" || status === "error") {
      setNoRouteModal(true);
    }
    if (status === "success" && routeCoords.length > 0) {
      const lats = routeCoords.map((c) => c.latitude);
      const lngs = routeCoords.map((c) => c.longitude);
      cameraRef.current?.fitBounds(
        [Math.max(...lngs), Math.max(...lats)],
        [Math.min(...lngs), Math.min(...lats)],
        [80, 60, 160, 60],
        500,
      );
    }
  }, [status]);

  // ── Directions handler ─────────────────────────────────────────────────────
  const handleDirections = async () => {
    if (hasRoute) {
      clearRoute();
      goToPharmacy();
      return;
    }
    if (!pharmacy) return;
    await fetchRoute({
      latitude: pharmacy.latitude,
      longitude: pharmacy.longitude,
    });
  };

  // ── Open Google Maps fallback ──────────────────────────────────────────────
  const openGoogleMaps = () => {
    setNoRouteModal(false);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${pharmacy?.latitude},${pharmacy?.longitude}`;
    Linking.openURL(url);
  };

  // ── Map controls ───────────────────────────────────────────────────────────
  const zoomIn = async () => {
    const zoom = await mapRef.current?.getZoom();
    cameraRef.current?.setCamera({
      zoomLevel: (zoom ?? 14) + 1,
      animationDuration: 300,
    });
  };

  const zoomOut = async () => {
    const zoom = await mapRef.current?.getZoom();
    cameraRef.current?.setCamera({
      zoomLevel: (zoom ?? 14) - 1,
      animationDuration: 300,
    });
  };

  const resetNorth = () => {
    cameraRef.current?.setCamera({
      heading: 0,
      animationDuration: 300,
    });
  };

  const goToPharmacy = () => {
    if (!pharmacy) return;
    cameraRef.current?.setCamera({
      centerCoordinate: [pharmacy.longitude, pharmacy.latitude],
      zoomLevel: 15,
      animationDuration: 500,
    });
  };

  // ── Go to user location ────────────────────────────────────────────────────
  const goToUserLocation = () => {
    if (!userLocationRef.current) {
      showSnackbar(text.locationWarningFeature);
      return;
    }
    cameraRef.current?.setCamera({
      centerCoordinate: [
        userLocationRef.current.longitude,
        userLocationRef.current.latitude,
      ],
      zoomLevel: 15,
      animationDuration: 500,
    });
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  // ── Translations ───────────────────────────────────────────────────────────
  const getText = () => {
    if (language === "ar") {
      return {
        title: pharmacy?.name_ar,
        description: pharmacy?.address_ar,
        displayCityName: cityNameAr,
        directions: "الاتجاهات",
        clearRoute: "إلغاء المسار",
        loadingRoute: "جاري تحميل المسار...",
        call: "اتصال",
        copy: "نسخ",
        locationWarning: "يرجى اعطاء صلاحيات الوصول للموقع لعرض المسافة",
        locationWarningFeature:
          "يرجى اعطاء صلاحيات الوصول للموقع لاستخدام هذه الميزة",
        copied: "تم نسخ العنوان",
        noPhone: "رقم الهاتف غير متوفر",
        noRouteTitle: "لم يتم العثور على مسار",
        noRouteBody:
          "تعذر تحميل المسار. يمكنك فتح خرائط Google للحصول على الاتجاهات.",
        openGoogleMaps: "فتح خرائط Google",
        cancel: "إلغاء",
      };
    } else if (language === "fr") {
      return {
        title: pharmacy?.name,
        description: pharmacy?.address,
        displayCityName: cityName,
        directions: "Itinéraire",
        clearRoute: "Effacer",
        loadingRoute: "Chargement...",
        call: "Appeler",
        copy: "Copier",
        locationWarning:
          "Veuillez autoriser la localisation pour voir la distance",
        locationWarningFeature:
          "Veuillez autoriser la localisation pour utiliser cette fonctionnalité",
        copied: "Adresse copiée",
        noPhone: "Numéro de téléphone non disponible",
        noRouteTitle: "Itinéraire introuvable",
        noRouteBody:
          "Impossible de calculer l'itinéraire. Vous pouvez ouvrir Google Maps à la place.",
        openGoogleMaps: "Ouvrir Google Maps",
        cancel: "Annuler",
      };
    } else {
      return {
        title: pharmacy?.name,
        description: pharmacy?.address,
        displayCityName: cityName,
        directions: "Directions",
        clearRoute: "Clear Route",
        loadingRoute: "Loading route...",
        call: "Call",
        copy: "Copy",
        locationWarning: "Please allow location access to see the distance",
        locationWarningFeature:
          "Please allow location access to use this feature",
        copied: "Address copied to clipboard",
        noPhone: "Phone number not available",
        noRouteTitle: "No Route Found",
        noRouteBody:
          "We couldn't find a route to this pharmacy. You can open Google Maps for directions instead.",
        openGoogleMaps: "Open Google Maps",
        cancel: "Cancel",
      };
    }
  };

  const text = getText();

  const handleCall = () => {
    if (!hasPhone) {
      showSnackbar(text.noPhone);
      return;
    }
    Linking.openURL(`tel:${pharmacy?.phone}`);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text.description as string);
    showSnackbar(text.copied);
  };

  if (loading) return <Loading />;

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
          <PulseDot color={pharmacy?.open ? "#22c55e" : "#ef4444"} />
        </View>
      </View>

      {/* ── Map ─────────────────────────────────────────────────────────────── */}
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={styles.map}
          mapStyle={activeMapStyle}
          zoomEnabled={true}
          scrollEnabled={true}
          rotateEnabled={true}
          pitchEnabled={true}
          compassEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
          onDidFailLoadingMap={() => {
            if (!useOSMFallback) {
              setUseOSMFallback(true);
            }
          }}
        >
          <Camera
            ref={cameraRef}
            defaultSettings={{
              centerCoordinate: [
                pharmacy?.longitude ?? 0,
                pharmacy?.latitude ?? 0,
              ],
              zoomLevel: 15,
            }}
          />

          {/* User location dot — onUpdate stores coords for the locate button */}
          <UserLocation
            visible={true}
            onUpdate={(location) => {
              userLocationRef.current = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              };
            }}
          />

          {/* Pharmacy marker */}
          {pharmacy && (
            <MarkerView
              coordinate={[pharmacy.longitude, pharmacy.latitude]}
              anchor={{ x: 0.5, y: 1 }}
            >
              <View style={styles.marker_wrapper} collapsable={false}>
                <View
                  style={[
                    styles.marker_bubble,
                    { backgroundColor: pharmacy.open ? "#09C849" : "#EF4444" },
                  ]}
                >
                  <Ionicons name="medkit" size={16} color="#fff" />
                </View>
                <View
                  style={[
                    styles.marker_tail,
                    { borderTopColor: pharmacy.open ? "#09C849" : "#EF4444" },
                  ]}
                />
              </View>
            </MarkerView>
          )}

          {/* OSRM route polyline */}
          {routeGeoJSON && (
            <ShapeSource id="route-source" shape={routeGeoJSON}>
              <LineLayer
                id="route-line"
                style={{
                  lineColor: "#1A73E8",
                  lineWidth: 4,
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </ShapeSource>
          )}
        </MapView>

        {/* OSM fallback notice */}
        {useOSMFallback && (
          <View style={[styles.osm_notice, { backgroundColor: theme.card }]}>
            <Ionicons
              name="information-circle-outline"
              size={13}
              color={theme.itemDescription}
            />
            <Text
              style={[styles.osm_notice_text, { color: theme.itemDescription }]}
            >
              Using OpenStreetMap
            </Text>
          </View>
        )}

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
              {formatDistance(Number(distance))}
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

        {/* ── User Location Button — top right ──────────────────────────────── */}
        <TouchableOpacity
          style={[styles.user_location_btn, { backgroundColor: theme.card }]}
          onPress={goToUserLocation}
        >
          <Ionicons name="locate-outline" size={20} color="#1A73E8" />
        </TouchableOpacity>

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
            style={styles.action_btn_primary}
            labelStyle={styles.action_btn_label}
            onPress={handleDirections}
            disabled={isLoadingRoute}
          >
            {hasRoute ? text.clearRoute : text.directions}
          </Button>

          {/* Call */}
          <Pressable
            style={({ pressed }) => [
              styles.action_btn_secondary,
              {
                backgroundColor: pressed ? theme.headerBg : theme.cardIcon,
                borderColor: theme.headerBg,
                opacity: hasPhone ? 1 : 0.5,
              },
            ]}
            onPress={handleCall}
            android_ripple={{ color: theme.sideLine, borderless: false }}
          >
            <Ionicons
              name="call-outline"
              size={14}
              color={hasPhone ? "#1A73E8" : theme.itemDescription}
            />
            <Text
              style={[
                styles.action_btn_secondary_label,
                { color: hasPhone ? "#1A73E8" : theme.itemDescription },
              ]}
            >
              {text.call}
            </Text>
          </Pressable>

          {/* Copy */}
          <Pressable
            style={({ pressed }) => [
              styles.action_btn_secondary,
              {
                backgroundColor: pressed ? theme.headerBg : theme.cardIcon,
                borderColor: theme.headerBg,
              },
            ]}
            onPress={handleCopy}
            android_ripple={{ color: theme.sideLine, borderless: false }}
          >
            <Ionicons name="copy-outline" size={14} color="#1A73E8" />
            <Text style={styles.action_btn_secondary_label}>{text.copy}</Text>
          </Pressable>
        </View>

        {!check && (
          <View style={styles.location_warning}>
            <Ionicons name="alert-circle-outline" size={13} color="#B45309" />
            <Text style={styles.location_warning_text}>
              {text.locationWarning}
            </Text>
          </View>
        )}
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
            <View style={styles.modal_icon_wrapper}>
              <Ionicons name="map-outline" size={32} color="#1A73E8" />
            </View>
            <Text style={[styles.modal_title, { color: theme.text }]}>
              {text.noRouteTitle}
            </Text>
            <Text style={[styles.modal_body, { color: theme.itemDescription }]}>
              {text.noRouteBody}
            </Text>
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
  // Container
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

  // OSM fallback notice
  osm_notice: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    opacity: 0.8,
  },
  osm_notice_text: {
    fontSize: 11,
    fontWeight: "500",
  },

  // User location button
  user_location_btn: {
    position: "absolute",
    top: 16,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 10,
    elevation: 3,
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
  action_btn_primary: {
    borderRadius: 50,
    flex: 2,
  },
  action_btn_label: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  action_btn_secondary: {
    flex: 1,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    overflow: "hidden",
    paddingHorizontal: 8,
  },
  action_btn_secondary_label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A73E8",
    letterSpacing: 0.1,
  },
  location_warning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFBEB",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  location_warning_text: {
    fontSize: 12,
    color: "#92400E",
    flex: 1,
    lineHeight: 17,
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
  snackbar: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 120,
    backgroundColor: "#1C1C1E",
  },
});

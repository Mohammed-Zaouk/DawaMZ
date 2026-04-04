import Loading from "@/components/loading";
import { PulseDot } from "@/components/pulse_dot";
import { useLanguage } from "@/context/LanguageContext";
import { formatDistance } from "@/utils/location/calculateDistance";
import { checkLocationPermission } from "@/utils/location/getLocation";
import { supabase } from "@/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Button, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const { pharmacyId, distance, cityName, cityNameAr } = useLocalSearchParams();

  const { language } = useLanguage();
  const [check, setCheck] = useState<boolean>(true);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);

  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

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
      setRegion({
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
    setLoading(false);
  };

  const loadCheck = async () => {
    const ch = await checkLocationPermission();
    setCheck(ch);
  };

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
      latitude: Number(pharmacy?.latitude),
      longitude: Number(pharmacy?.longitude),
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };

  const getText = () => {
    if (language === "ar") {
      return {
        title: pharmacy?.name_ar,
        description: pharmacy?.address_ar,
        displayCityName: cityNameAr,
        directions: "الاتجاهات",
        call: "اتصال",
        copy: "نسخ",
        locationWarning: "فعّل الموقع لعرض المسافة والاتجاهات",
        copied: "تم نسخ العنوان",
      };
    } else if (language === "fr") {
      return {
        title: pharmacy?.name,
        description: pharmacy?.address,
        displayCityName: cityName,
        directions: "Itinéraire",
        call: "Appeler",
        copy: "Copier",
        locationWarning: "Activez la localisation pour voir la distance",
        copied: "Adresse copiée",
      };
    } else {
      return {
        title: pharmacy?.name,
        description: pharmacy?.address,
        displayCityName: cityName,
        directions: "Directions",
        call: "Call",
        copy: "Copy",
        locationWarning: "Enable location to see distance & directions",
        copied: "Address copied to clipboard",
      };
    }
  };

  const text = getText();

  const handleCall = () => {
    Linking.openURL(`tel:${pharmacy?.phone}`);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text.description as string);
    setSnackbarVisible(true);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.back_button}
        >
          <Ionicons name="chevron-back" size={18} color="#1C1C1E" />
        </TouchableOpacity>
        <View style={styles.header_info}>
          <Text
            style={styles.header_title}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text.title}
          </Text>
          <Text
            style={styles.header_subtitle}
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

      {/* Map */}
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={(r) => setRegion(r)}
          mapType="standard"
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
          <Marker
            coordinate={{
              latitude: Number(pharmacy?.latitude),
              longitude: Number(pharmacy?.longitude),
            }}
            title={text.title as string}
            description={text.description as string}
            pinColor={pharmacy?.open ? "#09C849" : "#EF4444"}
          />
        </MapView>

        {/* City Card */}
        <View style={styles.city_card}>
          <Ionicons
            name="location"
            size={14}
            color="#1A73E8"
            style={{ marginRight: 3 }}
          />
          <Text style={styles.city_text}>{text.displayCityName}</Text>
        </View>

        {/* Distance Card */}
        {distance && (
          <View style={styles.distance_card}>
            <Ionicons
              name="navigate"
              size={14}
              color="#1A73E8"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.distance_text}>
              {formatDistance(Number(distance))}
            </Text>
          </View>
        )}

        {/* Zoom Controls */}
        <View style={styles.zoom_controls}>
          <View style={styles.btn_group}>
            <TouchableOpacity style={styles.map_btn} onPress={zoomIn}>
              <Ionicons name="add" size={22} color="#1C1C1E" />
            </TouchableOpacity>
            <View style={styles.group_divider} />
            <TouchableOpacity style={styles.map_btn} onPress={zoomOut}>
              <Ionicons name="remove" size={22} color="#1C1C1E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation Controls */}
        <View style={styles.nav_controls}>
          <View style={styles.btn_group}>
            <TouchableOpacity style={styles.map_btn} onPress={resetNorth}>
              <Ionicons name="compass-outline" size={22} color="#1C1C1E" />
            </TouchableOpacity>
            <View style={styles.group_divider} />
            <TouchableOpacity
              style={styles.map_btn_pharmacy}
              onPress={goToPharmacy}
            >
              <Ionicons name="medkit-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.handle} />
        <View style={styles.action_bar}>
          <Button
            mode="contained"
            icon={() => (
              <Ionicons name="navigate-outline" size={14} color="#fff" />
            )}
            buttonColor="#1A73E8"
            textColor="#fff"
            style={styles.action_btn_primary}
            labelStyle={styles.action_btn_label}
          >
            {text.directions}
          </Button>
          <Button
            mode="outlined"
            icon={() => (
              <Ionicons name="call-outline" size={14} color="#1A73E8" />
            )}
            textColor="#1A73E8"
            style={styles.action_btn_secondary}
            labelStyle={styles.action_btn_secondary_label}
            onPress={handleCall}
          >
            {text.call}
          </Button>
          <Button
            mode="outlined"
            icon={() => (
              <Ionicons name="copy-outline" size={14} color="#1A73E8" />
            )}
            textColor="#1A73E8"
            style={styles.action_btn_secondary}
            labelStyle={styles.action_btn_secondary_label}
            onPress={handleCopy}
          >
            {text.copy}
          </Button>
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

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {text.copied}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    marginBottom: -25,
    backgroundColor: "#FFFFFF",
  },
  // Header
  header: {
    height: 62,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  back_button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F2F2F7",
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
    color: "#1C1C1E",
    letterSpacing: -0.2,
  },
  header_subtitle: {
    fontSize: 12,
    color: "#8E8E93",
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

  // City Card
  city_card: {
    position: "absolute",
    top: 16,
    left: 20,
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#FFFFFF",
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
    color: "#1C1C1E",
  },

  // Distance Card
  distance_card: {
    position: "absolute",
    top: 16,
    right: 60,
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#FFFFFF",
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
    color: "#1C1C1E",
  },

  // Zoom Controls
  zoom_controls: {
    position: "absolute",
    right: 12,
    top: 60,
  },

  // Navigation Controls
  nav_controls: {
    position: "absolute",
    right: 12,
    bottom: 16,
  },
  btn_group: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },

  // Footer
  footer: {
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#E0E0E5",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#EEF4FD",
    borderWidth: 1,
    borderColor: "#D6E4FA",
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
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  location_warning_text: {
    fontSize: 12,
    color: "#92400E",
    flex: 1,
    lineHeight: 17,
  },

  // Snackbar
  snackbar: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 100,
    backgroundColor: "#1C1C1E",
  },
});

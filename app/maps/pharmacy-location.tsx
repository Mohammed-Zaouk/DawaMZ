import { PulseDot } from "@/components/pulse_dot";
import { pharmaciesByCity } from "@/data/pharmacies";
import { getLanguage } from "@/utils/getLanguage";
import { checkLocationPermission } from "@/utils/location/getLocation";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Button, Snackbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PharmacyMap() {
  const [language, setLanguage] = useState<string | null>();
  const [check, setCheck] = useState<boolean>(true);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const { pharmacyId, cityId } = useLocalSearchParams();
  const router = useRouter();

  const pharmacies = pharmaciesByCity[cityId as string];
  const pharmacy = pharmacies.find((p) => p.id === pharmacyId);

  useEffect(() => {
    loadLanguage();
    loadCheck();
  }, []);

  const loadLanguage = async () => {
    const lang = await getLanguage();
    setLanguage(lang);
  };

  const loadCheck = async () => {
    const ch = await checkLocationPermission();
    setCheck(ch);
  };

  const getText = () => {
    if (language === "ar") {
      return {
        title: pharmacy?.nameAr,
        description: pharmacy?.addressAr,
        directions: "الاتجاهات",
        call: "اتصال",
        copy: "نسخ",
        locationWarning: "فعّل الموقع لعرض المسافة والاتجاهات",
      };
    } else if (language === "fr") {
      return {
        title: pharmacy?.name,
        description: pharmacy?.address,
        directions: "Itinéraire",
        call: "Appeler",
        copy: "Copier",
        locationWarning: "Activez la localisation pour voir la distance",
      };
    } else {
      return {
        title: pharmacy?.name,
        description: pharmacy?.address,
        directions: "Directions",
        call: "Call",
        copy: "Copy",
        locationWarning: "Enable location to see distance & directions",
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

  return (
    <SafeAreaView style={styles.container}>
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

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: Number(pharmacy?.latitude),
          longitude: Number(pharmacy?.longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType="hybrid"
        zoomEnabled={true}
        scrollEnabled={true}
        rotateEnabled={true}
        pitchEnabled={true}
        showsCompass={true}
        showsScale={true}
        showsBuildings={true}
        showsTraffic={true}
      >
        <Marker
          coordinate={{
            latitude: Number(pharmacy?.latitude),
            longitude: Number(pharmacy?.longitude),
          }}
          title={text.title}
          description={text.description}
          pinColor={pharmacy?.open ? "#09C849" : "#EF4444"}
        />
      </MapView>

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
            style={styles.action_button_primary}
            labelStyle={styles.action_button_label}
          >
            {text.directions}
          </Button>
          <Button
            mode="outlined"
            icon={() => (
              <Ionicons name="call-outline" size={14} color="#1A73E8" />
            )}
            textColor="#1A73E8"
            style={styles.action_button_secondary}
            labelStyle={styles.action_button_secondary_label}
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
            style={styles.action_button_secondary}
            labelStyle={styles.action_button_secondary_label}
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
        Address copied to clipboard
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
    backgroundColor: "#EEF4FD",
    borderWidth: 1,
    borderColor: "#D6E4FA",
  },
  action_button_secondary_label: {
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
    marginBottom: 12,
    backgroundColor: "#1C1C1E",
  },
});

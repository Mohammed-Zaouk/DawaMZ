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
  const { pharmacyId, cityId } = useLocalSearchParams();
  const pharmacies = pharmaciesByCity[cityId as string];
  const pharmacy = pharmacies.find((p) => p.id === pharmacyId);
  const [language, setLanguage] = useState<string | null>();
  const [check, setCheck] = useState<boolean>(true);
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    loadLanguage();
    loadCheck();
  }, []);

  const loadCheck = async () => {
    const ch = await checkLocationPermission();
    setCheck(ch);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${pharmacy?.phone}`);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(text.description as string);
  };

  const loadLanguage = async () => {
    const lang = await getLanguage();
    setLanguage(lang);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.header_info}>
          <Text style={styles.header_title}>{text.title}</Text>
          <Text style={styles.header_subtitle}>{text.description}</Text>
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
        <View style={styles.action_bar}>
          <Button
            mode="contained"
            icon={() => (
              <Ionicons name="location-outline" size={14} color="#fff" />
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
            labelStyle={styles.action_button_label}
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
            labelStyle={styles.action_button_label}
            onPress={handleCopy}
          >
            {text.copy}
          </Button>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={2000}
          >
            Phone number copied!
          </Snackbar>
        </View>
        {!check && (
          <View style={styles.location_warning}>
            <Ionicons name="alert-circle-outline" size={14} color="#B45309" />
            <Text style={styles.location_warning_text}>
              {text.locationWarning}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: -25,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  header_info: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header_title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a3a6e",
  },
  header_subtitle: {
    fontSize: 12,
    color: "#7a92aa",
    marginTop: 1,
  },
  header_badge: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    flex: 1,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    elevation: 8,
    shadowColor: "#000",
    borderRadius: 20,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    paddingBottom: 25,
  },
  action_bar: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    paddingBottom: 8,
  },
  action_button_primary: {
    borderRadius: 50,
    flex: 1,
  },
  action_button_secondary: {
    borderRadius: 50,
    flex: 1,
    borderColor: "#D0D0D0",
  },
  action_button_label: {
    fontSize: 12,
    fontWeight: "600",
  },
  location_warning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 12,
    marginBottom: 4,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: "#FCD34D",
  },
  location_warning_text: {
    fontSize: 12,
    color: "#B45309",
    flex: 1,
  },
});

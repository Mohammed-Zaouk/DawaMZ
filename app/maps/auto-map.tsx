import { PulseDot } from "@/components/pulse_dot";
import { getLanguage } from "@/utils/getLanguage";
import { formatDistance } from "@/utils/location/calculateDistance";
import { findNearestOpenPharmacy } from "@/utils/location/nearest-open-pharmacy";
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

export default function AutoMap() {
  const [language, setLanguage] = useState<string | null>();
  const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
  const { latitude, longitude } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
  }>();
  const router = useRouter();

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const lang = await getLanguage();
    setLanguage(lang);
  };

  const nearbypharmacy = findNearestOpenPharmacy(
    Number(latitude),
    Number(longitude),
  );

  const getText = () => {
    if (language === "ar") {
      return {
        title: nearbypharmacy.nameAr,
        description: nearbypharmacy.addressAr,
        directions: "الاتجاهات",
        call: "اتصال",
        copy: "نسخ",
        copied: "تم نسخ العنوان",
      };
    } else if (language === "fr") {
      return {
        title: nearbypharmacy.name,
        description: nearbypharmacy.address,
        directions: "Itinéraire",
        call: "Appeler",
        copy: "Copier",
        copied: "Adresse copiée",
      };
    } else {
      return {
        title: nearbypharmacy.name,
        description: nearbypharmacy.address,
        directions: "Directions",
        call: "Call",
        copy: "Copy",
        copied: "Address copied to clipboard",
      };
    }
  };

  const text = getText();
  const isOpen = nearbypharmacy.open;
  const distance = formatDistance(nearbypharmacy.distance);

  const handleCall = () => {
    Linking.openURL(`tel:${nearbypharmacy.phone}`);
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
          <PulseDot color={isOpen ? "#22c55e" : "#ef4444"} />
        </View>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: nearbypharmacy.latitude,
          longitude: nearbypharmacy.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={{
            latitude: nearbypharmacy.latitude,
            longitude: nearbypharmacy.longitude,
          }}
          title={text.title}
          description={text.description}
          pinColor={isOpen ? "#09C849" : "#EF4444"}
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
  // Snackbar
  snackbar: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#1C1C1E",
  },
});

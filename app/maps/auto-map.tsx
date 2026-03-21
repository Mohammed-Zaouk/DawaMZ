import { getLanguage } from "@/utils/getLanguage";
import { formatDistance } from "@/utils/location/calculateDistance";
import { findNearestOpenPharmacy } from "@/utils/location/nearest-open-pharmacy";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AutoMap() {
  const [language, setLanguage] = useState<string | null>();

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const lang = await getLanguage();
    setLanguage(lang);
  };
  const { latitude, longitude } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
  }>();

  const nearbypharmacy = findNearestOpenPharmacy(
    Number(latitude),
    Number(longitude),
  );

  const getText = () => {
    if (language === "ar") {
      return {
        title: nearbypharmacy[0].nameAr,
        description: nearbypharmacy[0].addressAr,
      };
    } else {
      return {
        title: nearbypharmacy[0].name,
        description: nearbypharmacy[0].address,
      };
    }
  };

  const text = getText();
  const isOpen = nearbypharmacy[0].open;
  const distance = formatDistance(nearbypharmacy[0].distance);
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: nearbypharmacy[0].latitude,
          longitude: nearbypharmacy[0].longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
      >
        <Marker
          coordinate={{
            latitude: nearbypharmacy[0].latitude,
            longitude: nearbypharmacy[0].longitude,
          }}
          title={text.title}
          description={text.description}
          pinColor={isOpen ? "#09C849" : "#EF4444"}
        />
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

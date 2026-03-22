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
  const { latitude, longitude } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
  }>();

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
      };
    } else {
      return {
        title: nearbypharmacy.name,
        description: nearbypharmacy.address,
      };
    }
  };

  const text = getText();
  const isOpen = nearbypharmacy.open;
  const distance = formatDistance(nearbypharmacy.distance);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: nearbypharmacy.latitude,
          longitude: nearbypharmacy.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
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

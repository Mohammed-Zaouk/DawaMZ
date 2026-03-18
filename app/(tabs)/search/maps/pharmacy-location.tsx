import { pharmaciesByCity } from "@/data/pharmacies";
import { getLanguage } from "@/utils/getLanguage";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PharmacyMap() {
  const { pharmacyId, cityId } = useLocalSearchParams();

  const pharmacies = pharmaciesByCity[cityId as string];
  const pharmacy = pharmacies.find((p) => p.id === pharmacyId);
  const [language, setLanguage] = useState<string | null>();

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const lang = await getLanguage();
    setLanguage(lang);
  };

  const getText = () => {
    if (language === "ar") {
      return {
        title: pharmacy?.nameAr,
        description: pharmacy?.addressAr,
      };
    } else {
      return {
        title: pharmacy?.name,
        description: pharmacy?.address,
      };
    }
  };

  const text = getText();
  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: -25,
  },
  map: {
    flex: 1,
  },
});

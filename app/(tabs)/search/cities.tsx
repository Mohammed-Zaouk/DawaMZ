import BackgroundBubbles from "@/components/background_bubbles";
import Divider from "@/components/divider_line";
import { PulseDot } from "@/components/pulse_dot";
import { citiesByRegion } from "@/data/cities";
import { pharmaciesByCity } from "@/data/pharmacies";
import { getLanguage } from "@/utils/getLanguage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CitiesPage() {
  const [searchCity, setSearchCity] = useState("");
  const [language, setLanguage] = useState<string | null>(null);
  const { regionId } = useLocalSearchParams();
  const cities = citiesByRegion[regionId as string] || [];
  const filterData = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchCity.toLowerCase()) ||
      city.nameAr.includes(searchCity),
  );

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
        total: (count: number) => `${count} صيدلية`,
        open: (count: number) => `${count} مفتوحة الان`,
        button: "عرض الصيدليات المفتوحة",
        search: "ابحث عن مدينة...",
      };
    } else if (language === "fr") {
      return {
        total: (count: number) => `${count} pharmacies`,
        open: (count: number) => `${count} ouvertes`,
        button: "Voir les pharmacies ouvertes",
        search: "Rechercher une ville...",
      };
    } else {
      return {
        total: (count: number) => `${count} pharmacies`,
        open: (count: number) => `${count} open now`,
        button: "View Open Pharmacies",
        search: "Search cities...",
      };
    }
  };

  const text = getText();

  return (
    <SafeAreaView style={styles.screen_container}>
      <BackgroundBubbles />
      <Searchbar
        placeholder={text.search}
        onChangeText={setSearchCity}
        value={searchCity}
        style={styles.search_bar}
        iconColor="#2196F3"
        placeholderTextColor="#a0b4c8"
        inputStyle={{ color: "#1a3a6e", fontSize: 16, paddingBottom: 9 }}
      />
      <FlatList
        data={filterData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardItem
            id={item.id}
            nameAr={item.nameAr}
            name={item.name}
            image={item.image}
            language={language}
            text={text}
          />
        )}
        contentContainerStyle={styles.list_container}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function CardItem({
  id,
  image,
  nameAr,
  name,
  language,
  text,
}: {
  id: string;
  nameAr: string;
  name: string;
  image: any;
  language: string | null;
  text: any;
}) {
  const router = useRouter();
  const cityPharmacies = pharmaciesByCity[id] || [];
  const allPharmacies = cityPharmacies.length;
  const openPharmacies = cityPharmacies.filter(
    (pharmacy) => pharmacy.open,
  ).length;

  return (
    <View style={styles.card}>
      <View style={styles.card_content}>
        <Text style={styles.card_title} numberOfLines={1} ellipsizeMode="tail">
          {language === "ar" ? nameAr : name}
        </Text>
        <Divider style={styles.divider} />

        <View
          style={[
            styles.subtitle_row,
            language === "ar" && styles.subtitle_row_rtl,
          ]}
        >
          <View style={styles.subtitle_chip}>
            <Ionicons name="medkit-outline" size={13} color="#7a92aa" />
            <Text
              style={styles.card_subtitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {text.total(allPharmacies)}
            </Text>
          </View>
          <View style={styles.subtitle_dot} />
          <View style={styles.subtitle_chip}>
            <PulseDot color={"#22c55e"} />
            <Text
              style={[styles.card_subtitle, styles.open_text]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {text.open(openPharmacies)}
            </Text>
          </View>
        </View>

        <View style={styles.button_container}>
          <Button
            mode="contained"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/search/pharmacies",
                params: { cityId: id },
              })
            }
            style={styles.card_button}
            labelStyle={styles.card_button_label}
          >
            {text.button}
          </Button>
        </View>
      </View>

      <View style={styles.image_container}>
        <Image source={image} style={styles.card_image} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: "#2196F3",
    gap: 20,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  search_bar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "rgba(33, 150, 243, 0.2)",
  },
  list_container: {
    gap: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#0d5fcc",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.1)",
  },
  card_content: {
    flex: 1,
    alignItems: "flex-end",
  },
  card_title: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1a3a6e",
    textAlign: "right",
    writingDirection: "rtl",
    letterSpacing: 0.2,
  },
  divider: {
    width: "100%",
    marginVertical: 5,
  },
  subtitle_row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  subtitle_row_rtl: {
    flexDirection: "row-reverse",
  },
  subtitle_chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  subtitle_dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#c5d5e8",
  },
  card_subtitle: {
    fontSize: 13,
    color: "#7a92aa",
    fontWeight: "500",
  },
  open_text: {
    color: "#4caf7d",
  },
  button_container: {
    alignSelf: "flex-start",
    marginTop: 12,
  },
  card_button: {
    borderRadius: 20,
    backgroundColor: "#2d87f0",
  },
  card_button_label: {
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0.3,
    color: "#ffffff",
  },
  image_container: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    marginLeft: 12,
    borderWidth: 2.5,
    borderColor: "#d6eaff",
    backgroundColor: "#eef5ff",
  },
  card_image: {
    width: "100%",
    height: "100%",
  },
});

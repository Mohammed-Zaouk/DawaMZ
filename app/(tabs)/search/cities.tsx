import Divider from "@/components/divider_line";
import { citiesByRegion } from "@/data/cities";
import { getLanguage } from "@/utils/getLanguage";
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

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const lang = await getLanguage();
    setLanguage(lang);
  };

  return (
    <SafeAreaView style={styles.screen_container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchCity}
        style={styles.search_bar}
        value={searchCity}
      />
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardItem
            id={item.id}
            nameAr={item.nameAr}
            name={item.name}
            image={item.image}
            language={language}
          />
        )}
        contentContainerStyle={styles.list_container}
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
}: {
  id: string;
  nameAr: string;
  name: string;
  image: any;
  language: string | null;
}) {
  const router = useRouter();

  const getText = () => {
    if (language === "ar") {
      return {
        subtitle: "صيدليات 3.5الف ⭐ : مفتوحة الان 12 🌛",
        button: "عرض الصيدليات المفتوحة",
      };
    } else if (language === "fr") {
      return {
        subtitle: "3.5k pharmacies ⭐ : 12 ouvertes maintenant 🌛",
        button: "Voir les pharmacies ouvertes",
      };
    } else {
      return {
        subtitle: "3.5k pharmacies ⭐ : 12 open now 🌛",
        button: "View Open Pharmacies",
      };
    }
  };

  const text = getText();

  return (
    <View style={styles.card}>
      <View style={styles.card_content}>
        <Text style={styles.card_title} numberOfLines={1} ellipsizeMode="tail">
          {language === "ar" ? nameAr : name}
        </Text>
        <Divider style={styles.divider} />
        <Text
          style={styles.card_subtitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {text.subtitle}
        </Text>
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
          >
            {text.button}
          </Button>
        </View>
      </View>
      <View style={styles.image_container}>
        <Image source={image} style={styles.card_image} resizeMode="center" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: "#2196F3",
    gap: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
  },
  search_bar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
  },
  list_container: {
    gap: 15,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image_container: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: "hidden",
    marginLeft: 12,
    backgroundColor: "#eee",
  },
  card_image: {
    width: "100%",
    height: "100%",
  },
  card_content: {
    flex: 1,
    alignItems: "flex-end",
  },
  card_title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#274796",
    textAlign: "right",
    writingDirection: "rtl",
  },
  divider: {
    width: "100%",
    marginVertical: 5,
  },
  card_subtitle: {
    fontSize: 13,
    color: "#888888",
    textAlign: "right",
    writingDirection: "rtl",
  },
  button_container: {
    alignSelf: "flex-start",
    marginTop: 10,
  },
  card_button: {
    borderRadius: 20,
    backgroundColor: "#3385FF",
  },
});

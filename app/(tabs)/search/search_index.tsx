import Divider from "@/components/divider_line";
import { regions } from "@/data/regions";
import { getLanguage } from "@/utils/getLanguage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchIndex() {
  const [searchRegion, setSearchRegion] = useState("");
  const [language, setLanguage] = useState<string | null>(null);

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
        onChangeText={setSearchRegion}
        value={searchRegion}
        style={styles.search_bar}
        iconColor="#666"
      />
      <FlatList
        data={regions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardItem
            id={item.id}
            name={item.name}
            nameAr={item.nameAr}
            nameEn={item.nameEn}
            image={item.image}
            cities={item.cities}
            citiesAr={item.citiesAr}
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
  name,
  nameAr,
  nameEn,
  image,
  cities,
  citiesAr,
  language,
}: {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  image: any;
  cities: string;
  citiesAr: string;
  language: string | null;
}) {
  const router = useRouter();

  const getButtonText = () => {
    if (language === "ar") return "عرض المدن";
    if (language === "fr") return "Voir les villes";
    return "View Cities";
  };

  return (
    <View style={styles.card}>
      <View style={styles.card_content}>
        <Text style={styles.card_title} numberOfLines={1} ellipsizeMode="tail">
          {language === "ar" ? nameAr : language === "fr" ? name : nameEn}
        </Text>
        <Divider style={styles.divider} />
        <Text
          style={styles.card_subtitle}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {language === "ar" ? citiesAr : cities}
        </Text>
        <View style={styles.button_container}>
          <Button
            mode="contained"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/search/cities",
                params: { regionId: id },
              })
            }
            style={styles.card_button}
          >
            {getButtonText()}
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
    flexDirection: "row",
    borderColor: "#FFFFFF",
    borderStyle: "solid",
    justifyContent: "flex-end",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
  },
  image_container: {
    position: "relative",
    maxHeight: 110,
    maxWidth: 110,
  },
  card_image: {
    height: 110,
    width: 110,
  },
  card_content: {
    flex: 1,
    flexDirection: "column",
    padding: 12,
    paddingRight: 8,
  },
  card_title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#274796",
    textAlign: "right",
    writingDirection: "rtl",
    flexShrink: 1,
  },
  divider: {
    marginVertical: 5,
  },
  card_subtitle: {
    fontSize: 13,
    color: "#888888",
    textAlign: "right",
    writingDirection: "rtl",
    flexShrink: 1,
  },
  button_container: {
    marginTop: 8,
  },
  card_button: {
    borderRadius: 20,
    backgroundColor: "#3385FF",
  },
});

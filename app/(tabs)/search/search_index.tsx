import BackgroundBubbles from "@/components/background_bubbles";
import Divider from "@/components/divider_line";
import { useLanguage } from "@/context/LanguageContext";
import { regions } from "@/data/regions";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchIndex() {
  const [searchRegion, setSearchRegion] = useState("");
  const { language } = useLanguage();
  const getText = () => {
    if (language === "ar")
      return { button: "عرض المدن", search: "ابحث عن منطقة أو مدينة..." };
    if (language === "fr")
      return {
        button: "Voir les villes",
        search: "Rechercher une région ou ville...",
      };
    return { button: "View Cities", search: "Search regions or cities..." };
  };

  const text = getText();

  const filterData = regions.filter(
    (region) =>
      region.name
        .toLocaleLowerCase()
        .includes(searchRegion.toLocaleLowerCase()) ||
      region.nameAr.includes(searchRegion) ||
      region.cities.toLowerCase().includes(searchRegion.toLowerCase()) ||
      region.citiesAr.includes(searchRegion),
  );

  return (
    <SafeAreaView style={styles.screen_container}>
      <BackgroundBubbles />
      <Searchbar
        placeholder={text.search}
        onChangeText={setSearchRegion}
        value={searchRegion}
        style={styles.search_bar}
        keyboardType="default"
        textContentType="none"
        autoCorrect={false}
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
            name={item.name}
            nameAr={item.nameAr}
            nameEn={item.nameEn}
            image={item.image}
            cities={item.cities}
            citiesAr={item.citiesAr}
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
  name,
  nameAr,
  nameEn,
  image,
  cities,
  citiesAr,
  language,
  text,
}: {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  image: any;
  cities: string;
  citiesAr: string;
  language: string | null;
  text: any;
}) {
  const router = useRouter();

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
            labelStyle={styles.card_button_label}
            contentStyle={styles.card_button_content}
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
  // Screen
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
  // Card
  card: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#0a50b8",
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    borderWidth: 1,
    borderColor: "rgba(33, 150, 243, 0.1)",
  },
  card_content: {
    flex: 1,
    flexDirection: "column",
    padding: 12,
    paddingRight: 8,
  },
  card_title: {
    fontSize: 16.4,
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
    fontSize: 12.6,
    color: "#888888",
    textAlign: "right",
    writingDirection: "rtl",
    flexShrink: 1,
  },
  button_container: {
    marginTop: 8,
    shadowColor: "#1a6fd4",
    shadowOpacity: 0.28,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  card_button: {
    borderRadius: 24,
    backgroundColor: "#3385FF",
  },
  card_button_label: {
    fontWeight: "700",
    letterSpacing: 0.2,
    color: "#ffffff",
  },
  card_button_content: {
    paddingVertical: 2,
  },
  // Image
  image_container: {
    maxHeight: 110,
    maxWidth: 110,
  },
  card_image: {
    height: 110,
    width: 110,
  },
});

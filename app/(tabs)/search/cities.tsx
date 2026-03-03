import Divider from "@/components/divider_line";
import { citiesByRegion } from "@/data/cities";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CitiesPage() {
  const [searchCity, setSearchCity] = useState("");
  const { regionId } = useLocalSearchParams();
  const cities = citiesByRegion[regionId as string] || [];

  return (
    <SafeAreaView style={styles.screen_container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchCity}
        value={searchCity}
      />
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardItem id={item.id} nameAr={item.nameAr} image={item.image} />
        )}
      />
    </SafeAreaView>
  );
}

function CardItem({
  id,
  image,
  nameAr,
}: {
  id: string;
  nameAr: string;
  image: any;
}) {
  const router = useRouter();
  return (
    <View style={styles.card}>
      <View style={styles.card_content}>
        <Text style={styles.card_title}>{nameAr}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.card_subtitle}>
          صيدليات 3.5الف ⭐ : مفتوحة الان 12 🌛
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
            عرض الصيدليات المفتوحة
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
  screen_container: {},
  search_bar: {},
  list_container: {},
  card: {},
  image_container: {},
  card_image: {},
  card_content: {},
  card_title: {},
  divider: {},
  card_subtitle: {},
  button_container: {},
  card_button: {},
});

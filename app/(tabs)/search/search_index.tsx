import Divider from "@/components/divider_line";
import { regions } from "@/data/regions";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchIndex() {
  const [searchRegion, setSearchRegion] = useState("");
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
            nameAr={item.nameAr}
            image={item.image}
            citiesAr={item.citiesAr}
          />
        )}
        contentContainerStyle={styles.list_container}
      />
    </SafeAreaView>
  );
}

function CardItem({
  id,
  nameAr,
  image,
  citiesAr,
}: {
  id: string;
  nameAr: string;
  image: any;
  citiesAr: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.card}>
      <View style={styles.card_content}>
        <Text style={styles.card_title}>{nameAr}</Text>
        <Divider />
        <Text style={styles.card_subtitle}>{citiesAr}</Text>
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
            عرض المدن
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
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 32,
    paddingLeft: 10,
    paddingRight: 10,
  },
  search_bar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
    shadowOpacity: 0,
  },
  list_container: {
    gap: 25,
  },
  card: {
    flexDirection: "row",
    borderColor: "red",
    borderStyle: "solid",
    justifyContent: "flex-end",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
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
    flexDirection: "column",
    height: 120,
  },
  card_title: {
    // Add your styles
  },
  card_subtitle: {
    // Add your styles
  },
  button_container: {
    // Add your styles
  },
  card_button: {
    // Add your styles
  },
});

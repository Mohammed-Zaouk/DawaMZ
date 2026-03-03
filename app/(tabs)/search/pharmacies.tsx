import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const pharmaciesByCity: Record<
  string,
  { id: string; name: string; address: string }[]
> = {
  "1": [
    { id: "1", name: "Pharmacy Al Amal", address: "123 Main St" },
    { id: "2", name: "Pharmacy Assafa", address: "456 High St" },
  ],
};

export default function PharmaciesPage() {
  const [searchPharmacie, setSearchPharmacie] = useState("");
  const { cityId } = useLocalSearchParams();
  const pharmacies = pharmaciesByCity[cityId as string] || [];

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search"
        onChangeText={setSearchPharmacie}
        value={searchPharmacie}
      />
      <FlatList
        data={pharmacies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardItem id={item.id} name={item.name} address={item.address} />
        )}
      />
    </SafeAreaView>
  );
}

function CardItem({
  id,
  name,
  address,
}: {
  id: string;
  name: string;
  address: string;
}) {
  return (
    <Text>
      {id} : {name} : {address}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

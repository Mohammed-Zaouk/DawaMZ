import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Chip } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Divider from "../../components/divider_line";

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.screen_container}>
      <View style={styles.logo_section}>
        <Image
          source={require("../../assets/images/logo/logo.png")}
          style={styles.logo_image}
        />
        <Text style={styles.logo_title}>DawaMZ</Text>
      </View>
      <View style={styles.header_section}>
        <Text style={styles.page_title}>Search for pharmacies</Text>
        <Divider />
        <Text style={styles.page_subtitle}>
          On-call pharmacies - Night pharmacies...etc.
        </Text>
      </View>
      <View style={styles.search_cards_container}>
        <TouchableOpacity>
          <View style={styles.search_card}>
            <View style={styles.tag_container}>
              <Ionicons
                name="location"
                size={32}
                color="#333"
                style={{ padding: 5 }}
              />
            </View>

            <View style={styles.card_text_section}>
              <Text style={styles.card_title}>Auto Search</Text>
              <Divider style={{ marginVertical: 3 }} />
              <Text style={styles.card_subtitle}>
                It automatically searches for pharmacies near you.
              </Text>
            </View>

            <Chip
              mode="flat"
              style={styles.auto_badge}
              textStyle={{ color: "#FFFFFF", fontSize: 12 }}
            >
              Auto
            </Chip>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/search/search_index")}
        >
          <View style={styles.search_card}>
            <View style={styles.tag_container}>
              <Ionicons
                name="map"
                size={32}
                color="#333"
                style={{ padding: 5 }}
              />
            </View>

            <View style={styles.card_text_section}>
              <Text style={styles.card_title}>manual search</Text>
              <Divider style={{ marginVertical: 3 }} />
              <Text style={styles.card_subtitle}>Search by region/city</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    gap: 30,
  },
  logo_section: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 60,
  },
  logo_image: {
    width: 214,
    height: 201,
    marginBottom: -55,
  },
  logo_title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: "System",
  },
  header_section: {
    // Add your styles
  },
  page_title: {
    fontSize: 23,
    fontWeight: "semibold",
    color: "#EAF3FF",
    textAlign: "center",
  },
  page_subtitle: {
    fontSize: 14,
    color: "#D9DEE3",
    textAlign: "center",
    opacity: 0.85,
  },
  search_cards_container: {
    width: "100%",
    gap: 20,
  },
  search_card: {
    flexDirection: "row",
    alignItems: "center",
    height: 90,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card_text_section: {
    justifyContent: "center",
    flex: 1,
  },
  card_title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E1E1E",
    marginBottom: 4,
  },
  card_subtitle: {
    fontSize: 12,
    color: "#666666",
  },
  auto_badge: {
    backgroundColor: "#4CAF50",
    position: "absolute",
    right: 0,
    top: 8,
    height: 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 12,
  },
  tag_container: {
    borderRadius: 100,
    backgroundColor: "#8EBEF4",
  },
});

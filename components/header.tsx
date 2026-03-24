import { Image, StyleSheet, Text, View } from "react-native";

export default function Header() {
  return (
    <>
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo/logo.png")}
          style={styles.logo_image}
        />
        <View style={styles.logo_text_container}>
          <Text style={styles.logo_text_first}>Dawa</Text>
          <Text style={styles.logo_text_second}>MZ</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    maxHeight: 80,
    backgroundColor: "#BBDEFB",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 10,
  },
  logo_image: {
    width: 70,
    height: 70,
  },
  logo_text_container: {
    flexDirection: "row",
    marginLeft: -10,
  },
  logo_text_first: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333333",
  },
  logo_text_second: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2196F3",
  },
});

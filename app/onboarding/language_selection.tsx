import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LanguageSelectionPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const saveLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem("selectedLanguage", language);
      setSelected(language);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.image_container}>
        <Image
          source={require("../../assets/images/logo/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>DawaMZ</Text>
      </View>
      <View>
        <Text style={styles.instruction_text}>Choose Your Language</Text>
        <Text style={styles.instruction_text}>اختر اللغة</Text>
        <Text style={styles.instruction_text}>Choisissez la langue</Text>
      </View>
      <View style={styles.button_container}>
        <Button
          mode="contained"
          onPress={() => saveLanguage("ar")}
          style={styles.language_button}
          buttonColor={selected === "ar" ? "#09C849" : "#FFFFFF"}
          textColor={selected === "ar" ? "#FFFFFF" : "#1E7FC1"}
        >
          🇲🇦 العربية
        </Button>
        <Button
          mode="contained"
          onPress={() => saveLanguage("en")}
          style={styles.language_button}
          buttonColor={selected === "en" ? "#09C849" : "#FFFFFF"}
          textColor={selected === "en" ? "#FFFFFF" : "#1E7FC1"}
        >
          🇬🇧 English
        </Button>
        <Button
          mode="contained"
          onPress={() => saveLanguage("fr")}
          style={styles.language_button}
          buttonColor={selected === "fr" ? "#09C849" : "#FFFFFF"}
          textColor={selected === "fr" ? "#FFFFFF" : "#1E7FC1"}
        >
          🇫🇷 French
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2196F3",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    gap: 30,
  },
  // Image & Title
  image_container: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 60,
  },
  logo: {
    width: 214,
    height: 201,
    marginBottom: -55,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: "System",
  },
  // Instructions
  instruction_text: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    opacity: 0.9,
    marginVertical: 2,
    fontWeight: "400",
  },
  // Buttons
  button_container: {
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  language_button: {
    width: 205,
    height: 51,
    justifyContent: "center",
  },
});

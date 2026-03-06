import AsyncStorage from "@react-native-async-storage/async-storage";

export const getLanguage = async (): Promise<string | null> => {
  try {
    const language = await AsyncStorage.getItem("selectedLanguage");
    return language;
  } catch (error) {
    console.error("Error getting language:", error);
    return null;
  }
};

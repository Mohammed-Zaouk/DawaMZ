import { getLanguage } from "@/utils/getLanguage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type Language = "ar" | "fr" | "en";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
};

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  setLanguage: async () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    getLanguage().then((lang) => {
      if (lang) setLanguageState(lang as Language);
    });
  }, []);

  const setLanguage = async (lang: Language) => {
    await AsyncStorage.setItem("selectedLanguage", lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

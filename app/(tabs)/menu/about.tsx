import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { useLanguage } from "@/context/LanguageContext";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function About() {
  const { language } = useLanguage();

  const isRTL = language === "ar";
  const rtlStyle = {
    writingDirection: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
  } as const;

  const getText = () => {
    const currentYear = new Date().getFullYear();
    if (language === "ar") {
      return {
        title: "حول التطبيق",
        version: "الإصدار 1.0.0",

        aboutTitle: "ما هو DawaMZ؟",
        aboutContent:
          "DawaMZ هو تطبيقك الموثوق للعثور على الصيدليات في جميع أنحاء المغرب. نساعدك في تحديد موقع الصيدليات المناوبة، والصيدليات الليلية، والصيدليات القريبة منك بسهولة وسرعة.",

        featuresTitle: "المميزات",
        feature1: "البحث عن الصيدليات حسب المنطقة والمدينة",
        feature2: "عرض الصيدليات المفتوحة حالياً",
        feature3: "الحصول على الاتجاهات إلى أقرب صيدلية",
        feature4: "واجهة بسيطة وسهلة الاستخدام",
        feature5: "دعم ثلاث لغات: العربية، الفرنسية، والإنجليزية",
        feature6: "مجاني تماماً بدون إعلانات",

        missionTitle: "مهمتنا",
        missionContent:
          "نهدف إلى تسهيل الوصول إلى الخدمات الصحية في المغرب من خلال توفير معلومات دقيقة وسهلة الوصول عن الصيدليات.",

        freeTitle: "مجاني 100٪",
        freeContent:
          "التطبيق مجاني تماماً بدون إعلانات أو عمليات شراء داخل التطبيق. نؤمن بأن الوصول إلى معلومات الصيدليات يجب أن يكون متاحاً للجميع.",

        dataTitle: "خصوصيتك مهمة",
        dataContent:
          "نحن نحترم خصوصيتك. التطبيق يستخدم موقعك فقط محلياً للعثور على الصيدليات القريبة. لا نحفظ أو نشارك معلوماتك الشخصية.",

        copyright: `© ${currentYear} DawaMZ. جميع الحقوق محفوظة.`,
      };
    } else if (language === "fr") {
      return {
        title: "À propos",
        version: "Version 1.0.0",

        aboutTitle: "Qu'est-ce que DawaMZ ?",
        aboutContent:
          "DawaMZ est votre application de confiance pour trouver des pharmacies partout au Maroc. Nous vous aidons à localiser les pharmacies de garde, les pharmacies de nuit et les pharmacies près de vous facilement et rapidement.",

        featuresTitle: "Fonctionnalités",
        feature1: "Recherche de pharmacies par région et ville",
        feature2: "Affichage des pharmacies ouvertes actuellement",
        feature3: "Obtenir un itinéraire vers la pharmacie la plus proche",
        feature4: "Interface simple et facile à utiliser",
        feature5: "Support de trois langues : arabe, français et anglais",
        feature6: "Entièrement gratuit sans publicités",

        missionTitle: "Notre mission",
        missionContent:
          "Nous visons à faciliter l'accès aux services de santé au Maroc en fournissant des informations précises et facilement accessibles sur les pharmacies.",

        freeTitle: "100 % gratuit",
        freeContent:
          "L'application est entièrement gratuite sans publicités ni achats intégrés. Nous croyons que l'accès aux informations sur les pharmacies devrait être disponible pour tous.",

        dataTitle: "Votre vie privée compte",
        dataContent:
          "Nous respectons votre vie privée. L'application utilise votre position uniquement localement pour trouver les pharmacies à proximité. Nous ne sauvegardons ni ne partageons vos informations personnelles.",

        copyright: `© ${currentYear} DawaMZ. Tous droits réservés.`,
      };
    } else {
      return {
        title: "About",
        version: "Version 1.0.0",

        aboutTitle: "What is DawaMZ?",
        aboutContent:
          "DawaMZ is your trusted app for finding pharmacies across Morocco. We help you locate on-call pharmacies, night pharmacies, and pharmacies near you easily and quickly.",

        featuresTitle: "Features",
        feature1: "Search pharmacies by region and city",
        feature2: "View pharmacies open now",
        feature3: "Get directions to the nearest pharmacy",
        feature4: "Simple and easy-to-use interface",
        feature5: "Support for three languages: Arabic, French, and English",
        feature6: "Completely free with no ads",

        missionTitle: "Our Mission",
        missionContent:
          "We aim to make accessing healthcare services in Morocco easier by providing accurate and easily accessible pharmacy information.",

        freeTitle: "100% Free",
        freeContent:
          "The app is completely free with no ads or in-app purchases. We believe access to pharmacy information should be available to everyone.",

        dataTitle: "Your Privacy Matters",
        dataContent:
          "We respect your privacy. The app uses your location only locally to find nearby pharmacies. We do not save or share your personal information.",

        copyright: `© ${currentYear} DawaMZ. All rights reserved.`,
      };
    }
  };

  const text = getText();

  const features = [
    text.feature1,
    text.feature2,
    text.feature3,
    text.feature4,
    text.feature5,
    text.feature6,
  ];

  return (
    <SafeAreaView style={styles.screen_container}>
      <BackgroundBubbles />
      <Header />

      <View style={styles.content_container}>
        <ScrollView
          style={styles.scroll_content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logo_section}>
            <Image
              source={require("@/assets/images/logo/logo.png")}
              style={styles.big_logo}
            />
            <Text style={styles.app_name}>DawaMZ</Text>
            <Text style={styles.version}>{text.version}</Text>
          </View>

          <Text style={[styles.section_title, rtlStyle]}>
            {text.aboutTitle}
          </Text>
          <Text style={[styles.section_content, rtlStyle]}>
            {text.aboutContent}
          </Text>

          <Text style={[styles.section_title, rtlStyle]}>
            {text.featuresTitle}
          </Text>
          <View style={styles.features_container}>
            {features.map((feature, index) => (
              <Text key={index} style={[styles.feature, rtlStyle]}>
                • {feature}
              </Text>
            ))}
          </View>

          <Text style={[styles.section_title, rtlStyle]}>
            {text.missionTitle}
          </Text>
          <Text style={[styles.section_content, rtlStyle]}>
            {text.missionContent}
          </Text>

          <Text style={[styles.section_title, rtlStyle]}>{text.freeTitle}</Text>
          <Text style={[styles.section_content, rtlStyle]}>
            {text.freeContent}
          </Text>

          <Text style={[styles.section_title, rtlStyle]}>{text.dataTitle}</Text>
          <Text style={[styles.section_content, rtlStyle]}>
            {text.dataContent}
          </Text>

          <Text style={styles.copyright}>{text.copyright}</Text>

          <View style={styles.footer_spacing} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen_container: {
    flex: 1,
    backgroundColor: "#2196F3",
    gap: 50,
  },
  content_container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    marginHorizontal: 10,
    marginBottom: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  scroll_content: {
    paddingHorizontal: 22,
  },
  logo_section: {
    alignItems: "center",
    marginBottom: 30,
  },
  big_logo: {
    width: 120,
    height: 120,
  },
  app_name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 5,
    marginTop: -25,
  },
  version: {
    fontSize: 14,
    color: "#aab0be",
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  section_title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2196F3",
    marginTop: 10,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  section_content: {
    fontSize: 14,
    color: "#5a6478",
    lineHeight: 22,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  features_container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  feature: {
    fontSize: 14,
    color: "#5a6478",
    lineHeight: 24,
  },
  copyright: {
    fontSize: 12,
    color: "#aab0be",
    textAlign: "center",
    marginTop: 30,
    fontWeight: "500",
  },
  footer_spacing: {
    height: 40,
  },
});

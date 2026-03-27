import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Privacy() {
  const { language } = useLanguage();

  const isRTL = language === "ar";
  const rtlStyle = {
    writingDirection: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
  } as const;

  const getText = () => {
    if (language === "ar") {
      return {
        title: "سياسة الخصوصية",
        lastUpdated: "آخر تحديث: 9 مارس 2026",
        intro:
          "نحن في DawaMZ نحترم خصوصيتك. هذه السياسة توضح كيفية جمع واستخدام بياناتك.",

        section1Title: "1. المعلومات التي نجمعها",
        section1Content:
          "نقوم بجمع المعلومات التالية:\n\n• الموقع الجغرافي: نستخدم موقعك فقط للعثور على الصيدليات القريبة منك. لا نحفظ أو نشارك موقعك.\n\n• تفضيلات اللغة: لعرض التطبيق باللغة التي تختارها.\n\n• بيانات الاستخدام: معلومات حول كيفية استخدامك للتطبيق لتحسين الخدمة.",

        section2Title: "2. كيف نستخدم معلوماتك",
        section2Content:
          "نستخدم معلوماتك فقط لـ:\n\n• عرض الصيدليات القريبة من موقعك الحالي\n• تذكر تفضيلاتك في اللغة\n• تحسين أداء التطبيق وإصلاح الأخطاء",

        section3Title: "3. مشاركة المعلومات",
        section3Content:
          "نحن لا نبيع أو نشارك أو ننقل معلوماتك الشخصية إلى أطراف ثالثة بأي شكل من الأشكال.\n\nموقعك الجغرافي يُستخدم محلياً على جهازك فقط ولا يُرسل إلى خوادمنا.",

        section4Title: "4. تخزين البيانات",
        section4Content:
          "• تفضيلات اللغة تُحفظ محلياً على جهازك فقط\n• لا نحفظ موقعك الجغرافي\n• لا نجمع معلومات شخصية تعريفية",

        section5Title: "5. حقوقك",
        section5Content:
          "يمكنك:\n\n• إلغاء تثبيت التطبيق في أي وقت لحذف جميع البيانات\n• تعطيل خدمات الموقع من إعدادات جهازك\n• تغيير تفضيلات اللغة في أي وقت",

        section6Title: "6. أمان البيانات",
        section6Content:
          "جميع البيانات المخزنة محلياً على جهازك محمية بواسطة نظام تشغيل جهازك.",

        section7Title: "7. التطبيق مجاني تماماً",
        section7Content:
          "التطبيق مجاني 100٪ بدون إعلانات أو عمليات شراء داخل التطبيق.",

        section8Title: "8. التغييرات على هذه السياسة",
        section8Content:
          "قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سيتم إخطارك بأي تغييرات مهمة.",

        section9Title: "9. الاتصال بنا",
        section9Content:
          "إذا كان لديك أسئلة حول هذه السياسة، يمكنك الاتصال بنا عبر صفحة التطبيق في متجر التطبيقات.",
      };
    } else if (language === "fr") {
      return {
        title: "Politique de confidentialité",
        lastUpdated: "Dernière mise à jour : 9 mars 2026",
        intro:
          "Chez DawaMZ, nous respectons votre vie privée. Cette politique explique comment nous collectons et utilisons vos données.",

        section1Title: "1. Informations que nous collectons",
        section1Content:
          "Nous collectons les informations suivantes :\n\n• Localisation géographique : Nous utilisons votre position uniquement pour trouver les pharmacies près de vous. Nous ne sauvegardons ni ne partageons votre position.\n\n• Préférences linguistiques : Pour afficher l'application dans la langue de votre choix.\n\n• Données d'utilisation : Informations sur la façon dont vous utilisez l'application pour améliorer le service.",

        section2Title: "2. Comment nous utilisons vos informations",
        section2Content:
          "Nous utilisons vos informations uniquement pour :\n\n• Afficher les pharmacies près de votre position actuelle\n• Mémoriser vos préférences linguistiques\n• Améliorer les performances de l'application et corriger les bugs",

        section3Title: "3. Partage d'informations",
        section3Content:
          "Nous ne vendons, ne partageons ni ne transférons vos informations personnelles à des tiers de quelque manière que ce soit.\n\nVotre localisation est utilisée localement sur votre appareil uniquement et n'est pas envoyée à nos serveurs.",

        section4Title: "4. Stockage des données",
        section4Content:
          "• Les préférences linguistiques sont enregistrées localement sur votre appareil uniquement\n• Nous ne sauvegardons pas votre localisation\n• Nous ne collectons aucune information personnellement identifiable",

        section5Title: "5. Vos droits",
        section5Content:
          "Vous pouvez :\n\n• Désinstaller l'application à tout moment pour supprimer toutes les données\n• Désactiver les services de localisation depuis les paramètres de votre appareil\n• Modifier vos préférences linguistiques à tout moment",

        section6Title: "6. Sécurité des données",
        section6Content:
          "Toutes les données stockées localement sur votre appareil sont protégées par le système d'exploitation de votre appareil.",

        section7Title: "7. L'application est entièrement gratuite",
        section7Content:
          "L'application est 100 % gratuite sans publicités ni achats intégrés.",

        section8Title: "8. Modifications de cette politique",
        section8Content:
          "Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Vous serez informé de tout changement important.",

        section9Title: "9. Nous contacter",
        section9Content:
          "Si vous avez des questions concernant cette politique, vous pouvez nous contacter via la page de l'application dans le magasin d'applications.",
      };
    } else {
      return {
        title: "Privacy Policy",
        lastUpdated: "Last updated: March 9, 2026",
        intro:
          "At DawaMZ, we respect your privacy. This policy explains how we collect and use your data.",

        section1Title: "1. Information We Collect",
        section1Content:
          "We collect the following information:\n\n• Geographic Location: We use your location only to find pharmacies near you. We do not save or share your location.\n\n• Language Preferences: To display the app in your chosen language.\n\n• Usage Data: Information about how you use the app to improve the service.",

        section2Title: "2. How We Use Your Information",
        section2Content:
          "We use your information only to:\n\n• Display pharmacies near your current location\n• Remember your language preferences\n• Improve app performance and fix bugs",

        section3Title: "3. Information Sharing",
        section3Content:
          "We do not sell, share, or transfer your personal information to third parties in any way.\n\nYour location is used locally on your device only and is not sent to our servers.",

        section4Title: "4. Data Storage",
        section4Content:
          "• Language preferences are saved locally on your device only\n• We do not save your location\n• We do not collect personally identifiable information",

        section5Title: "5. Your Rights",
        section5Content:
          "You can:\n\n• Uninstall the app at any time to delete all data\n• Disable location services from your device settings\n• Change language preferences at any time",

        section6Title: "6. Data Security",
        section6Content:
          "All data stored locally on your device is protected by your device's operating system.",

        section7Title: "7. The App is Completely Free",
        section7Content:
          "The app is 100% free with no ads or in-app purchases.",

        section8Title: "8. Changes to This Policy",
        section8Content:
          "We may update this privacy policy from time to time. You will be notified of any significant changes.",

        section9Title: "9. Contact Us",
        section9Content:
          "If you have questions about this policy, you can contact us through the app page in the app store.",
      };
    }
  };

  const text = getText();

  const sections = [
    { title: text.section1Title, content: text.section1Content },
    { title: text.section2Title, content: text.section2Content },
    { title: text.section3Title, content: text.section3Content },
    { title: text.section4Title, content: text.section4Content },
    { title: text.section5Title, content: text.section5Content },
    { title: text.section6Title, content: text.section6Content },
    { title: text.section7Title, content: text.section7Content },
    { title: text.section8Title, content: text.section8Content },
    { title: text.section9Title, content: text.section9Content },
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
          <Text style={[styles.title, rtlStyle]}>{text.title}</Text>
          <Text style={[styles.last_updated, rtlStyle]}>
            {text.lastUpdated}
          </Text>

          <Text
            style={[
              styles.intro,
              rtlStyle,
              isRTL ? styles.intro_rtl : styles.intro_ltr,
            ]}
          >
            {text.intro}
          </Text>

          {sections.map((section, index) => (
            <View key={index}>
              <Text style={[styles.section_title, rtlStyle]}>
                {section.title}
              </Text>
              <Text style={[styles.section_content, rtlStyle]}>
                {section.content}
              </Text>
            </View>
          ))}

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
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a2e",
    letterSpacing: -0.5,
  },
  last_updated: {
    fontSize: 12,
    color: "#aab0be",
    marginBottom: 20,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  intro: {
    fontSize: 15,
    color: "#4a5568",
    lineHeight: 24,
    marginBottom: 10,
    backgroundColor: "#eaf3ff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  intro_ltr: {
    borderLeftWidth: 3,
    borderLeftColor: "#2196F3",
    borderRightWidth: 0,
  },
  intro_rtl: {
    borderRightWidth: 3,
    borderRightColor: "#2196F3",
    borderLeftWidth: 0,
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
  footer_spacing: {
    height: 40,
  },
});

import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { useLanguage } from "@/context/LanguageContext";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Terms() {
  const { language } = useLanguage();

  const isRTL = language === "ar";
  const rtlStyle = {
    writingDirection: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
  } as const;

  const getText = () => {
    if (language === "ar") {
      return {
        title: "شروط الخدمة",
        lastUpdated: "آخر تحديث: 9 مارس 2026",
        intro: "باستخدامك لتطبيق DawaMZ، فإنك توافق على الالتزام بهذه الشروط.",

        section1Title: "1. قبول الشروط",
        section1Content:
          "باستخدام التطبيق، فإنك توافق على هذه الشروط والأحكام. إذا كنت لا توافق، يرجى عدم استخدام التطبيق.",

        section2Title: "2. استخدام التطبيق",
        section2Content:
          "يمكنك استخدام DawaMZ لـ:\n\n• العثور على الصيدليات في المغرب\n• عرض معلومات الصيدليات (الموقع، ساعات العمل، رقم الهاتف)\n• الحصول على الاتجاهات إلى الصيدليات\n\nيجب عليك:\n• استخدام التطبيق بشكل قانوني وأخلاقي\n• عدم استخدام التطبيق لأغراض ضارة أو غير قانونية",

        section3Title: "3. معلومات الصيدليات",
        section3Content:
          "نبذل قصارى جهدنا لتوفير معلومات دقيقة ومحدثة عن الصيدليات. ومع ذلك:\n\n• لا نضمن دقة المعلومات بنسبة 100٪\n• قد تتغير ساعات العمل أو معلومات الاتصال\n• يرجى التحقق مباشرة مع الصيدلية قبل الزيارة",

        section4Title: "4. المسؤولية",
        section4Content:
          "DawaMZ ليست مسؤولة عن:\n\n• دقة معلومات الصيدليات\n• توفر الأدوية في الصيدليات\n• جودة الخدمة المقدمة من الصيدليات\n• أي أضرار ناتجة عن استخدام التطبيق\n\nالتطبيق يوفر معلومات فقط ولا يقدم نصائح طبية.",

        section5Title: "5. حقوق الملكية الفكرية",
        section5Content:
          "جميع حقوق التطبيق، بما في ذلك التصميم والشعار والمحتوى، محفوظة لـ DawaMZ.",

        section6Title: "6. التطبيق مجاني",
        section6Content:
          "التطبيق مجاني تماماً بدون:\n• إعلانات\n• عمليات شراء داخل التطبيق\n• رسوم اشتراك",

        section7Title: "7. التغييرات على الخدمة",
        section7Content:
          "نحتفظ بالحق في:\n• تعديل أو إيقاف ميزات التطبيق\n• تحديث هذه الشروط في أي وقت\n• إنهاء الخدمة دون إشعار مسبق",

        section8Title: "8. القانون الساري",
        section8Content: "تخضع هذه الشروط لقوانين المملكة المغربية.",

        section9Title: "9. الاتصال",
        section9Content:
          "للأسئلة حول هذه الشروط، يمكنك الاتصال بنا عبر صفحة التطبيق في متجر التطبيقات.",
      };
    } else if (language === "fr") {
      return {
        title: "Conditions d'utilisation",
        lastUpdated: "Dernière mise à jour : 9 mars 2026",
        intro:
          "En utilisant l'application DawaMZ, vous acceptez de respecter ces conditions.",

        section1Title: "1. Acceptation des conditions",
        section1Content:
          "En utilisant l'application, vous acceptez ces termes et conditions. Si vous n'êtes pas d'accord, veuillez ne pas utiliser l'application.",

        section2Title: "2. Utilisation de l'application",
        section2Content:
          "Vous pouvez utiliser DawaMZ pour :\n\n• Trouver des pharmacies au Maroc\n• Afficher les informations sur les pharmacies (emplacement, horaires, téléphone)\n• Obtenir des itinéraires vers les pharmacies\n\nVous devez :\n• Utiliser l'application de manière légale et éthique\n• Ne pas utiliser l'application à des fins nuisibles ou illégales",

        section3Title: "3. Informations sur les pharmacies",
        section3Content:
          "Nous faisons de notre mieux pour fournir des informations exactes et à jour sur les pharmacies. Cependant :\n\n• Nous ne garantissons pas une exactitude à 100 %\n• Les horaires ou coordonnées peuvent changer\n• Veuillez vérifier directement auprès de la pharmacie avant de visiter",

        section4Title: "4. Responsabilité",
        section4Content:
          "DawaMZ n'est pas responsable de :\n\n• L'exactitude des informations sur les pharmacies\n• La disponibilité des médicaments dans les pharmacies\n• La qualité du service fourni par les pharmacies\n• Tout dommage résultant de l'utilisation de l'application\n\nL'application fournit des informations uniquement et ne donne pas de conseils médicaux.",

        section5Title: "5. Droits de propriété intellectuelle",
        section5Content:
          "Tous les droits de l'application, y compris la conception, le logo et le contenu, sont réservés à DawaMZ.",

        section6Title: "6. L'application est gratuite",
        section6Content:
          "L'application est entièrement gratuite sans :\n• Publicités\n• Achats intégrés\n• Frais d'abonnement",

        section7Title: "7. Modifications du service",
        section7Content:
          "Nous nous réservons le droit de :\n• Modifier ou arrêter les fonctionnalités de l'application\n• Mettre à jour ces conditions à tout moment\n• Arrêter le service sans préavis",

        section8Title: "8. Loi applicable",
        section8Content:
          "Ces conditions sont régies par les lois du Royaume du Maroc.",

        section9Title: "9. Contact",
        section9Content:
          "Pour toute question concernant ces conditions, vous pouvez nous contacter via la page de l'application dans le magasin d'applications.",
      };
    } else {
      return {
        title: "Terms of Service",
        lastUpdated: "Last updated: March 9, 2026",
        intro: "By using the DawaMZ app, you agree to comply with these terms.",

        section1Title: "1. Acceptance of Terms",
        section1Content:
          "By using the app, you accept these terms and conditions. If you do not agree, please do not use the app.",

        section2Title: "2. Use of the App",
        section2Content:
          "You can use DawaMZ to:\n\n• Find pharmacies in Morocco\n• View pharmacy information (location, hours, phone)\n• Get directions to pharmacies\n\nYou must:\n• Use the app legally and ethically\n• Not use the app for harmful or illegal purposes",

        section3Title: "3. Pharmacy Information",
        section3Content:
          "We do our best to provide accurate and up-to-date pharmacy information. However:\n\n• We do not guarantee 100% accuracy\n• Hours or contact information may change\n• Please verify directly with the pharmacy before visiting",

        section4Title: "4. Liability",
        section4Content:
          "DawaMZ is not responsible for:\n\n• Accuracy of pharmacy information\n• Availability of medications at pharmacies\n• Quality of service provided by pharmacies\n• Any damages resulting from use of the app\n\nThe app provides information only and does not offer medical advice.",

        section5Title: "5. Intellectual Property Rights",
        section5Content:
          "All rights to the app, including design, logo, and content, are reserved by DawaMZ.",

        section6Title: "6. The App is Free",
        section6Content:
          "The app is completely free with no:\n• Advertisements\n• In-app purchases\n• Subscription fees",

        section7Title: "7. Changes to the Service",
        section7Content:
          "We reserve the right to:\n• Modify or discontinue app features\n• Update these terms at any time\n• Terminate the service without prior notice",

        section8Title: "8. Governing Law",
        section8Content:
          "These terms are governed by the laws of the Kingdom of Morocco.",

        section9Title: "9. Contact",
        section9Content:
          "For questions about these terms, you can contact us through the app page in the app store.",
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

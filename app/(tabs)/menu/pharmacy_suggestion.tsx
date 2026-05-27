import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/services/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Spam guard ───────────────────────────────────────────────────────────────
const SUBMISSION_LIMIT = 3;
const STORAGE_KEY = "pharmacy_suggestion_submissions";

async function checkAndRecordSubmission(): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const data: { date: string; count: number } = raw
    ? JSON.parse(raw)
    : { date: today, count: 0 };

  if (data.date !== today) {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ date: today, count: 1 }),
    );
    return true;
  }
  if (data.count >= SUBMISSION_LIMIT) return false;
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: today, count: data.count + 1 }),
  );
  return true;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────
function getText(lang: string) {
  if (lang === "ar") {
    return {
      titleAr: "اقتراح صيدلية",
      titleMain: "Pharmacy Suggestion",
      titleSub: "Suggestion de pharmacie",
      nameLabel: "اسم الصيدلية *",
      addressLabel: "العنوان *",
      cityLabel: "المدينة *",
      nameArLabel: "الاسم بالعربية",
      addressArLabel: "العنوان بالعربية",
      phoneLabel: "رقم الهاتف",
      noteLabel: "ملاحظة",
      namePlaceholder: "اسم الصيدلية",
      addressPlaceholder: "العنوان",
      cityPlaceholder: "اسم المدينة",
      nameArPlaceholder: "اسم الصيدلية بالعربية",
      addressArPlaceholder: "العنوان بالعربية",
      phonePlaceholder: "مثال: 0612345678",
      notePlaceholder: "معلومات إضافية (اختياري)",
      saveButton: "إرسال الاقتراح",
      saving: "جاري الإرسال...",
      required: "يرجى تعبئة الحقول المطلوبة: الاسم، العنوان، والمدينة",
      limitTitle: "تم بلوغ الحد اليومي",
      limitReached: "لقد تجاوزت الحد اليومي للاقتراحات (3 في اليوم)",
      success: "تم إرسال اقتراحك بنجاح، شكراً لك!",
      successTitle: "تم الإرسال",
      successOk: "حسناً",
      rateLimitNote: "يمكنك إرسال ما يصل إلى 3 اقتراحات يومياً",
    };
  } else if (lang === "fr") {
    return {
      titleAr: "اقتراح صيدلية",
      titleMain: "Pharmacy Suggestion",
      titleSub: "Suggestion de pharmacie",
      nameLabel: "Nom de la pharmacie *",
      addressLabel: "Adresse *",
      cityLabel: "Ville *",
      nameArLabel: "Nom en arabe",
      addressArLabel: "Adresse en arabe",
      phoneLabel: "Numéro de téléphone",
      noteLabel: "Note",
      namePlaceholder: "Nom de la pharmacie",
      addressPlaceholder: "Adresse complète",
      cityPlaceholder: "Nom de la ville",
      nameArPlaceholder: "Nom en arabe (facultatif)",
      addressArPlaceholder: "Adresse en arabe (facultatif)",
      phonePlaceholder: "Ex : 0612345678",
      notePlaceholder: "Informations supplémentaires (facultatif)",
      saveButton: "Soumettre la suggestion",
      saving: "Envoi en cours...",
      required:
        "Veuillez remplir les champs obligatoires : nom, adresse et ville",
      limitTitle: "Limite journalière atteinte",
      limitReached: "Vous avez atteint la limite quotidienne (3 par jour)",
      success: "Votre suggestion a été envoyée avec succès, merci !",
      successTitle: "Envoyé !",
      successOk: "OK",
      rateLimitNote: "Vous pouvez soumettre jusqu'à 3 suggestions par jour",
    };
  } else {
    return {
      titleAr: "اقتراح صيدلية",
      titleMain: "Pharmacy Suggestion",
      titleSub: "Suggestion de pharmacie",
      nameLabel: "Pharmacy Name *",
      addressLabel: "Address *",
      cityLabel: "City *",
      nameArLabel: "Arabic Name",
      addressArLabel: "Arabic Address",
      phoneLabel: "Phone Number",
      noteLabel: "Note",
      namePlaceholder: "Pharmacy name",
      addressPlaceholder: "Full address",
      cityPlaceholder: "City name",
      nameArPlaceholder: "Pharmacy name (Arabic, optional)",
      addressArPlaceholder: "Address in Arabic (optional)",
      phonePlaceholder: "e.g. 0612345678",
      notePlaceholder: "Additional information (optional)",
      saveButton: "Submit Suggestion",
      saving: "Submitting...",
      required: "Please fill in the required fields: name, address and city",
      limitTitle: "Daily Limit Reached",
      limitReached: "You've reached the daily submission limit (3 per day)",
      success: "Your suggestion was submitted successfully, thank you!",
      successTitle: "Submitted!",
      successOk: "OK",
      rateLimitNote: "You can submit up to 3 suggestions per day",
    };
  }
}

// ─── Reusable field component ─────────────────────────────────────────────────
type FieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  textColor: string;
  inputBg: string;
  borderColor: string;
  placeholderColor: string;
  multiline?: boolean;
  keyboardType?: "default" | "phone-pad";
  textAlign?: "left" | "right";
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  textColor,
  inputBg,
  borderColor,
  placeholderColor,
  multiline = false,
  keyboardType = "default",
  textAlign = "left",
}: FieldProps) {
  return (
    <View style={styles.field_group}>
      <Text style={[styles.field_label, { color: textColor }]}>{label}</Text>
      <View
        style={[
          styles.input_wrapper,
          multiline && styles.textarea_wrapper,
          {
            backgroundColor: inputBg,
            borderColor: value.trim() ? borderColor : "transparent",
          },
        ]}
      >
        <TextInput
          style={[
            styles.text_input,
            multiline && styles.textarea_input,
            { color: textColor },
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? "top" : "center"}
          keyboardType={keyboardType}
          textAlign={textAlign}
          autoCapitalize={keyboardType === "phone-pad" ? "none" : "sentences"}
        />
      </View>
    </View>
  );
}

// ─── Success Modal ─────────────────────────────────────────────────────────────
type SuccessModalProps = {
  visible: boolean;
  message: string;
  title: string;
  okLabel: string;
  onClose: () => void;
  theme: any;
};

function SuccessModal({
  visible,
  message,
  title,
  okLabel,
  onClose,
  theme,
}: SuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.modal_overlay}>
        <View style={[styles.modal_card, { backgroundColor: theme.contentBg }]}>
          {/* Icon circle */}
          <View
            style={[
              styles.modal_icon_circle,
              { backgroundColor: theme.buttonBackground + "20" },
            ]}
          >
            <Text
              style={[styles.modal_icon, { color: theme.buttonBackground }]}
            >
              ✓
            </Text>
          </View>

          <Text style={[styles.modal_title, { color: theme.itemTitle }]}>
            {title}
          </Text>
          <Text
            style={[styles.modal_message, { color: theme.itemDescription }]}
          >
            {message}
          </Text>

          <TouchableOpacity
            style={[
              styles.modal_button,
              { backgroundColor: theme.buttonBackground },
            ]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text
              style={[
                styles.modal_button_label,
                { color: theme.buttonTextColor },
              ]}
            >
              {okLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function PharmacySuggestion() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const navigating = useRef(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const text = getText(language);
  const isRtl = language === "ar";
  const primaryAlign = isRtl ? "right" : "left";

  const isValid =
    name.trim() !== "" && address.trim() !== "" && city.trim() !== "";

  const handleNavigate = (route: string) => {
    if (navigating.current) return;
    navigating.current = true;
    router.push(route as any);
    setTimeout(() => {
      navigating.current = false;
    }, 500);
  };

  const handleSubmit = async () => {
    if (!isValid) {
      Alert.alert("", text.required);
      return;
    }

    setIsLoading(true);
    try {
      const allowed = await checkAndRecordSubmission();
      if (!allowed) {
        Alert.alert(text.limitTitle, text.limitReached);
        return;
      }

      const { error } = await supabase.from("pharmacy_suggestions").insert({
        name,
        address,
        phone,
        ctiy: city,
        note,
      });

      if (error) throw error;

      setName("");
      setAddress("");
      setCity("");
      setPhone("");
      setNote("");

      setShowSuccess(true);
    } catch (e) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputBg = theme.cardIcon;

  const fieldProps = {
    textColor: theme.itemTitle,
    inputBg,
    borderColor: theme.selectedBorder,
    placeholderColor: theme.itemDescription,
  };

  return (
    <SafeAreaView
      style={[styles.screen_container, { backgroundColor: theme.screenBg }]}
    >
      <BackgroundBubbles />
      <Header />

      <SuccessModal
        visible={showSuccess}
        title={text.successTitle}
        message={text.success}
        okLabel={text.successOk}
        theme={theme}
        onClose={() => {
          setShowSuccess(false);
          handleNavigate("/(tabs)/menu");
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.content_container,
            { backgroundColor: theme.contentBg },
          ]}
        >
          {/* ── Title ── */}
          <View style={styles.title_section}>
            <View style={styles.title_divider_row}>
              <View
                style={[styles.title_line, { backgroundColor: theme.sideLine }]}
              />
              <View style={styles.title_text_block}>
                <Text
                  style={[
                    styles.title_arabic,
                    { color: theme.itemDescription },
                  ]}
                >
                  {text.titleAr}
                </Text>
                <Text style={[styles.title_main, { color: theme.itemTitle }]}>
                  {text.titleMain}
                </Text>
                <Text
                  style={[styles.title_sub, { color: theme.itemDescription }]}
                >
                  {text.titleSub}
                </Text>
              </View>
              <View
                style={[styles.title_line, { backgroundColor: theme.sideLine }]}
              />
            </View>

            {/* ── Rate limit note ── */}
            <View
              style={[
                styles.rate_limit_note,
                {
                  backgroundColor: theme.buttonBackground + "15",
                  borderColor: theme.buttonBackground + "40",
                },
              ]}
            >
              <Text
                style={[
                  styles.rate_limit_icon,
                  { color: theme.buttonBackground },
                ]}
              >
                ℹ
              </Text>
              <Text
                style={[
                  styles.rate_limit_text,
                  { color: theme.itemDescription },
                ]}
              >
                {text.rateLimitNote}
              </Text>
            </View>
          </View>

          {/* ── Form ── */}
          <ScrollView
            style={styles.form_scroll}
            contentContainerStyle={styles.form_content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Required fields */}
            <View
              style={[
                styles.section_card,
                { backgroundColor: theme.sectionCard },
              ]}
            >
              <Text
                style={[styles.section_header, { color: theme.sectionHeader }]}
              >
                {isRtl
                  ? "الحقول المطلوبة"
                  : language === "fr"
                    ? "Champs obligatoires"
                    : "Required Fields"}
              </Text>
              <Field
                label={text.nameLabel}
                value={name}
                onChangeText={setName}
                placeholder={text.namePlaceholder}
                textAlign={primaryAlign}
                {...fieldProps}
              />
              <Field
                label={text.addressLabel}
                value={address}
                onChangeText={setAddress}
                placeholder={text.addressPlaceholder}
                textAlign={primaryAlign}
                {...fieldProps}
              />
              <Field
                label={text.cityLabel}
                value={city}
                onChangeText={setCity}
                placeholder={text.cityPlaceholder}
                textAlign={primaryAlign}
                {...fieldProps}
              />
            </View>

            {/* Optional fields */}
            <View
              style={[
                styles.section_card,
                { backgroundColor: theme.sectionCard },
              ]}
            >
              <Text
                style={[styles.section_header, { color: theme.sectionHeader }]}
              >
                {isRtl
                  ? "حقول اختيارية"
                  : language === "fr"
                    ? "Champs facultatifs"
                    : "Optional Fields"}
              </Text>
              <Field
                label={text.phoneLabel}
                value={phone}
                onChangeText={setPhone}
                placeholder={text.phonePlaceholder}
                keyboardType="phone-pad"
                textAlign="left"
                {...fieldProps}
              />
              <Field
                label={text.noteLabel}
                value={note}
                onChangeText={setNote}
                placeholder={text.notePlaceholder}
                multiline
                textAlign={primaryAlign}
                {...fieldProps}
              />
            </View>
          </ScrollView>

          {/* ── Submit ── */}
          <View style={styles.save_section}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.save_button}
              contentStyle={styles.save_button_content}
              labelStyle={styles.save_button_label}
              buttonColor={theme.buttonBackground}
              textColor={theme.buttonTextColor}
              disabled={!isValid || isLoading}
              loading={isLoading}
            >
              {isLoading ? text.saving : text.saveButton}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen_container: { flex: 1, gap: 50 },

  content_container: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 28,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: -30,
    justifyContent: "space-between",
  },

  // Title
  title_section: { alignItems: "center", marginBottom: 20, gap: 12 },
  title_divider_row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
  },
  title_line: { flex: 1, height: 1 },
  title_text_block: { alignItems: "center", gap: 3, paddingHorizontal: 4 },
  title_arabic: { fontSize: 12, letterSpacing: 0.8 },
  title_main: { fontSize: 15, fontWeight: "700", letterSpacing: 0.1 },
  title_sub: { fontSize: 13, fontWeight: "400", letterSpacing: 0.1 },

  // Rate limit note
  rate_limit_note: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "stretch",
  },
  rate_limit_icon: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 16,
  },
  rate_limit_text: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },

  // Form
  form_scroll: { flex: 1 },
  form_content: { gap: 14, paddingBottom: 10 },

  section_card: {
    borderRadius: 18,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  section_header: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  field_group: { gap: 6 },
  field_label: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
    paddingLeft: 4,
  },

  input_wrapper: {
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  textarea_wrapper: { paddingVertical: 4 },

  text_input: {
    fontSize: 15,
    paddingVertical: 13,
    fontWeight: "500",
  },
  textarea_input: { minHeight: 88 },

  // Submit
  save_section: { paddingBottom: 30, alignItems: "center", paddingTop: 16 },
  save_button: {
    width: "100%",
    maxWidth: 330,
    borderRadius: 16,
    shadowColor: "#2196F3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  save_button_content: { height: 54 },
  save_button_label: { fontSize: 14, fontWeight: "700", letterSpacing: 0.4 },

  // Success modal
  modal_overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modal_card: {
    width: "100%",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  modal_icon_circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  modal_icon: {
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 36,
  },
  modal_title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  modal_message: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 6,
  },
  modal_button: {
    marginTop: 6,
    width: "100%",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  modal_button_label: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

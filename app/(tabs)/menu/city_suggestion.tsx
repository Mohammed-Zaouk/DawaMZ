import BackgroundBubbles from "@/components/background_bubbles";
import Header from "@/components/header";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/services/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Spam guard ──────────────────────────────────────────────────────────────
const SUBMISSION_LIMIT = 3;
const STORAGE_KEY = "city_suggestion_submissions";

async function checkAndRecordSubmission(): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const data: { date: string; count: number } = raw
    ? JSON.parse(raw)
    : { date: today, count: 0 };

  if (data.date !== today) {
    // new day — reset
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

// ─── Region type (matches Supabase `regions` table) ──────────────────────────
type Region = {
  id: string;
  name: string;
  name_ar: string | null;
  name_en: string | null;
  slug: string | null;
};

// ─── i18n ─────────────────────────────────────────────────────────────────────
function getText(lang: string) {
  if (lang === "ar") {
    return {
      titleAr: "اقتراح مدينة",
      titleMain: "City Suggestion",
      titleSub: "Suggestion de ville",
      namePlaceholder: "اسم المدينة",
      nameArPlaceholder: "اسم المدينة بالعربية",
      regionPlaceholder: "اختر الجهة",
      notePlaceholder: "ملاحظة إضافية (اختياري)",
      nameLabel: "اسم المدينة *",
      nameArLabel: "الاسم بالعربية",
      regionLabel: "الجهة *",
      noteLabel: "ملاحظة",
      saveButton: "إرسال الاقتراح",
      saving: "جاري الإرسال...",
      required: "يرجى تعبئة الحقول المطلوبة (الاسم والجهة)",
      limitReached: "لقد تجاوزت الحد اليومي للاقتراحات (3 في اليوم)",
      success: "تم إرسال اقتراحك بنجاح، شكراً لك!",
      selectRegion: "اختر الجهة",
      cancel: "إلغاء",
      limitTitle: "تم بلوغ الحد اليومي",
    };
  } else if (lang === "fr") {
    return {
      titleAr: "اقتراح مدينة",
      titleMain: "City Suggestion",
      titleSub: "Suggestion de ville",
      namePlaceholder: "Nom de la ville",
      nameArPlaceholder: "Nom de la ville (arabe)",
      regionPlaceholder: "Choisir une région",
      notePlaceholder: "Note supplémentaire (facultatif)",
      nameLabel: "Nom de la ville *",
      nameArLabel: "Nom en arabe",
      regionLabel: "Région *",
      noteLabel: "Note",
      saveButton: "Soumettre la suggestion",
      saving: "Envoi en cours...",
      required: "Veuillez remplir les champs obligatoires (nom et région)",
      limitReached: "Vous avez atteint la limite quotidienne (3 par jour)",
      success: "Votre suggestion a été envoyée avec succès, merci !",
      selectRegion: "Choisir une région",
      cancel: "Annuler",
      limitTitle: "Limite journalière atteinte",
    };
  } else {
    return {
      titleAr: "اقتراح مدينة",
      titleMain: "City Suggestion",
      titleSub: "Suggestion de ville",
      namePlaceholder: "City name",
      nameArPlaceholder: "City name (Arabic)",
      regionPlaceholder: "Select a region",
      notePlaceholder: "Additional note (optional)",
      nameLabel: "City Name *",
      nameArLabel: "Arabic Name",
      regionLabel: "Region *",
      noteLabel: "Note",
      saveButton: "Submit Suggestion",
      saving: "Submitting...",
      required: "Please fill in the required fields (name & region)",
      limitReached: "You've reached the daily submission limit (3 per day)",
      success: "Your suggestion was submitted successfully, thank you!",
      selectRegion: "Select a region",
      cancel: "Cancel",
      limitTitle: "Daily Limit Reached",
    };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CitySuggestion() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const router = useRouter();
  const navigating = useRef(false);

  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionsLoading, setRegionsLoading] = useState(true);

  // Fetch regions from Supabase on mount
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data, error } = await supabase
          .from("regions")
          .select("id, name, name_ar, name_en, slug")
          .order("name_en");
        if (error) throw error;
        setRegions(data ?? []);
      } catch (e) {
        console.error("Failed to fetch regions:", e);
      } finally {
        setRegionsLoading(false);
      }
    };
    fetchRegions();
  }, []);

  const text = getText(language);
  const isRtl = language === "ar";

  const handleNavigate = (route: string) => {
    if (navigating.current) return;
    navigating.current = true;
    router.push(route as any);
    setTimeout(() => {
      navigating.current = false;
    }, 500);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !selectedRegion) {
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

      const { error } = await supabase.from("city_suggestions").insert({
        name,
        name_ar: nameAr,
        region_id: selectedRegion.id,
        note,
      });

      if (error) throw error;

      setName("");
      setNameAr("");
      setSelectedRegion(null);
      setNote("");
      Alert.alert("✓", text.success, [
        { text: "OK", onPress: () => handleNavigate("/(tabs)/menu") },
      ]);
    } catch (e) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getRegionLabel = (r: Region) =>
    language === "ar"
      ? (r.name_ar ?? r.name_en ?? r.name)
      : (r.name_en ?? r.name);

  const regionLabel = selectedRegion
    ? getRegionLabel(selectedRegion)
    : text.regionPlaceholder;

  return (
    <SafeAreaView
      style={[styles.screen_container, { backgroundColor: theme.screenBg }]}
    >
      <BackgroundBubbles />
      <Header />

      <View
        style={[styles.content_container, { backgroundColor: theme.contentBg }]}
      >
        {/* ── Title ── */}
        <View style={styles.title_section}>
          <View style={styles.title_divider_row}>
            <View
              style={[styles.title_line, { backgroundColor: theme.sideLine }]}
            />
            <View style={styles.title_text_block}>
              <Text
                style={[styles.title_arabic, { color: theme.itemDescription }]}
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
        </View>

        {/* ── Form ── */}
        <ScrollView
          style={styles.form_scroll}
          contentContainerStyle={styles.form_content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* City Name */}
          <View style={styles.field_group}>
            <Text style={[styles.field_label, { color: theme.text }]}>
              {text.nameLabel}
            </Text>
            <View
              style={[
                styles.input_wrapper,
                {
                  backgroundColor: theme.card,
                  borderColor: name.trim()
                    ? theme.selectedBorder
                    : "transparent",
                },
              ]}
            >
              <TextInput
                style={[styles.text_input, { color: theme.itemTitle }]}
                placeholder={text.namePlaceholder}
                placeholderTextColor={theme.itemDescription}
                value={name}
                onChangeText={setName}
                textAlign={isRtl ? "right" : "left"}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* City Name (AR) */}
          <View style={styles.field_group}>
            <Text style={[styles.field_label, { color: theme.text }]}>
              {text.nameArLabel}
            </Text>
            <View
              style={[
                styles.input_wrapper,
                {
                  backgroundColor: theme.card,
                  borderColor: nameAr.trim()
                    ? theme.selectedBorder
                    : "transparent",
                },
              ]}
            >
              <TextInput
                style={[styles.text_input, { color: theme.itemTitle }]}
                placeholder={text.nameArPlaceholder}
                placeholderTextColor={theme.itemDescription}
                value={nameAr}
                onChangeText={setNameAr}
                textAlign="right"
              />
            </View>
          </View>

          {/* Region Dropdown */}
          <View style={styles.field_group}>
            <Text style={[styles.field_label, { color: theme.text }]}>
              {text.regionLabel}
            </Text>
            <TouchableOpacity
              onPress={() => setRegionModalVisible(true)}
              activeOpacity={0.75}
              style={[
                styles.input_wrapper,
                styles.dropdown_row,
                {
                  backgroundColor: theme.card,
                  borderColor: selectedRegion
                    ? theme.selectedBorder
                    : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.dropdown_text,
                  {
                    color: selectedRegion
                      ? theme.itemTitle
                      : theme.itemDescription,
                  },
                ]}
                numberOfLines={1}
              >
                {regionLabel}
              </Text>
              <Text style={[styles.chevron_icon, { color: theme.chevron }]}>
                ▾
              </Text>
            </TouchableOpacity>
          </View>

          {/* Note */}
          <View style={styles.field_group}>
            <Text style={[styles.field_label, { color: theme.text }]}>
              {text.noteLabel}
            </Text>
            <View
              style={[
                styles.input_wrapper,
                styles.textarea_wrapper,
                {
                  backgroundColor: theme.card,
                  borderColor: note.trim()
                    ? theme.selectedBorder
                    : "transparent",
                },
              ]}
            >
              <TextInput
                style={[
                  styles.text_input,
                  styles.textarea_input,
                  { color: theme.itemTitle },
                ]}
                placeholder={text.notePlaceholder}
                placeholderTextColor={theme.itemDescription}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                textAlign={isRtl ? "right" : "left"}
              />
            </View>
          </View>
        </ScrollView>

        {/* ── Submit Button ── */}
        <View style={styles.save_section}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.save_button}
            contentStyle={styles.save_button_content}
            labelStyle={styles.save_button_label}
            buttonColor={theme.buttonBackground}
            textColor={theme.buttonTextColor}
            disabled={!name.trim() || !selectedRegion || isLoading}
            loading={isLoading}
          >
            {isLoading ? text.saving : text.saveButton}
          </Button>
        </View>
      </View>

      {/* ── Region Modal ── */}
      <Modal
        visible={regionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRegionModalVisible(false)}
      >
        <View style={styles.modal_overlay}>
          <View
            style={[styles.modal_sheet, { backgroundColor: theme.contentBg }]}
          >
            <View
              style={[styles.modal_handle, { backgroundColor: theme.sideLine }]}
            />
            <Text style={[styles.modal_title, { color: theme.itemTitle }]}>
              {text.selectRegion}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {regionsLoading ? (
                <Text
                  style={[
                    styles.loading_text,
                    { color: theme.itemDescription },
                  ]}
                >
                  {language === "ar"
                    ? "جاري التحميل..."
                    : language === "fr"
                      ? "Chargement..."
                      : "Loading..."}
                </Text>
              ) : regions.length === 0 ? (
                <Text
                  style={[
                    styles.loading_text,
                    { color: theme.itemDescription },
                  ]}
                >
                  {language === "ar"
                    ? "لا توجد جهات"
                    : language === "fr"
                      ? "Aucune région"
                      : "No regions found"}
                </Text>
              ) : (
                regions.map((region) => {
                  const label = getRegionLabel(region);
                  const isActive = selectedRegion?.id === region.id;
                  return (
                    <TouchableOpacity
                      key={region.id}
                      onPress={() => {
                        setSelectedRegion(region);
                        setRegionModalVisible(false);
                      }}
                      activeOpacity={0.7}
                      style={[
                        styles.region_row,
                        {
                          backgroundColor: isActive
                            ? theme.selectedBg
                            : theme.card,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.region_row_text,
                          { color: isActive ? theme.selectedText : theme.text },
                          isActive && { fontWeight: "700" },
                        ]}
                      >
                        {label}
                      </Text>
                      {isActive && (
                        <Text
                          style={[
                            styles.check_icon,
                            { color: theme.selectedText },
                          ]}
                        >
                          ✓
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setRegionModalVisible(false)}
              style={[styles.cancel_btn, { borderColor: theme.selectedBorder }]}
            >
              <Text style={[styles.cancel_text, { color: theme.selectedText }]}>
                {text.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  title_section: { alignItems: "center", marginBottom: 20 },
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

  // Form
  form_scroll: { flex: 1 },
  form_content: { gap: 16, paddingBottom: 10 },

  field_group: { gap: 6 },
  field_label: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
    paddingLeft: 4,
  },

  input_wrapper: {
    borderRadius: 14,
    borderWidth: 2,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  text_input: {
    fontSize: 15,
    paddingVertical: 14,
    fontWeight: "500",
  },

  textarea_wrapper: { paddingVertical: 4 },
  textarea_input: { minHeight: 90 },

  dropdown_row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  dropdown_text: { flex: 1, fontSize: 15, fontWeight: "500" },
  chevron_icon: { fontSize: 18, marginLeft: 8 },

  // Save
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

  // Region Modal
  modal_overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modal_sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: "75%",
  },
  modal_handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modal_title: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  region_row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  region_row_text: { flex: 1, fontSize: 15 },
  check_icon: { fontSize: 16 },

  cancel_btn: {
    marginTop: 12,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },
  cancel_text: { fontSize: 14, fontWeight: "600" },
  loading_text: { textAlign: "center", paddingVertical: 24, fontSize: 14 },
});

export const citiesByRegion: Record<
  string,
  { id: string; name: string; nameAr: string; image: any }[]
> = {
  // Region 1 — Tanger-Tetouan-Al Hoceima
  "1": [
    { id: "1", name: "Tangier", nameAr: "طنجة", image: "tangier.jpg" },
    { id: "2", name: "Tetouan", nameAr: "تطوان", image: "tetouan.png" },
    {
      id: "3",
      name: "Ksar El Kebir",
      nameAr: "القصر الكبير",
      image: "ksar-el-kebir.jpg",
    },
    { id: "4", name: "Larache", nameAr: "العرائش", image: "larache.jpg" },
    { id: "5", name: "Al Hoceima", nameAr: "الحسيمة", image: "al-hoceima.jpg" },
    { id: "6", name: "Fnideq", nameAr: "الفنيدق", image: "fnideq.jpeg" },
    { id: "7", name: "Martil", nameAr: "مارتيل", image: "martil.jpg" },
    { id: "8", name: "Ouazzane", nameAr: "وزان", image: "ouazzane.jpg" },
    {
      id: "9",
      name: "Chefchaouen",
      nameAr: "شفشاون",
      image: "chefchaouen.jpg",
    },
    { id: "10", name: "M'diq", nameAr: "المضيق", image: "mdiq.jpg" },
    { id: "11", name: "Assilah", nameAr: "أصيلة", image: "assilah.jpg" },
    {
      id: "12",
      name: "Beni Bouayach",
      nameAr: "بني بوعياش",
      image: "beni-bouayach.jpg",
    },
  ],

  // Region 2 — Oriental
  "2": [
    { id: "13", name: "Oujda", nameAr: "وجدة", image: "oujda.png" },
    { id: "14", name: "Nador", nameAr: "الناظور", image: "nador.jpg" },
    { id: "15", name: "Berkane", nameAr: "بركان", image: "berkane.jpg" },
    { id: "16", name: "Taourirt", nameAr: "تاوريرت", image: "taourirt.jpg" },
    { id: "17", name: "Guercif", nameAr: "جرسيف", image: "guercif.jpg" },
    {
      id: "18",
      name: "Beni Ansar",
      nameAr: "بني انصار",
      image: "beni-ansar.jpg",
    },
    { id: "19", name: "Al Aaroui", nameAr: "العروي", image: "al-aaroui.jpg" },
    {
      id: "20",
      name: "El Aioun Sidi Mellouk",
      nameAr: "العيون سيدي ملوك",
      image: "el-aioun-sidi-mellouk.jpg",
    },
    { id: "21", name: "Bouarfa", nameAr: "بوعرفة", image: "bouarfa.jpg" },
    { id: "22", name: "Ahfir", nameAr: "احفير", image: "ahfir.jpg" },
  ],

  // Region 3 — Fès-Meknès
  "3": [
    { id: "23", name: "Fes", nameAr: "فاس", image: "fes.jpg" },
    { id: "24", name: "Meknes", nameAr: "مكناس", image: "mekness.jpg" },
    { id: "25", name: "Taza", nameAr: "تازة", image: "taza.jpg" },
    { id: "26", name: "Sefrou", nameAr: "صفرو", image: "sefrou.jpg" },
    { id: "27", name: "Azrou", nameAr: "أزرو", image: "azrou.jpg" },
    { id: "28", name: "Ifrane", nameAr: "إفران", image: "ifrane.jpg" },
    { id: "29", name: "El Hajeb", nameAr: "الحاجب", image: "el-hajeb.jpg" },
    {
      id: "30",
      name: "Ain Taoujdate",
      nameAr: "عين تاوجطات",
      image: "ain-taoujdate.jpg",
    },
  ],

  // Region 4 — Rabat-Salé-Kénitra
  "4": [
    { id: "31", name: "Rabat", nameAr: "الرباط", image: "rabat.jpg" },
    { id: "32", name: "Sale", nameAr: "سلا", image: "sale.jpg" },
    { id: "33", name: "Kenitra", nameAr: "القنيطرة", image: "kenitra.jpg" },
    { id: "34", name: "Temara", nameAr: "تمارة", image: "temara.jpg" },
    { id: "35", name: "Khemisset", nameAr: "الخميسات", image: "khemisset.jpg" },
    {
      id: "36",
      name: "Sidi Slimane",
      nameAr: "سيدي سليمان",
      image: "sidi-slimane.jpg",
    },
    { id: "37", name: "Tifelt", nameAr: "تيفلت", image: "tifelt.jpg" },
    {
      id: "38",
      name: "Sidi Kacem",
      nameAr: "سيدي قاسم",
      image: "sidi-kacem.jpg",
    },
    {
      id: "39",
      name: "Souk El Arbaa",
      nameAr: "سوق الأربعاء",
      image: "souk-el-arbaa.jpg",
    },
    { id: "40", name: "Skhirat", nameAr: "الصخيرات", image: "skhirat.jpg" },
    {
      id: "41",
      name: "Ain El Aouda",
      nameAr: "عين العودة",
      image: "ain-el-aouda.jpg",
    },
    { id: "42", name: "Ain Attig", nameAr: "عين عتيق", image: "ain-attig.jpg" },
  ],

  // Region 5 — Béni Mellal-Khénifra
  "5": [
    { id: "43", name: "Khouribga", nameAr: "خريبكة", image: "khouribga.jpg" },
    {
      id: "44",
      name: "Beni Mellal",
      nameAr: "بني ملال",
      image: "beni-mellal.jpg",
    },
    { id: "45", name: "Khenifra", nameAr: "خنيفرة", image: "khenifra.jpg" },
    {
      id: "46",
      name: "Fquih Ben Salah",
      nameAr: "الفقيه بن صالح",
      image: "fquih-ben-salah.jpg",
    },
    { id: "47", name: "Oued Zem", nameAr: "واد زم", image: "oued-zem.jpg" },
    { id: "48", name: "Azilal", nameAr: "أزيلال", image: "azilal.jpg" },
    { id: "49", name: "Bejaad", nameAr: "أبي الجعد", image: "bejaad.jpg" },
    { id: "50", name: "Demnate", nameAr: "دمنات", image: "demnate.jpg" },
  ],

  // Region 6 — Casablanca-Settat
  "6": [
    {
      id: "51",
      name: "Casablanca",
      nameAr: "الدار البيضاء",
      image: "casablanca.jpg",
    },
    {
      id: "52",
      name: "Mohammedia",
      nameAr: "المحمدية",
      image: "mohammedia.jpg",
    },
    { id: "53", name: "El Jadida", nameAr: "الجديدة", image: "el-jadida.jpg" },
    { id: "54", name: "Settat", nameAr: "سطات", image: "settat.jpg" },
    { id: "55", name: "Berrechid", nameAr: "برشيد", image: "berrechid.jpg" },
    {
      id: "56",
      name: "Dar Bouazza",
      nameAr: "دار بوعزة",
      image: "dar-bouazza.jpg",
    },
    { id: "57", name: "Bouskoura", nameAr: "بوسكورة", image: "bouskoura.jpg" },
    {
      id: "58",
      name: "Benslimane",
      nameAr: "بنسليمان",
      image: "benslimane.jpg",
    },
    {
      id: "59",
      name: "Sidi Bennour",
      nameAr: "سيدي بنور",
      image: "sidi-bennour.jpg",
    },
    { id: "60", name: "Azemmour", nameAr: "أزمور", image: "azemmour.jpg" },
    { id: "61", name: "Ben Ahmed", nameAr: "بن أحمد", image: "ben-ahmed.jpg" },
    { id: "62", name: "Bouznika", nameAr: "بوزنيقة", image: "bouznika.jpg" },
    {
      id: "63",
      name: "Ain Harrouda",
      nameAr: "عين حرودة",
      image: "ain-harrouda.jpg",
    },
  ],

  // Region 7 — Marrakech-Safi
  "7": [
    { id: "64", name: "Marrakech", nameAr: "مراكش", image: "marrakech.jpg" },
    { id: "65", name: "Safi", nameAr: "آسفي", image: "safi.jpg" },
    {
      id: "66",
      name: "El Kelaa",
      nameAr: "قلعة السراغنة",
      image: "el-kelaa.jpg",
    },
    {
      id: "67",
      name: "Ben Guerir",
      nameAr: "بن كرير",
      image: "ben-guerir.jpg",
    },
    { id: "68", name: "Essaouira", nameAr: "الصويرة", image: "essaouira.jpg" },
    {
      id: "69",
      name: "Youssoufia",
      nameAr: "اليوسفية",
      image: "youssoufia.jpg",
    },
    {
      id: "70",
      name: "Ait Ourir",
      nameAr: "أيت أورير",
      image: "ait-ourir.jpg",
    },
    { id: "71", name: "Chichaoua", nameAr: "شيشاوة", image: "chichaoua.jpg" },
  ],

  // Region 8 — Drâa-Tafilalet
  "8": [
    {
      id: "72",
      name: "Errachidia",
      nameAr: "الرشيدية",
      image: "errachidia.jpg",
    },
    {
      id: "73",
      name: "Ouarzazate",
      nameAr: "ورزازات",
      image: "ouarzazate.jpg",
    },
    { id: "74", name: "Midelt", nameAr: "ميدلت", image: "midelt.jpg" },
    { id: "75", name: "Zagora", nameAr: "زاكورة", image: "zagora.jpg" },
    { id: "76", name: "Arfoud", nameAr: "أرفود", image: "arfoud.jpg" },
    { id: "77", name: "Er-Rich", nameAr: "الريش", image: "er-rich.jpg" },
  ],

  // Region 9 — Souss-Massa
  "9": [
    { id: "78", name: "Agadir", nameAr: "أكادير", image: "agadir.jpg" },
    {
      id: "79",
      name: "Ait Melloul",
      nameAr: "أيت ملول",
      image: "ait-melloul.jpg",
    },
    { id: "80", name: "Inezgane", nameAr: "إنزكان", image: "inezgane.jpg" },
    { id: "81", name: "Dcheira", nameAr: "الدشيرة", image: "dcheira.jpg" },
    {
      id: "82",
      name: "Oulad Teima",
      nameAr: "أولاد تيمة",
      image: "oulad-teima.jpg",
    },
    { id: "83", name: "Taroudant", nameAr: "تارودانت", image: "taroudant.jpg" },
    { id: "84", name: "Tiznit", nameAr: "تزنيت", image: "tiznit.jpg" },
    { id: "85", name: "Drargua", nameAr: "درارة", image: "drargua.png" },
    { id: "86", name: "Biougra", nameAr: "بيوكرة", image: "biougra.jpg" },
    { id: "87", name: "Aourir", nameAr: "أورير", image: "aourir.jpg" },
    {
      id: "88",
      name: "Ait Amira",
      nameAr: "أيت عميرة",
      image: "ait-amira.jpg",
    },
  ],

  // Region 10 — Guelmim-Oued Noun
  "10": [
    { id: "89", name: "Guelmim", nameAr: "كلميم", image: "guelmim.jpg" },
    { id: "90", name: "Tan-Tan", nameAr: "طانطان", image: "tan-tan.jpg" },
    {
      id: "91",
      name: "Sidi Ifni",
      nameAr: "سيدي إفني",
      image: "sidi-ifni.jpg",
    },
    { id: "92", name: "Assa", nameAr: "أسا", image: "assa.jpg" },
  ],

  // Region 11 — Laâyoune-Sakia El Hamra
  "11": [
    { id: "93", name: "Laayoune", nameAr: "العيون", image: "laayoune.jpg" },
    { id: "94", name: "Smara", nameAr: "السمارة", image: "smara.jpg" },
    { id: "95", name: "Boujdour", nameAr: "بوجدور", image: "boujdour.jpg" },
    { id: "96", name: "Tarfaya", nameAr: "طرفاية", image: "tarfaya.jpg" },
  ],

  // Region 12 — Dakhla-Oued Ed-Dahab
  "12": [
    { id: "97", name: "Dakhla", nameAr: "الداخلة", image: "dakhla.jpg" },
    { id: "98", name: "Aousserd", nameAr: "أوسرد", image: "aousserd.jpg" },
    {
      id: "99",
      name: "Bir Gandouz",
      nameAr: "بير كندوز",
      image: "bir-gandouz.jpg",
    },
    { id: "100", name: "Aridal", nameAr: "أريدال", image: "aridal.jpg" },
  ],
};

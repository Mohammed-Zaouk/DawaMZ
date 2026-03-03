export const citiesByRegion: Record<
  string,
  { id: string; name: string; nameAr: string; image: any }[]
> = {
  "1": [
    {
      id: "1",
      name: "Tangier",
      nameAr: "طنجة",
      image: require("@/assets/images/cities/tangier.jpg"),
    },
    {
      id: "2",
      name: "Tetouan",
      nameAr: "تطوان",
      image: require("@/assets/images/cities/tetouan.png"),
    },
  ],
  "2": [
    {
      id: "3",
      name: "Oujda",
      nameAr: "وجدة",
      image: require("@/assets/images/cities/oujda.png"),
    },
    {
      id: "4",
      name: "Nador",
      nameAr: "الناظور",
      image: require("@/assets/images/cities/nador.jpg"),
    },
  ],
  "3": [
    {
      id: "5",
      name: "Fes",
      nameAr: "فاس",
      image: require("@/assets/images/cities/fes.jpg"),
    },
    {
      id: "6",
      name: "Mekness",
      nameAr: "مكناس",
      image: require("@/assets/images/cities/mekness.jpg"),
    },
  ],
};

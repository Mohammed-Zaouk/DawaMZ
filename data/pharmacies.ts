type TimeRange = { open: string; close: string };

type DaySchedule = TimeRange[] | null;

type Schedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

type Pharmacy = {
  id: string;
  name: string;
  nameAr: string;
  address: string;
  addressAr: string;
  phone: string;
  latitude: number;
  longitude: number;
  open: boolean;
  rating?: number;
  isNightPharmacy?: boolean;
  isOnCall?: boolean;
  dutyStart: string;
  dutyEnd: string;
  schedule: Schedule | null;
};

export const pharmaciesByCity: Record<string, Pharmacy[]> = {
  "99": [
    {
      id: "1",
      name: "Pharmacie Bir Gandouz",
      nameAr: "صيدلية بير غاندوز",
      address: "3732+Q6J Bir Gandouz Maroc, Bir Gandouz",
      addressAr: "3732+Q6J بير كندوز المغرب، بير كندوز",
      phone: "0610636167",
      latitude: 22.0544375,
      longitude: -16.7494375,
      open: true,
      rating: 3.8,
      isNightPharmacy: true,
      isOnCall: true,
      dutyStart: "24h",
      dutyEnd: "24h",
      schedule: null,
    },
  ],
};

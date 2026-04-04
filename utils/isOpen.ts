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

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function isOpenNow(
  schedule: Schedule,
  isOnCall: boolean,
  isNightPharmacy: boolean,
): boolean {
  if (isOnCall) return true;
  if (isNightPharmacy) return true;

  const now = new Date();
  const todaySchedule = schedule[DAYS[now.getDay()]];

  if (!todaySchedule) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const isOpen = todaySchedule.some((range) => {
    const [openH, openM] = range.open.split(":").map(Number);
    const [closeH, closeM] = range.close.split(":").map(Number);
    const openMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  });

  return isOpen;
}

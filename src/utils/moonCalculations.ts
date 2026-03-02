export interface MoonPhaseData {
  phase: string;
  phaseName: string;
  illumination: number;
  age: number;
  emoji: string;
  description: string;
  nextFullMoon: Date;
  nextNewMoon: Date;
}

const LUNAR_CYCLE = 29.53058867; // Days in a lunar cycle
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z').getTime(); // Known new moon reference

export function getMoonPhase(date: Date = new Date()): number {
  const diff = date.getTime() - KNOWN_NEW_MOON;
  const days = diff / (1000 * 60 * 60 * 24);
  const phase = ((days % LUNAR_CYCLE) + LUNAR_CYCLE) % LUNAR_CYCLE;
  return phase / LUNAR_CYCLE; // Returns 0-1
}

export function getIllumination(phaseRatio: number): number {
  // Convert phase ratio to illumination percentage
  // 0 = new moon (0%), 0.5 = full moon (100%)
  return Math.round((1 - Math.cos(phaseRatio * 2 * Math.PI)) / 2 * 100);
}

export function getPhaseInfo(phaseRatio: number): { name: string; emoji: string; description: string } {
  const phases = [
    { name: 'New Moon', emoji: '🌑', description: 'A time of new beginnings. The moon hides in shadow, inviting reflection and setting intentions.' },
    { name: 'Waxing Crescent', emoji: '🌒', description: 'First light emerges. A time to set goals and take initial steps toward your aspirations.' },
    { name: 'First Quarter', emoji: '🌓', description: 'Half illuminated, half in shadow. A moment of decision and commitment to your path.' },
    { name: 'Waxing Gibbous', emoji: '🌔', description: 'Nearly full and growing. Refine your work, adjust your course, and prepare for culmination.' },
    { name: 'Full Moon', emoji: '🌕', description: 'Peak illumination. A time of heightened energy, clarity, and the fruition of efforts.' },
    { name: 'Waning Gibbous', emoji: '🌖', description: 'Gratitude and sharing. Reflect on what you have achieved and give back to others.' },
    { name: 'Last Quarter', emoji: '🌗', description: 'Release and let go. Clear away what no longer serves you to make space for renewal.' },
    { name: 'Waning Crescent', emoji: '🌘', description: 'Rest and restore. The final phase before renewal, perfect for introspection and rest.' },
  ];

  const index = Math.floor(phaseRatio * 8) % 8;
  return phases[index];
}

export function getNextPhase(currentDate: Date, targetPhase: 'new' | 'full'): Date {
  const targetRatio = targetPhase === 'new' ? 0 : 0.5;
  const currentPhase = getMoonPhase(currentDate);

  let daysUntil: number;
  if (targetPhase === 'new') {
    daysUntil = currentPhase < 0.02 ? 0 : (1 - currentPhase) * LUNAR_CYCLE;
  } else {
    if (currentPhase < 0.5) {
      daysUntil = (0.5 - currentPhase) * LUNAR_CYCLE;
    } else {
      daysUntil = (1.5 - currentPhase) * LUNAR_CYCLE;
    }
  }

  const result = new Date(currentDate);
  result.setDate(result.getDate() + Math.ceil(daysUntil));
  return result;
}

export function getMoonPhaseForDate(date: Date): MoonPhaseData {
  const phaseRatio = getMoonPhase(date);
  const illumination = getIllumination(phaseRatio);
  const phaseInfo = getPhaseInfo(phaseRatio);
  const age = Math.round(phaseRatio * LUNAR_CYCLE * 10) / 10;

  return {
    phase: phaseRatio.toFixed(3),
    phaseName: phaseInfo.name,
    illumination,
    age,
    emoji: phaseInfo.emoji,
    description: phaseInfo.description,
    nextFullMoon: getNextPhase(date, 'full'),
    nextNewMoon: getNextPhase(date, 'new'),
  };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const days: (Date | null)[] = [];

  // Add empty slots for days before the first of the month
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

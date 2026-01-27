/**
 * Days of the week (0 = Sunday, 1 = Monday, etc.)
 */
export const DayOfWeek = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

/**
 * Day names in Spanish for UI display
 */
export const DAY_NAMES: Record<DayOfWeek, string> = {
  [DayOfWeek.SUNDAY]: 'Domingo',
  [DayOfWeek.MONDAY]: 'Lunes',
  [DayOfWeek.TUESDAY]: 'Martes',
  [DayOfWeek.WEDNESDAY]: 'Miércoles',
  [DayOfWeek.THURSDAY]: 'Jueves',
  [DayOfWeek.FRIDAY]: 'Viernes',
  [DayOfWeek.SATURDAY]: 'Sábado',
};

/**
 * Time slot representing a range of hours
 * Times are in 24h format (e.g., "08:00", "17:00")
 */
export interface TimeSlotDTO {
  startTime: string;
  endTime: string;
}

/**
 * Availability configuration for a single day
 */
export interface DayAvailabilityDTO {
  dayOfWeek: DayOfWeek;
  enabled: boolean;
  timeSlots: TimeSlotDTO[];
}

/**
 * Weekly availability configuration for a professional
 */
export interface WeeklyAvailabilityDTO {
  professionalId: string;
  professionalFirstName?: string;
  professionalLastName?: string;
  schedule: DayAvailabilityDTO[];
}

/**
 * Request payload to update availability
 */
export interface UpdateAvailabilityRequestDTO {
  schedule: DayAvailabilityDTO[];
}

/**
 * Single availability slot from backend
 */
export interface AvailabilitySlotDTO {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

/**
 * Response from GET /availability/me endpoint
 */
export interface AvailabilityResponseDTO {
  success: boolean;
  data: {
    availabilities: AvailabilitySlotDTO[];
  };
}

/**
 * Generate time options for selectors (1-hour intervals)
 */
export function generateTimeOptions(): string[] {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    options.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return options;
}

/**
 * Format time from 24h to 12h display format
 */
export function formatTimeDisplay(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes || '0', 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute === 0 ? '' : `:${minutes}`;
  return `${displayHour}${displayMinute} ${period}`;
}

/**
 * Check if two time slots overlap
 */
export function doTimeSlotsOverlap(slot1: TimeSlotDTO, slot2: TimeSlotDTO): boolean {
  const start1 = parseInt(slot1.startTime.replace(':', ''), 10);
  const end1 = parseInt(slot1.endTime.replace(':', ''), 10);
  const start2 = parseInt(slot2.startTime.replace(':', ''), 10);
  const end2 = parseInt(slot2.endTime.replace(':', ''), 10);

  return start1 < end2 && start2 < end1;
}

/**
 * Validate that start time is before end time
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  const start = parseInt(startTime.replace(':', ''), 10);
  const end = parseInt(endTime.replace(':', ''), 10);
  return start < end;
}

/**
 * Create default empty weekly availability
 */
export function createDefaultAvailability(): DayAvailabilityDTO[] {
  return [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
  ].map((day) => ({
    dayOfWeek: day,
    enabled: day !== DayOfWeek.SUNDAY && day !== DayOfWeek.SATURDAY,
    timeSlots: day !== DayOfWeek.SUNDAY && day !== DayOfWeek.SATURDAY
      ? [{ startTime: '09:00', endTime: '17:00' }]
      : [],
  }));
}

/**
 * Transform backend availability slots to DayAvailabilityDTO format
 * Groups slots by dayOfWeek and creates DayAvailabilityDTO objects
 */
export function transformAvailabilitySlotsToSchedule(
  slots: AvailabilitySlotDTO[]
): DayAvailabilityDTO[] {
  // Group slots by dayOfWeek
  const slotsByDay = new Map<DayOfWeek, AvailabilitySlotDTO[]>();
  
  for (const slot of slots) {
    const day = slot.dayOfWeek;
    if (!slotsByDay.has(day)) {
      slotsByDay.set(day, []);
    }
    slotsByDay.get(day)!.push(slot);
  }

  // Create DayAvailabilityDTO for all 7 days
  const allDays: DayAvailabilityDTO[] = [
    DayOfWeek.MONDAY,
    DayOfWeek.TUESDAY,
    DayOfWeek.WEDNESDAY,
    DayOfWeek.THURSDAY,
    DayOfWeek.FRIDAY,
    DayOfWeek.SATURDAY,
    DayOfWeek.SUNDAY,
  ].map((dayOfWeek) => {
    const daySlots = slotsByDay.get(dayOfWeek) || [];
    
    return {
      dayOfWeek,
      enabled: daySlots.length > 0,
      timeSlots: daySlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    };
  });

  return allDays;
}

/**
 * Transform DayAvailabilityDTO schedule back to AvailabilitySlotDTO format
 * Used when sending updates to the backend
 */
export function transformScheduleToAvailabilitySlots(
  schedule: DayAvailabilityDTO[]
): Omit<AvailabilitySlotDTO, 'id'>[] {
  const slots: Omit<AvailabilitySlotDTO, 'id'>[] = [];
  
  for (const day of schedule) {
    if (day.enabled && day.timeSlots.length > 0) {
      for (const timeSlot of day.timeSlots) {
        slots.push({
          dayOfWeek: day.dayOfWeek,
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
        });
      }
    }
  }
  
  return slots;
}

/**
 * Format professional full name from first and last name
 * Returns formatted name or undefined if both are missing
 */
export function formatProfessionalName(
  firstName?: string,
  lastName?: string
): string | undefined {
  if (!firstName && !lastName) {
    return undefined;
  }
  
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : undefined;
}


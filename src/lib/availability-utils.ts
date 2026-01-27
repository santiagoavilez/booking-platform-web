import type { DayAvailabilityDTO, TimeSlotDTO } from '@/shared/dtos/availability.dto';
import type { AppointmentDTO } from '@/shared/dtos/appointment.dto';
import { DayOfWeek } from '@/shared/dtos/availability.dto';

/**
 * Format date to YYYY-MM-DD string (local timezone)
 */
export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse YYYY-MM-DD string to Date (local timezone)
 */
export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Calculate available dates from weekly schedule
 * @param schedule - Weekly availability schedule
 * @param monthsAhead - Number of months to look ahead (default: 2)
 * @returns Set of available dates in YYYY-MM-DD format
 */
export function calculateAvailableDates(
  schedule: DayAvailabilityDTO[],
  monthsAhead: number = 2
): Set<string> {
  const dates = new Set<string>();
  const today = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  // Iterate through next N days
  for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay() as typeof DayOfWeek[keyof typeof DayOfWeek];
    const daySchedule = schedule.find((s) => s.dayOfWeek === dayOfWeek);

    if (daySchedule?.enabled && daySchedule.timeSlots.length > 0) {
      dates.add(formatDateString(d));
    }
  }

  return dates;
}

/**
 * Get time slots for a specific date from weekly schedule
 * @param date - The date to get slots for
 * @param schedule - Weekly availability schedule
 * @returns Array of time slots for that date
 */
export function getTimeSlotsForDate(
  date: Date,
  schedule: DayAvailabilityDTO[]
): TimeSlotDTO[] {
  const dayOfWeek = date.getDay() as typeof DayOfWeek[keyof typeof DayOfWeek];
  const daySchedule = schedule.find((s) => s.dayOfWeek === dayOfWeek);

  return daySchedule?.enabled ? daySchedule.timeSlots : [];
}

/**
 * Generate individual time slots from time ranges (1-hour intervals)
 * @param timeRanges - Array of time ranges
 * @returns Array of individual time slots (HH:mm format, always :00)
 */
export function generateTimeSlotsFromRanges(timeRanges: TimeSlotDTO[]): string[] {
  const slots: string[] = [];

  for (const range of timeRanges) {
    const startHour = parseInt(range.startTime.split(':')[0], 10);
    const startMinute = parseInt(range.startTime.split(':')[1], 10);
    const endHour = parseInt(range.endTime.split(':')[0], 10);
    const endMinute = parseInt(range.endTime.split(':')[1], 10);

    // Start from the next full hour if the range doesn't start exactly on the hour
    // For example: 09:30 -> start at 10:00, 09:00 -> start at 09:00
    let currentHour = startMinute === 0 ? startHour : startHour + 1;
    
    // Calculate the last valid hour slot (must be at least 1 hour before end time)
    const lastValidHour = endMinute === 0 ? endHour - 1 : endHour - 1;

    // Generate slots for each full hour
    while (currentHour <= lastValidHour) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:00`;
      slots.push(timeStr);
      currentHour += 1;
    }
  }

  return slots.sort();
}

/**
 * Check if a time slot is occupied by an appointment
 * @param timeSlot - The time slot to check (HH:mm format)
 * @param date - The date to check
 * @param appointments - Array of appointments for that date
 * @returns true if the slot is occupied
 */
export function isTimeSlotOccupied(
  timeSlot: string,
  date: Date,
  appointments: AppointmentDTO[]
): boolean {
  const dateStr = formatDateString(date);

  return appointments.some((appointment) => {
    if (appointment.date !== dateStr) return false;

    const slotTime = parseInt(timeSlot.replace(':', ''), 10);
    const appointmentStart = parseInt(appointment.startTime.replace(':', ''), 10);
    const appointmentEnd = parseInt(appointment.endTime.replace(':', ''), 10);

    return slotTime >= appointmentStart && slotTime < appointmentEnd;
  });
}

/**
 * Filter available time slots by removing occupied ones
 * @param timeSlots - Array of time slot strings (HH:mm format)
 * @param date - The date to check
 * @param appointments - Array of appointments for that date
 * @returns Array of available (non-occupied) time slots
 */
export function filterAvailableTimeSlots(
  timeSlots: string[],
  date: Date,
  appointments: AppointmentDTO[]
): string[] {
  return timeSlots.filter((slot) => !isTimeSlotOccupied(slot, date, appointments));
}

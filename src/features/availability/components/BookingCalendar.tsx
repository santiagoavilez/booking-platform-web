import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DayOfWeek } from '@/shared/dtos/availability.dto';
import { formatDateString } from '@/lib/availability-utils';

interface BookingCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  availableDates: Set<string>; // Set of dates in YYYY-MM-DD format that have availability
}

const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const DAY_NAMES_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function BookingCalendar({
  selectedDate,
  onDateSelect,
  availableDates,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Check if date is available
  const isDateAvailable = (day: number): boolean => {
    const date = new Date(year, month, day);
    const dateStr = formatDateString(date);
    return availableDates.has(dateStr);
  };

  // Check if date is today
  const isToday = (day: number): boolean => {
    const today = new Date();
    const date = new Date(year, month, day);
    return formatDateString(today) === formatDateString(date);
  };

  // Check if date is selected
  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    const date = new Date(year, month, day);
    return formatDateString(selectedDate) === formatDateString(date);
  };

  // Handle date click
  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day);
    if (isDateAvailable(day)) {
      onDateSelect(date);
    }
  };

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="w-full">
      {/* Month navigation */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goToPreviousMonth}
          className="size-8"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>
        
        <h3 className="text-sm font-semibold md:text-base">
          {MONTH_NAMES[month]} {year}
        </h3>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="size-8"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {/* Day names header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAY_NAMES_SHORT.map((dayName) => (
          <div
            key={dayName}
            className="text-center text-xs font-medium text-muted-foreground"
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const available = isDateAvailable(day);
          const selected = isSelected(day);
          const today = isToday(day);

          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={!available}
              className={cn(
                'aspect-square rounded-md text-sm transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                {
                  'cursor-pointer hover:bg-primary/10': available,
                  'cursor-not-allowed opacity-30': !available,
                  'bg-primary text-primary-foreground': selected,
                  'border-2 border-primary': today && !selected,
                  'bg-primary/20': available && !selected && !today,
                }
              )}
              aria-label={`${day} de ${MONTH_NAMES[month]}`}
              aria-pressed={selected}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

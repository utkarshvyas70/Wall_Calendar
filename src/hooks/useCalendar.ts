import { useState, useMemo, ImgHTMLAttributes } from 'react';

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

// Seasonal Editorial Landscapes (12 months)
export const MONTH_IMAGES = [
  "/Assets/January.png",
  "/Assets/February.png",
  "/Assets/March.png",
  "/Assets/April.png",
  "/Assets/May.png",
  "/Assets/June.png",
  "/Assets/July.png",
  "/Assets/August.png",
  "/Assets/September.png",
  "/Assets/October.png",
  "/Assets/November.png",
  "/Assets/December.png"
];

// Indian Public Holidays 2025 (Format: Month-Day, 0-indexed month)
export const HOLIDAYS_2025: Record<string, string> = {
  '0-26': 'Republic Day',
  '2-14': 'Holi',
  '3-10': 'Good Friday',
  '3-14': 'Ambedkar Jayanti',
  '7-15': 'Independence Day',
  '9-2':  'Gandhi Jayanti',
  '9-20': 'Diwali', // Approx for 2025
  '11-25': 'Christmas',
};

export function useCalendar() {
  const today = startOfDay(new Date());

  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date(); d.setDate(1); return startOfDay(d);
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [renderKey, setRenderKey] = useState(0); // Forces re-render for crossfades

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const triggerTransition = (dir: 'left' | 'right', action: () => void) => {
    setSlideDirection(dir);
    setIsAnimating(true);
    setRenderKey(prev => prev + 1);
    action();
    setTimeout(() => setIsAnimating(false), 220); // Matches CSS duration
  };

  const nextMonth = () => triggerTransition('left', () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)));
  const prevMonth = () => triggerTransition('right', () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)));
  
  const goToToday = () => {
    const d = new Date(); d.setDate(1); const newMonth = startOfDay(d);
    if (newMonth.getTime() !== currentDate.getTime()) {
      triggerTransition(newMonth.getTime() > currentDate.getTime() ? 'left' : 'right', () => setCurrentDate(newMonth));
    }
  };

  const handleDateClick = (clickedDate: Date) => {
    const time = clickedDate.getTime();
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate); setEndDate(null);
    } else if (startDate && !endDate) {
      time > startDate.getTime() ? setEndDate(clickedDate) : setStartDate(clickedDate);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setStartDate(null); setEndDate(null); setHoverDate(null); }
  };

  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1; 
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    const grid = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      grid.push({ date: new Date(year, month - 1, daysInPrevMonth - i), isCurrentMonth: false, isToday: false, timestamp: 0 });
    }
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const d = new Date(year, month, i);
      grid.push({ date: d, isCurrentMonth: true, isToday: d.getTime() === today.getTime(), timestamp: d.getTime() });
    }
    const remaining = 42 - grid.length;
    for (let i = 1; i <= remaining; i++) {
      grid.push({ date: new Date(year, month + 1, i), isCurrentMonth: false, isToday: false, timestamp: 0 });
    }
    return grid;
  }, [currentDate, today]);

  return {
    currentDate, currentMonth, currentYear, startDate, endDate, hoverDate, days, renderKey,
    nextMonth, prevMonth, goToToday, handleDateClick, setHoverDate, handleKeyDown, slideDirection, isAnimating
  };
}
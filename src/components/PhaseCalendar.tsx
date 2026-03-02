import { useState, useMemo } from 'react';
import { getCalendarDays, getMoonPhaseForDate, getIllumination, getMoonPhase } from '../utils/moonCalculations';

interface PhaseCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function PhaseCalendar({ selectedDate, onDateSelect }: PhaseCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const calendarDays = useMemo(() => {
    return getCalendarDays(viewDate.getFullYear(), viewDate.getMonth());
  }, [viewDate]);

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isSelected = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  const getMiniMoon = (date: Date) => {
    const phase = getMoonPhase(date);
    const illumination = getIllumination(phase);
    const isWaxing = phase < 0.5;

    // Simplified mini moon visualization
    const shadowPercent = isWaxing
      ? (1 - phase * 2) * 100
      : ((phase - 0.5) * 2) * 100;

    const direction = isWaxing ? 'right' : 'left';

    return (
      <div
        className="w-4 h-4 md:w-5 md:h-5 rounded-full relative overflow-hidden mx-auto"
        style={{
          background: 'linear-gradient(135deg, #e8e6e3 0%, #c0beb9 100%)',
          boxShadow: illumination > 50
            ? '0 0 4px rgba(232, 230, 227, 0.3)'
            : 'none',
        }}
      >
        <div
          className="absolute inset-0 rounded-full transition-all"
          style={{
            clipPath: phase < 0.02 || phase > 0.98
              ? 'circle(50% at 50% 50%)'
              : phase > 0.48 && phase < 0.52
                ? 'circle(0% at 50% 50%)'
                : `ellipse(${shadowPercent}% 100% at ${direction === 'right' ? '100%' : '0%'} 50%)`,
            background: 'rgba(10, 14, 23, 0.95)',
          }}
        />
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevMonth}
          className="p-3 text-[#e8e6e3]/60 hover:text-[#c9a961] transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="font-display text-xl md:text-2xl text-[#e8e6e3]">{monthName}</h3>

        <button
          onClick={goToNextMonth}
          className="p-3 text-[#e8e6e3]/60 hover:text-[#c9a961] transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-[#e8e6e3]/40 font-body uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => (
          <button
            key={index}
            onClick={() => date && onDateSelect(date)}
            disabled={!date}
            className={`
              aspect-square p-1 rounded-lg transition-all duration-200
              flex flex-col items-center justify-center gap-0.5
              ${!date ? 'invisible' : 'cursor-pointer'}
              ${isSelected(date)
                ? 'bg-[#c9a961]/20 ring-1 ring-[#c9a961]'
                : 'hover:bg-[#e8e6e3]/5'}
              ${isToday(date) && !isSelected(date) ? 'ring-1 ring-[#e8e6e3]/20' : ''}
            `}
          >
            {date && (
              <>
                <span className={`
                  text-xs md:text-sm font-body
                  ${isSelected(date) ? 'text-[#c9a961]' : 'text-[#e8e6e3]/70'}
                  ${isToday(date) ? 'font-semibold' : ''}
                `}>
                  {date.getDate()}
                </span>
                {getMiniMoon(date)}
              </>
            )}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-[#e8e6e3]/40 font-body">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#e8e6e3]" />
          <span>Full</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1a1a24] border border-[#e8e6e3]/20" />
          <span>New</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 rounded ring-1 ring-[#c9a961] bg-[#c9a961]/20" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}

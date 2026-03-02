import { useState, useEffect } from 'react';
import MoonDisplay from './components/MoonDisplay';
import PhaseCalendar from './components/PhaseCalendar';
import MoonInfo from './components/MoonInfo';
import { getMoonPhase, getMoonPhaseForDate, MoonPhaseData } from './utils/moonCalculations';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moonData, setMoonData] = useState<MoonPhaseData | null>(null);

  useEffect(() => {
    const data = getMoonPhaseForDate(selectedDate);
    setMoonData(data);
  }, [selectedDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const resetToToday = () => {
    setSelectedDate(new Date());
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="min-h-screen bg-[#0a0e17] text-[#e8e6e3] overflow-x-hidden relative">
      {/* Star field background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars-layer-1" />
        <div className="stars-layer-2" />
        <div className="stars-layer-3" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a0e17]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-8 md:pt-12 pb-4 px-4 text-center">
          <div className="animate-fade-in">
            <p className="text-[#c9a961] text-xs md:text-sm tracking-[0.3em] uppercase mb-2 font-body">
              Celestial Observatory
            </p>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[#e8e6e3] tracking-wide">
              Luna
            </h1>
            <div className="h-px w-24 md:w-32 mx-auto mt-4 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent" />
          </div>
        </header>

        {/* Moon Display Section */}
        <main className="flex-1 flex flex-col items-center px-4 pb-8">
          <div className="w-full max-w-6xl mx-auto">
            {/* Date indicator */}
            <div className="text-center mb-6 md:mb-8 animate-fade-in-delay-1">
              <p className="font-body text-sm md:text-base text-[#e8e6e3]/60">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {!isToday && (
                <button
                  onClick={resetToToday}
                  className="mt-2 text-[#c9a961] text-xs tracking-wider uppercase hover:text-[#e8e6e3] transition-colors duration-300"
                >
                  Return to Today
                </button>
              )}
            </div>

            {/* Moon and Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              {/* Left: Moon Info */}
              <div className="order-2 lg:order-1 animate-fade-in-delay-2">
                {moonData && <MoonInfo moonData={moonData} position="left" />}
              </div>

              {/* Center: Moon Display */}
              <div className="order-1 lg:order-2 flex justify-center animate-fade-in-delay-1">
                {moonData && <MoonDisplay illumination={moonData.illumination} phase={moonData.phase} />}
              </div>

              {/* Right: Additional Info */}
              <div className="order-3 animate-fade-in-delay-3">
                {moonData && <MoonInfo moonData={moonData} position="right" />}
              </div>
            </div>

            {/* Phase Calendar */}
            <div className="mt-12 md:mt-16 animate-fade-in-delay-4">
              <PhaseCalendar
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 text-center border-t border-[#e8e6e3]/5">
          <p className="font-body text-xs text-[#e8e6e3]/30 tracking-wide">
            Requested by @web-user · Built by @clonkbot
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

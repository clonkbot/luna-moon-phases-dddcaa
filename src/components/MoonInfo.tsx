import { MoonPhaseData } from '../utils/moonCalculations';

interface MoonInfoProps {
  moonData: MoonPhaseData;
  position: 'left' | 'right';
}

export default function MoonInfo({ moonData, position }: MoonInfoProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 0 ? 'Today' : days === 1 ? '1 day' : `${days} days`;
  };

  if (position === 'left') {
    return (
      <div className="text-center lg:text-right space-y-6 md:space-y-8">
        {/* Phase Name */}
        <div>
          <p className="text-[#c9a961] text-xs tracking-[0.2em] uppercase mb-2 font-body">Current Phase</p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-[#e8e6e3]">
            {moonData.phaseName}
          </h2>
          <span className="text-4xl md:text-5xl mt-2 block">{moonData.emoji}</span>
        </div>

        {/* Lunar Age */}
        <div>
          <p className="text-[#c9a961] text-xs tracking-[0.2em] uppercase mb-2 font-body">Lunar Age</p>
          <p className="font-display text-xl md:text-2xl text-[#e8e6e3]">
            {moonData.age} <span className="text-sm text-[#e8e6e3]/60">days</span>
          </p>
          <p className="text-xs text-[#e8e6e3]/40 mt-1 font-body">of 29.5 day cycle</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center lg:text-left space-y-6 md:space-y-8">
      {/* Description */}
      <div>
        <p className="text-[#c9a961] text-xs tracking-[0.2em] uppercase mb-2 font-body">Lunar Wisdom</p>
        <p className="font-body text-sm md:text-base text-[#e8e6e3]/80 leading-relaxed max-w-xs mx-auto lg:mx-0">
          {moonData.description}
        </p>
      </div>

      {/* Upcoming Phases */}
      <div className="space-y-4">
        <div className="flex items-center justify-center lg:justify-start gap-3">
          <span className="text-2xl">🌕</span>
          <div>
            <p className="text-xs text-[#e8e6e3]/40 font-body uppercase tracking-wider">Next Full Moon</p>
            <p className="font-display text-lg text-[#e8e6e3]">
              {formatDate(moonData.nextFullMoon)}
              <span className="text-sm text-[#c9a961] ml-2">({getDaysUntil(moonData.nextFullMoon)})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-3">
          <span className="text-2xl">🌑</span>
          <div>
            <p className="text-xs text-[#e8e6e3]/40 font-body uppercase tracking-wider">Next New Moon</p>
            <p className="font-display text-lg text-[#e8e6e3]">
              {formatDate(moonData.nextNewMoon)}
              <span className="text-sm text-[#c9a961] ml-2">({getDaysUntil(moonData.nextNewMoon)})</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

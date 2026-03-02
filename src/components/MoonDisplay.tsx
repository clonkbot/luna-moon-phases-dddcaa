import { useMemo } from 'react';

interface MoonDisplayProps {
  illumination: number;
  phase: string;
}

export default function MoonDisplay({ illumination, phase }: MoonDisplayProps) {
  const phaseValue = parseFloat(phase);

  // Calculate the shadow position based on moon phase
  const shadowStyle = useMemo(() => {
    // Phase 0 = new moon (all shadow), 0.5 = full moon (no shadow)
    // 0-0.5: shadow from right to left (waxing)
    // 0.5-1: shadow from left to right (waning)

    const isWaxing = phaseValue < 0.5;
    const adjustedPhase = isWaxing ? phaseValue * 2 : (phaseValue - 0.5) * 2;

    if (phaseValue < 0.02 || phaseValue > 0.98) {
      // New moon - full shadow
      return {
        clipPath: 'circle(50% at 50% 50%)',
        background: 'radial-gradient(circle at 50% 50%, #1a1a24 0%, #0d0d14 100%)',
      };
    }

    if (phaseValue > 0.48 && phaseValue < 0.52) {
      // Full moon - no shadow
      return {
        clipPath: 'circle(0% at 50% 50%)',
        background: 'transparent',
      };
    }

    // Calculate ellipse for shadow
    const shadowWidth = isWaxing
      ? Math.abs(1 - adjustedPhase) * 100
      : adjustedPhase * 100;

    const shadowDirection = isWaxing ? 'right' : 'left';
    const xPos = shadowDirection === 'right' ? 100 - shadowWidth / 2 : shadowWidth / 2;

    return {
      clipPath: `ellipse(${shadowWidth}% 100% at ${shadowDirection === 'right' ? '100%' : '0%'} 50%)`,
      background: `linear-gradient(${shadowDirection === 'right' ? '90deg' : '270deg'},
        rgba(10, 14, 23, 0.98) 0%,
        rgba(10, 14, 23, 0.95) 40%,
        rgba(10, 14, 23, 0.8) 80%,
        rgba(10, 14, 23, 0.4) 100%)`,
    };
  }, [phaseValue]);

  return (
    <div className="relative">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(232, 230, 227, 0.4) 0%, transparent 70%)',
          transform: 'scale(1.5)',
        }}
      />

      {/* Moon container */}
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
        {/* Base moon surface */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: `
              radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 60%, rgba(200, 200, 200, 0.1) 0%, transparent 30%),
              radial-gradient(circle at 20% 70%, rgba(180, 180, 180, 0.08) 0%, transparent 25%),
              radial-gradient(circle at 60% 30%, rgba(220, 220, 220, 0.06) 0%, transparent 20%),
              radial-gradient(circle at 45% 80%, rgba(200, 200, 200, 0.05) 0%, transparent 15%),
              radial-gradient(circle at 80% 20%, rgba(190, 190, 190, 0.07) 0%, transparent 20%),
              radial-gradient(circle at 50% 50%, #e8e6e3 0%, #d4d2cf 30%, #bab8b5 60%, #9a9896 100%)
            `,
            boxShadow: `
              inset -8px -8px 20px rgba(0, 0, 0, 0.3),
              inset 4px 4px 15px rgba(255, 255, 255, 0.2),
              0 0 60px rgba(232, 230, 227, ${illumination / 400}),
              0 0 120px rgba(232, 230, 227, ${illumination / 600})
            `,
          }}
        >
          {/* Crater details */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute rounded-full"
              style={{
                width: '25%',
                height: '25%',
                top: '20%',
                left: '25%',
                background: 'radial-gradient(circle at 40% 40%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 50%, transparent 70%)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '18%',
                height: '18%',
                top: '55%',
                left: '60%',
                background: 'radial-gradient(circle at 40% 40%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.15) 50%, transparent 70%)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '12%',
                height: '12%',
                top: '35%',
                left: '65%',
                background: 'radial-gradient(circle at 40% 40%, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.12) 50%, transparent 70%)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '15%',
                height: '15%',
                top: '70%',
                left: '30%',
                background: 'radial-gradient(circle at 40% 40%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 50%, transparent 70%)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '8%',
                height: '8%',
                top: '15%',
                left: '55%',
                background: 'radial-gradient(circle at 40% 40%, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 50%, transparent 70%)',
              }}
            />
          </div>
        </div>

        {/* Shadow overlay */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-out"
          style={shadowStyle}
        />

        {/* Subtle edge highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />
      </div>

      {/* Illumination label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
        <span className="font-display text-2xl md:text-3xl text-[#c9a961]">{illumination}%</span>
        <span className="block text-xs text-[#e8e6e3]/40 tracking-widest uppercase mt-1">Illuminated</span>
      </div>
    </div>
  );
}

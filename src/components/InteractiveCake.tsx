import React, { useState } from 'react';
import { audio } from '../utils/audio';
import { triggerCandleBlownCelebration } from '../utils/confetti';

interface InteractiveCakeProps {
  age?: number | null;
  name: string;
  onBlowSuccess?: () => void;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({ age, name, onBlowSuccess }) => {
  // Candle state: array of booleans indicating if each candle is currently lit
  // If age is small (<= 7), use that count, otherwise 3-5 celebratory milestone candles
  const candleCount = age && age > 0 && age <= 7 ? age : 5;
  const [litCandles, setLitCandles] = useState<boolean[]>(Array(candleCount).fill(true));
  const [hasBlownAll, setHasBlownAll] = useState(false);
  const [blowingAnimation, setBlowingAnimation] = useState(false);

  const allOut = litCandles.every((lit) => !lit);

  const blowAllCandles = () => {
    if (allOut) return;
    setBlowingAnimation(true);
    audio.playCandleBlow();

    setTimeout(() => {
      setLitCandles(Array(candleCount).fill(false));
      setHasBlownAll(true);
      setBlowingAnimation(false);
      triggerCandleBlownCelebration();
      if (onBlowSuccess) onBlowSuccess();
    }, 450);
  };

  const toggleCandle = (index: number) => {
    const updated = [...litCandles];
    const willBeLit = !updated[index];
    updated[index] = willBeLit;
    setLitCandles(updated);

    if (!willBeLit) {
      audio.playCandleBlow();
      if (updated.every((lit) => !lit)) {
        setHasBlownAll(true);
        triggerCandleBlownCelebration();
        if (onBlowSuccess) onBlowSuccess();
      }
    } else {
      audio.playClick();
    }
  };

  const relightCandles = () => {
    audio.playClick();
    setLitCandles(Array(candleCount).fill(true));
    setHasBlownAll(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full my-4 select-none relative">
      {/* Interactive Birthday Cake Illustration */}
      <div className="relative flex flex-col items-center justify-end w-64 h-56 pt-6">
        {/* Candles Row */}
        <div className="flex items-end justify-center gap-3 z-20 mb-[-6px]">
          {litCandles.map((isLit, idx) => {
            const candleColors = ['#ff73b2', '#feb700', '#c084fc', '#38bdf8', '#4ade80'];
            const color = candleColors[idx % candleColors.length];

            return (
              <div
                key={idx}
                onClick={() => toggleCandle(idx)}
                className="flex flex-col items-center cursor-pointer group"
                title={isLit ? 'Click to blow out this candle' : 'Click to relight'}
              >
                {/* Flame / Smoke */}
                <div className="h-7 flex items-center justify-center relative">
                  {isLit ? (
                    <div className="w-3.5 h-6 rounded-full bg-gradient-to-t from-[#ff8c00] via-[#feb700] to-[#fff3bf] flame-active cursor-pointer transform -translate-y-0.5">
                      {/* Core flame */}
                      <div className="w-1.5 h-3 bg-white/90 rounded-full mx-auto mt-2"></div>
                    </div>
                  ) : (
                    <div className="w-1.5 h-4 bg-gray-400/60 rounded-full smoke-puff pointer-events-none"></div>
                  )}
                </div>

                {/* Wick */}
                <div className="w-0.5 h-2 bg-neutral-800"></div>

                {/* Candle Body */}
                <div
                  className="w-3.5 h-12 rounded-t-sm shadow-md flex flex-col justify-between overflow-hidden border border-white/20"
                  style={{ backgroundColor: color }}
                >
                  <div className="w-full h-1.5 bg-white/40 transform -skew-y-12"></div>
                  <div className="w-full h-1.5 bg-white/40 transform -skew-y-12"></div>
                  <div className="w-full h-1.5 bg-white/40 transform -skew-y-12"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Cake Tier */}
        <div className="relative w-44 h-16 rounded-2xl bg-gradient-to-b from-[#ff8ebb] to-[#d6006e] shadow-xl border-t border-white/30 z-10 flex flex-col items-center">
          {/* Frosting drips */}
          <div className="w-full flex justify-around px-2 pt-0.5">
            <div className="w-4 h-3.5 bg-white rounded-b-full shadow-sm"></div>
            <div className="w-4 h-5 bg-white rounded-b-full shadow-sm"></div>
            <div className="w-5 h-3 bg-white rounded-b-full shadow-sm"></div>
            <div className="w-4 h-5 bg-white rounded-b-full shadow-sm"></div>
            <div className="w-4 h-3.5 bg-white rounded-b-full shadow-sm"></div>
          </div>
          {/* Decorative Sprinkles */}
          <div className="flex gap-4 mt-2">
            <span className="w-1.5 h-3 bg-[#feb700] rounded-full transform rotate-45"></span>
            <span className="w-2.5 h-1 bg-[#00f2fe] rounded-full"></span>
            <span className="w-1.5 h-2.5 bg-white rounded-full transform -rotate-12"></span>
            <span className="w-2 h-1 bg-[#a855f7] rounded-full transform rotate-30"></span>
          </div>
          {/* Age medallion on cake */}
          {age && (
            <div className="absolute -bottom-2 px-2.5 py-0.5 bg-[#feb700] text-[#412d00] font-black text-xs rounded-full shadow-md border border-white/40">
              {age}
            </div>
          )}
        </div>

        {/* Bottom Cake Tier */}
        <div className="relative w-56 h-20 rounded-2xl bg-gradient-to-b from-[#8a2be2] to-[#4c0f82] shadow-2xl border-t border-white/20 mt-[-6px] flex flex-col items-center">
          {/* Purple velvet frosting drips */}
          <div className="w-full flex justify-between px-3">
            <div className="w-5 h-4 bg-[#ffb1c7] rounded-b-full shadow-sm"></div>
            <div className="w-6 h-6 bg-[#ffb1c7] rounded-b-full shadow-sm"></div>
            <div className="w-5 h-4 bg-[#ffb1c7] rounded-b-full shadow-sm"></div>
            <div className="w-6 h-6 bg-[#ffb1c7] rounded-b-full shadow-sm"></div>
            <div className="w-5 h-4 bg-[#ffb1c7] rounded-b-full shadow-sm"></div>
          </div>
          <div className="text-white/80 font-bold text-xs tracking-wider uppercase mt-2">
            ★ Celebration ★
          </div>
        </div>

        {/* Cake Platter */}
        <div className="w-64 h-3.5 bg-gradient-to-r from-[#eaddf9] via-white to-[#aa8890] rounded-full shadow-2xl -mt-1 border border-white/50"></div>
      </div>

      {/* Action Prompt */}
      <div className="mt-4 flex flex-col items-center gap-2">
        {!hasBlownAll ? (
          <button
            onClick={blowAllCandles}
            disabled={blowingAnimation}
            className={`px-5 py-2.5 rounded-full bg-gradient-to-r from-[#e6007a] via-[#ba0061] to-[#feb700] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(230,0,122,0.5)] hover:shadow-[0_0_28px_rgba(230,0,122,0.7)] active:scale-95 transition-all flex items-center gap-2 ${
              blowingAnimation ? 'animate-pulse' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">air</span>
            <span>Make a Wish & Blow Candles! 🌬️🎂</span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2 animate-fadeIn">
            <div className="px-4 py-1.5 rounded-full bg-[#feb700]/20 border border-[#feb700]/40 text-[#ffdea8] font-bold text-sm flex items-center gap-1.5">
              <span>✨ Wish Sent to the Stars for {name}! ✨</span>
            </div>
            <button
              onClick={relightCandles}
              className="px-4 py-1.5 rounded-full bg-[#2e263b] hover:bg-[#3e354b] text-[#eaddf9] text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px] text-[#feb700]">local_fire_department</span>
              <span>Relight Candles 🕯️</span>
            </button>
          </div>
        )}
        <span className="text-[11px] text-[#aa8890]">
          {!hasBlownAll ? 'Tip: You can also tap individual candles!' : 'Candles extinguished with magic!'}
        </span>
      </div>
    </div>
  );
};

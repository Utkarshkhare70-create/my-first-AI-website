import React from 'react';
import { APP_LOGO } from '../utils/presets';
import { audio } from '../utils/audio';
import { triggerConfettiBurst } from '../utils/confetti';

interface NavbarProps {
  currentTab: 'customize' | 'celebration';
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  isMuted,
  onToggleMute,
  onOpenProfile,
}) => {
  const handleConfettiClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    audio.playPopper();
    triggerConfettiBurst(x, y);
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#120b1d]/85 backdrop-blur-xl border-b border-white/5 shadow-sm">
      <div className="h-16 px-4 max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Lockup */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            alt="Birthday Wish Logo"
            className="h-8 w-auto object-contain flex-shrink-0 drop-shadow-md"
            src={APP_LOGO}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-display font-bold text-xl text-[#ffb1c7] tracking-tight truncate leading-none">
              hutk
            </span>
            <span className="text-[10px] text-[#ffba20] uppercase font-bold tracking-wider leading-none mt-1">
              {currentTab === 'customize' ? 'Customize & Name' : 'Celebration Wish'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label="Toggle celebration sound"
            title={isMuted ? 'Unmute music & sounds' : 'Mute music & sounds'}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#ffdb9d] hover:text-[#ffdea8] hover:bg-white/5 transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* Trigger Confetti Burst */}
          <button
            onClick={handleConfettiClick}
            aria-label="Trigger celebratory confetti burst"
            title="Celebrate with confetti burst! 🎉"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#ffb1c7] hover:text-[#ffd9e2] hover:bg-white/5 transition-all active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">celebration</span>
          </button>

          {/* User profile avatar / about */}
          <button
            onClick={onOpenProfile}
            aria-label="Celebration host profile"
            className="w-8 h-8 rounded-full bg-[#ffb1c7] flex items-center justify-center ml-1 flex-shrink-0 shadow-[0_0_12px_rgba(255,177,199,0.35)] active:scale-95 transition-transform"
            type="button"
          >
            <span className="material-symbols-outlined text-[#650032] text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};

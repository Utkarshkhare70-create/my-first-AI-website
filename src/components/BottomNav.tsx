import React from 'react';
import { audio } from '../utils/audio';

interface BottomNavProps {
  currentTab: 'customize' | 'celebration';
  onSelectTab: (tab: 'customize' | 'celebration') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#120b1d]/90 backdrop-blur-xl border-t border-white/5 shadow-lg">
      <div className="flex items-center justify-around h-16 px-4 max-w-md mx-auto">
        <button
          onClick={() => {
            audio.playClick();
            onSelectTab('customize');
          }}
          className={`flex flex-col items-center justify-center w-full min-h-[44px] py-1 transition-all active:scale-95 ${
            currentTab === 'customize'
              ? 'text-[#ffb1c7] font-bold drop-shadow-[0_0_8px_rgba(255,177,199,0.4)]'
              : 'text-[#e3bdc6]/70 hover:text-[#eaddf9]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentTab === 'customize' ? "'FILL' 1" : "'FILL' 0" }}
          >
            tune
          </span>
          <span className="text-xs mt-0.5 tracking-tight">Customize &amp; Name</span>
        </button>

        <button
          onClick={() => {
            audio.playClick();
            onSelectTab('celebration');
          }}
          className={`flex flex-col items-center justify-center w-full min-h-[44px] py-1 transition-all active:scale-95 ${
            currentTab === 'celebration'
              ? 'text-[#ffb1c7] font-bold drop-shadow-[0_0_8px_rgba(255,177,199,0.4)]'
              : 'text-[#e3bdc6]/70 hover:text-[#eaddf9]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentTab === 'celebration' ? "'FILL' 1" : "'FILL' 0" }}
          >
            cake
          </span>
          <span className="text-xs mt-0.5 tracking-tight">Celebration Wish</span>
        </button>
      </div>
    </nav>
  );
};

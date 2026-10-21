import React, { useState } from 'react';
import { BirthdayWish } from '../types/wish';
import { InteractiveCake } from './InteractiveCake';
import { audio } from '../utils/audio';
import { triggerConfettiBurst, triggerStarShower } from '../utils/confetti';
import { MILESTONE_TAGS } from '../utils/presets';

interface CelebrationStageProps {
  wish: BirthdayWish;
  onBackToEditor: () => void;
  onOpenShareModal: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export const CelebrationStage: React.FC<CelebrationStageProps> = ({
  wish,
  onBackToEditor,
  onOpenShareModal,
  isMusicPlaying,
  onToggleMusic,
}) => {
  const [reactions, setReactions] = useState<Record<string, number>>(
    wish.reactions || { '❤️': 14, '🎉': 32, '🎂': 21, '🥂': 18, '👑': 9 }
  );
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [wishGrantedToast, setWishGrantedToast] = useState(false);

  const milestone = wish.age ? MILESTONE_TAGS[wish.age] : undefined;

  const handleAddReaction = (emoji: string, e: React.MouseEvent<HTMLButtonElement>) => {
    audio.playPopper();
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));

    // Add floating emoji
    const rect = e.currentTarget.getBoundingClientRect();
    const newEmoji: FloatingEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== newEmoji.id));
    }, 1500);
  };

  const handleManualConfetti = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    audio.playPopper();
    triggerConfettiBurst(x, y);
  };

  const handleManualStars = () => {
    audio.playPopper();
    triggerStarShower();
  };

  const handleManualFireworks = () => {
    audio.playFirework();
    triggerConfettiBurst(0.5, 0.3);
  };

  const handleCandleBlown = () => {
    setWishGrantedToast(true);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[calc(100vh-8rem)] px-4 sm:px-6 pb-28 pt-4 max-w-xl mx-auto relative z-10">
      {/* Wish Granted Floating Toast Notification */}
      {wishGrantedToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#feb700] via-[#e6007a] to-[#9e45f7] text-white font-extrabold text-sm shadow-[0_0_30px_rgba(254,183,0,0.6)] animate-bounce flex items-center gap-2">
          <span>🎉 BLESSED & CELEBRATED! Wish Granted for {wish.name}! 🌟</span>
          <button
            onClick={() => setWishGrantedToast(false)}
            className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Interactive Emoji particles */}
      {floatingEmojis.map((item) => (
        <div
          key={item.id}
          style={{ left: item.x, top: item.y }}
          className="fixed pointer-events-none z-50 text-2xl animate-floatUp"
        >
          {item.emoji}
        </div>
      ))}

      {/* Recipient Profile Hero Spotlight */}
      <div className="flex flex-col items-center text-center mt-2">
        {/* Recipient Avatar with festive styling */}
        <div className="relative group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#e6007a] via-[#feb700] to-[#9e45f7] p-1.5 shadow-[0_0_32px_rgba(230,0,122,0.4)]">
            <div className="w-full h-full rounded-full bg-[#120b1d] overflow-hidden relative border-2 border-white/20">
              <img
                src={wish.photoUrl}
                alt={wish.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Party Hat */}
          <div className="absolute -top-4 -right-3 transform rotate-12 drop-shadow-xl animate-bounce">
            <div className="w-11 h-11 rounded-full bg-[#feb700] flex items-center justify-center text-[#412d00] shadow-lg border-2 border-white/30">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                celebration
              </span>
            </div>
          </div>

          {/* Star Badge */}
          <div className="absolute -bottom-1 -left-2">
            <div className="w-8 h-8 rounded-full bg-[#9e45f7] flex items-center justify-center text-white shadow-md border border-white/30">
              <span
                className="material-symbols-outlined text-[17px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
          </div>
        </div>

        {/* Recipient Name and Milestone Title */}
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#ffb1c7] tracking-tight drop-shadow-md">
              {wish.name.trim() || 'Utkarsh'}
            </h1>
            {wish.age && (
              <span className="px-3 py-1 rounded-full bg-[#feb700] text-[#412d00] font-black text-sm shadow-md">
                Turning {wish.age}
              </span>
            )}
          </div>

          {milestone && (
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#ffdea8] mt-1 bg-[#2e263b] px-3 py-0.5 rounded-full border border-white/10">
              ★ {milestone} ★
            </span>
          )}

          <p className="text-xs text-[#e3bdc6] mt-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-[#ffba20]">
              auto_awesome
            </span>
            <span>A custom magical celebration experience created with love</span>
          </p>
        </div>
      </div>

      {/* Interactive 3D Birthday Cake */}
      <InteractiveCake
        age={wish.age}
        name={wish.name.trim() || 'Utkarsh'}
        onBlowSuccess={handleCandleBlown}
      />

      {/* The Birthday Wish Card */}
      <div className="w-full bg-[#1f182c]/90 border border-white/15 backdrop-blur-xl rounded-2xl p-5 shadow-2xl relative my-3 overflow-hidden">
        {/* Glow ambient accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#e6007a]/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Music Playing Indicator Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onToggleMusic}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isMusicPlaying
                  ? 'bg-[#e6007a] text-white shadow-[0_0_10px_rgba(230,0,122,0.5)]'
                  : 'bg-[#2e263b] text-[#feb700]'
              }`}
              title={isMusicPlaying ? 'Pause soundtrack' : 'Play soundtrack'}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isMusicPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] uppercase tracking-wider text-[#aa8890] font-semibold">
                Celebration Track
              </span>
              <span className="text-xs font-bold text-[#eaddf9] truncate">
                {wish.soundtrack === 'acoustic'
                  ? 'Festive Acoustic Birthday'
                  : wish.soundtrack === 'pop'
                  ? 'Upbeat Pop Celebration'
                  : 'Lofi Birthday Chimes'}
              </span>
            </div>
          </div>

          {/* Animated sound bars when playing */}
          <div className="flex items-end gap-1 h-5 px-2">
            {[0.8, 0.4, 1.0, 0.6, 0.9].map((height, i) => (
              <span
                key={i}
                className={`w-1 bg-[#ffb1c7] rounded-full transition-all ${
                  isMusicPlaying ? 'animate-pulse' : 'opacity-40'
                }`}
                style={{
                  height: isMusicPlaying ? `${height * 18}px` : '4px',
                  animationDelay: `${i * 120}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Wish Quote Prose */}
        <div className="relative py-2">
          <span className="material-symbols-outlined text-[#ffb1c7]/30 text-3xl absolute -top-1 -left-2 pointer-events-none select-none">
            format_quote
          </span>
          <p className="font-display font-medium text-base sm:text-lg text-[#eaddf9] leading-relaxed italic pl-5 pr-2">
            "{wish.message}"
          </p>
        </div>

        {/* Footer Tag */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-3 text-xs text-[#aa8890]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#feb700]">flare</span>
            <span>
              Theme: <strong className="text-[#eaddf9]">{wish.themeFx}</strong>
            </span>
          </span>
          <span className="text-[#ffb1c7] font-semibold">hutk Special</span>
        </div>
      </div>

      {/* Celebration Reaction Deck */}
      <div className="w-full bg-[#120b1d]/80 border border-white/5 rounded-2xl p-3.5 my-2 flex flex-col gap-2">
        <span className="text-xs text-[#aa8890] font-semibold uppercase tracking-wider text-center">
          Tap to Send Birthday Love &amp; Cheers!
        </span>
        <div className="flex items-center justify-around gap-1.5 flex-wrap">
          {Object.entries(reactions).map(([emoji, count]) => (
            <button
              key={emoji}
              onClick={(e) => handleAddReaction(emoji, e)}
              className="px-3 py-1.5 rounded-full bg-[#231c30] hover:bg-[#393146] border border-white/5 active:scale-90 transition-all flex items-center gap-1.5 text-sm shadow-sm group"
            >
              <span className="group-hover:scale-125 transition-transform">{emoji}</span>
              <span className="text-xs font-bold text-[#ffb1c7] tabular-nums">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive FX Playground Deck */}
      <div className="w-full grid grid-cols-3 gap-2 my-2">
        <button
          onClick={handleManualConfetti}
          className="py-2.5 px-2 rounded-xl bg-[#2e263b] hover:bg-[#393146] border border-white/5 text-[#ffb1c7] text-xs font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[20px] text-[#e6007a]">celebration</span>
          <span>Confetti Rain</span>
        </button>

        <button
          onClick={handleManualStars}
          className="py-2.5 px-2 rounded-xl bg-[#2e263b] hover:bg-[#393146] border border-white/5 text-[#ffdea8] text-xs font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[20px] text-[#feb700]">hotel_class</span>
          <span>Star Shower</span>
        </button>

        <button
          onClick={handleManualFireworks}
          className="py-2.5 px-2 rounded-xl bg-[#2e263b] hover:bg-[#393146] border border-white/5 text-[#dcb8ff] text-xs font-semibold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[20px] text-[#9e45f7]">flare</span>
          <span>Fireworks Sky</span>
        </button>
      </div>

      {/* Stage Actions */}
      <div className="w-full flex flex-col gap-2.5 mt-3">
        <button
          onClick={onOpenShareModal}
          className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#e6007a] via-[#ba0061] to-[#feb700] text-white font-bold text-sm shadow-[0_0_20px_rgba(230,0,122,0.45)] hover:shadow-[0_0_28px_rgba(230,0,122,0.6)] active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
          <span>Share This Celebration with {wish.name} 🎁</span>
        </button>

        <button
          onClick={onBackToEditor}
          className="w-full py-2.5 px-4 rounded-full bg-[#2e263b] hover:bg-[#393146] border border-white/5 text-[#eaddf9] text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>Edit &amp; Customize Wish in Studio</span>
        </button>
      </div>
    </div>
  );
};

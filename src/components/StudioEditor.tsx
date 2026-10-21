import React, { useState } from 'react';
import { BirthdayWish, CelebrationTheme, SoundtrackId } from '../types/wish';
import {
  MILESTONE_TAGS,
  QUICK_TAGS,
  WISH_PRESETS,
  EXTRA_SHUFFLE_MESSAGES,
} from '../utils/presets';
import { audio } from '../utils/audio';

interface StudioEditorProps {
  wish: BirthdayWish;
  onChangeWish: (updated: BirthdayWish) => void;
  onOpenCelebration: (wishToOpen?: BirthdayWish) => void;
  onOpenPhotoPicker: () => void;
  onOpenShareModal: () => void;
  recentWishes: BirthdayWish[];
  onSelectRecentWish: (w: BirthdayWish) => void;
  isMusicPlaying: boolean;
  onToggleMusicPreview: () => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  wish,
  onChangeWish,
  onOpenCelebration,
  onOpenPhotoPicker,
  onOpenShareModal,
  recentWishes,
  onSelectRecentWish,
  isMusicPlaying,
  onToggleMusicPreview,
}) => {
  const [activePreset, setActivePreset] = useState<string>('Heartfelt');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [shuffleIndex, setShuffleIndex] = useState(0);

  // Name handler
  const handleNameChange = (name: string) => {
    onChangeWish({ ...wish, name });
  };

  const handleClearName = () => {
    audio.playClick();
    onChangeWish({ ...wish, name: '' });
  };

  // Quick tag chip handler
  const handleQuickTag = (tag: string) => {
    audio.playClick();
    const cleanTag = tag.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    const baseName = wish.name.replace(/\s*\([^)]*\)/g, '').trim() || 'Utkarsh';
    onChangeWish({ ...wish, name: `${baseName} (${cleanTag})` });
  };

  // Age stepper
  const handleAgeChange = (val: number | null) => {
    audio.playClick();
    onChangeWish({ ...wish, age: val });
  };

  const incrementAge = () => {
    const cur = wish.age || 20;
    handleAgeChange(cur + 1);
  };

  const decrementAge = () => {
    const cur = wish.age || 20;
    if (cur > 1) {
      handleAgeChange(cur - 1);
    }
  };

  // Message presets
  const handlePresetSelect = (presetKey: 'Heartfelt' | 'Fun' | 'Inspirational' | 'Poetic') => {
    audio.playClick();
    setActivePreset(presetKey);
    const cleanName = wish.name.trim() || 'Birthday Star';
    const newMsg = WISH_PRESETS[presetKey](cleanName);
    onChangeWish({ ...wish, message: newMsg });
  };

  // Shuffle wish
  const handleShuffleWish = () => {
    audio.playClick();
    const cleanName = wish.name.trim() || 'Birthday Star';
    const nextIdx = (shuffleIndex + 1) % EXTRA_SHUFFLE_MESSAGES.length;
    setShuffleIndex(nextIdx);
    const newMsg = EXTRA_SHUFFLE_MESSAGES[nextIdx](cleanName);
    setActivePreset('Custom');
    onChangeWish({ ...wish, message: newMsg });
  };

  // FX Theme selection
  const handleSelectFx = (theme: CelebrationTheme) => {
    audio.playClick();
    onChangeWish({ ...wish, themeFx: theme });
  };

  // Soundtrack selection
  const handleSelectSoundtrack = (st: SoundtrackId) => {
    audio.playClick();
    onChangeWish({ ...wish, soundtrack: st });
  };

  // Copy link
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(
      wish.name
    )}&age=${wish.age || ''}&msg=${encodeURIComponent(wish.message)}&fx=${encodeURIComponent(
      wish.themeFx
    )}&sound=${wish.soundtrack}&photo=${encodeURIComponent(wish.photoUrl)}`;

    navigator.clipboard.writeText(shareUrl);
    audio.playPopper();
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2200);
  };

  return (
    <div className="flex flex-col w-full relative overflow-hidden px-4 sm:px-6 pb-28 max-w-xl mx-auto">
      {/* Hero Banner */}
      <section className="relative pt-6 pb-3 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-[#2e263b]/80 border border-white/10 backdrop-blur-md shadow-sm mb-3">
          <span
            className="material-symbols-outlined text-[#ffdea8] text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            auto_awesome
          </span>
          <span className="text-xs text-[#ffdea8] tracking-wider uppercase font-bold">
            Custom Celebration Studio
          </span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#eaddf9] tracking-tight max-w-sm">
          Create a Magical <br />
          <span className="bg-gradient-to-r from-[#ffb1c7] via-[#ffdb9d] to-[#dcb8ff] bg-clip-text text-transparent">
            Birthday Wish
          </span>{' '}
          🎉
        </h1>

        <p className="text-sm text-[#e3bdc6] mt-2 max-w-xs leading-relaxed">
          Personalize the celebration experience for your loved one with their name, special message, and music.
        </p>
      </section>

      {/* Photo Upload & Party Hat Preview Spot */}
      <section className="flex flex-col items-center justify-center my-4 relative z-10">
        <div
          onClick={onOpenPhotoPicker}
          className="relative group cursor-pointer"
          title="Click to change recipient photo"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#e6007a] via-[#9e45f7] to-[#feb700] p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-[#1f182c] overflow-hidden relative flex items-center justify-center">
              <img
                src={wish.photoUrl}
                alt="Recipient Avatar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-[#120b1d]/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-white text-[22px]">photo_camera</span>
                <span className="text-[10px] text-white font-bold">Change</span>
              </div>
            </div>
          </div>

          {/* Festive Party Hat Sticker Overlay */}
          <div className="absolute -top-3 -right-2 transform rotate-12 drop-shadow-lg">
            <div className="w-9 h-9 rounded-full bg-[#feb700] flex items-center justify-center text-[#412d00] shadow-md animate-bounce">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                celebration
              </span>
            </div>
          </div>

          {/* Sparkle Badge */}
          <div className="absolute -bottom-1 -left-1">
            <div className="w-7 h-7 rounded-full bg-[#9e45f7] flex items-center justify-center text-white shadow-md">
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenPhotoPicker}
          type="button"
          className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2e263b] hover:bg-[#393146] border border-white/5 text-[#ffb1c7] text-xs font-semibold transition-all active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
          <span>Add Recipient Photo 📸</span>
        </button>
      </section>

      {/* Main Personalization Form Card */}
      <div className="w-full bg-[#1f182c]/90 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-6 relative z-10">
        {/* Field: Birthday Person's Name */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm text-[#eaddf9] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffb1c7] text-[18px]">badge</span>
              Birthday Person's Name
            </label>
            <span className="text-[10px] text-[#ffdea8] uppercase tracking-wider font-bold">
              Required
            </span>
          </div>

          <div className="relative w-full">
            <input
              type="text"
              value={wish.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Harsh, Utkarsh, Maya..."
              className="w-full bg-[#120b1d] text-[#eaddf9] font-semibold text-base rounded-xl px-4 py-3 placeholder:text-[#aa8890] border border-white/5 focus:outline-none focus:border-[#e6007a] focus:ring-1 focus:ring-[#e6007a] shadow-inner transition-colors"
            />
            {wish.name && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearName}
                  aria-label="Clear name"
                  className="w-7 h-7 rounded-full bg-[#393146] text-[#e3bdc6] flex items-center justify-center hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
            <span className="text-[11px] text-[#aa8890] flex-shrink-0">Quick Tag:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleQuickTag(tag)}
                className="px-2.5 py-1 rounded-full bg-[#2e263b] hover:bg-[#e6007a] hover:text-white text-[#eaddf9] text-xs font-medium transition-all active:scale-95 flex-shrink-0 border border-white/5"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Field: Turning Age & Milestone Badges */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm text-[#eaddf9] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#feb700] text-[18px]">cake</span>
              Turning Age <span className="text-[#aa8890] text-xs font-normal">(Optional)</span>
            </label>
            <span className="text-xs text-[#feb700] font-bold">
              {wish.age && MILESTONE_TAGS[wish.age] ? MILESTONE_TAGS[wish.age] : 'Milestone Ready'}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-2.5 items-center">
            {/* Number Input Box with Quick Stepper */}
            <div className="col-span-5 flex items-center bg-[#120b1d] rounded-xl p-1 border border-white/5">
              <button
                type="button"
                onClick={decrementAge}
                aria-label="Decrease age"
                className="w-9 h-9 rounded-lg bg-[#2e263b] text-[#eaddf9] hover:bg-[#393146] flex items-center justify-center active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <input
                type="number"
                min="1"
                max="120"
                value={wish.age !== null ? wish.age : ''}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  handleAgeChange(isNaN(v) ? null : v);
                }}
                className="w-full bg-transparent text-center font-display font-bold text-xl text-[#ffb1c7] focus:outline-none"
              />
              <button
                type="button"
                onClick={incrementAge}
                aria-label="Increase age"
                className="w-9 h-9 rounded-lg bg-[#2e263b] text-[#eaddf9] hover:bg-[#393146] flex items-center justify-center active:scale-90 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            {/* Milestone Badges Grid */}
            <div className="col-span-7 flex flex-wrap gap-1.5">
              {[
                { age: 16, label: 'Sweet 16' },
                { age: 21, label: 'Fab 21' },
                { age: 25, label: 'Quarter 25' },
                { age: 30, label: 'Dirty 30' },
                { age: 50, label: 'Golden 50' },
              ].map((m) => {
                const isActive = wish.age === m.age;
                return (
                  <button
                    key={m.age}
                    type="button"
                    onClick={() => handleAgeChange(m.age)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all active:scale-95 ${
                      isActive
                        ? 'bg-[#e6007a] text-white shadow-md'
                        : 'bg-[#2e263b] hover:bg-[#feb700] hover:text-[#412d00] text-[#e3bdc6]'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Field: Special Birthday Message / Wish */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-sm text-[#eaddf9] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#dcb8ff] text-[18px]">favorite</span>
              Special Birthday Message
            </label>
            <span className="text-xs text-[#e3bdc6]">
              {wish.message.length} chars
            </span>
          </div>

          {/* Quick Wish Preset Selectors */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {(['Heartfelt', 'Fun', 'Inspirational', 'Poetic'] as const).map((preset) => {
              const icons = {
                Heartfelt: 'favorite',
                Fun: 'sentiment_very_satisfied',
                Inspirational: 'rocket_launch',
                Poetic: 'menu_book',
              };
              const label = preset === 'Fun' ? 'Fun & Silly' : preset;
              const isSelected = activePreset === preset;

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#e6007a] text-white shadow-sm'
                      : 'bg-[#2e263b] text-[#e3bdc6] hover:text-white border border-white/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{icons[preset]}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={wish.message}
              onChange={(e) => {
                setActivePreset('Custom');
                onChangeWish({ ...wish, message: e.target.value });
              }}
              placeholder="Write a sweet, funny, or inspiring birthday wish..."
              className="w-full bg-[#120b1d] text-[#eaddf9] text-sm rounded-xl p-3.5 placeholder:text-[#aa8890] border border-white/5 focus:outline-none focus:border-[#e6007a] focus:ring-1 focus:ring-[#e6007a] shadow-inner leading-relaxed resize-none"
            />
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleShuffleWish}
                title="Shuffle celebration wish idea"
                className="w-8 h-8 rounded-full bg-[#393146] text-[#feb700] hover:text-white flex items-center justify-center transition-transform active:rotate-180 shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">casino</span>
              </button>
            </div>
          </div>
        </div>

        {/* Celebration Theme & Visual Effects */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[#eaddf9] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffba20] text-[18px]">flare</span>
              Celebration Theme &amp; FX
            </span>
            <span className="text-xs text-[#ffb1c7] font-semibold">
              {wish.themeFx}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              {
                id: 'Confetti Explosion' as CelebrationTheme,
                title: 'Confetti Blast',
                sub: 'Multi-color rain 🎊',
                icon: 'celebration',
                accent: 'bg-[#e6007a] text-white',
              },
              {
                id: 'Balloon Parade' as CelebrationTheme,
                title: 'Balloons',
                sub: 'Float upward 🎈',
                icon: 'bubble_chart',
                accent: 'bg-[#feb700] text-[#412d00]',
              },
              {
                id: 'Fireworks Blast' as CelebrationTheme,
                title: 'Fireworks',
                sub: 'Sky bursts 🎆',
                icon: 'flare',
                accent: 'bg-[#9e45f7] text-white',
              },
              {
                id: 'Starry Magic' as CelebrationTheme,
                title: 'Starry Magic',
                sub: 'Golden glows ✨',
                icon: 'hotel_class',
                accent: 'bg-[#feb700] text-[#412d00]',
              },
            ].map((fx) => {
              const isSelected = wish.themeFx === fx.id;
              return (
                <button
                  key={fx.id}
                  type="button"
                  onClick={() => handleSelectFx(fx.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#393146] border-[#e6007a] text-white shadow-md'
                      : 'bg-[#231c30] border-transparent hover:bg-[#2e263b] text-[#e3bdc6]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected ? fx.accent : 'bg-[#2e263b] text-[#feb700]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{fx.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-xs text-[#eaddf9] truncate">
                      {fx.title}
                    </span>
                    <span className="text-[11px] text-[#ffb1c7] truncate">{fx.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Celebration Soundtrack Picker */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-[#eaddf9] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffb1c7] text-[18px]">
                music_note
              </span>
              Celebration Soundtrack
            </span>
            <button
              type="button"
              onClick={onToggleMusicPreview}
              className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                isMusicPlaying ? 'text-[#ffb1c7]' : 'text-[#feb700] hover:text-[#ffdea8]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isMusicPlaying ? 'pause_circle' : 'play_circle'}
              </span>
              <span>{isMusicPlaying ? 'Playing Melody...' : 'Preview Music'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {[
              {
                id: 'acoustic' as SoundtrackId,
                title: 'Festive Acoustic Birthday',
                sub: 'Warm ukulele & cheerful clapping',
                icon: 'graphic_eq',
              },
              {
                id: 'pop' as SoundtrackId,
                title: 'Upbeat Pop Celebration',
                sub: 'High-energy dance synth & horn drop',
                icon: 'celebration',
              },
              {
                id: 'lofi' as SoundtrackId,
                title: 'Lofi Birthday Chimes',
                sub: 'Relaxed cozy hip-hop birthday beat',
                icon: 'bedtime',
              },
            ].map((track) => {
              const isSelected = wish.soundtrack === track.id;
              return (
                <label
                  key={track.id}
                  onClick={() => handleSelectSoundtrack(track.id)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#393146] border-[#ffb1c7]/40 shadow-sm'
                      : 'bg-[#231c30] border-transparent hover:bg-[#2e263b]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-[#e6007a] text-white' : 'bg-[#2e263b] text-[#dcb8ff]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">{track.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-xs text-[#eaddf9] truncate">
                        {track.title}
                      </span>
                      <span className="text-[11px] text-[#aa8890] truncate">{track.sub}</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="soundtrack"
                    checked={isSelected}
                    onChange={() => handleSelectSoundtrack(track.id)}
                    className="w-4 h-4 accent-[#e6007a] ml-2 cursor-pointer"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Action Deck */}
      <section className="flex flex-col gap-2.5 mt-6 relative z-10">
        <button
          type="button"
          onClick={() => onOpenCelebration()}
          className="w-full min-h-[52px] py-3.5 px-6 rounded-full bg-gradient-to-r from-[#e6007a] via-[#ba0061] to-[#feb700] text-white font-bold text-sm shadow-[0_0_24px_rgba(230,0,122,0.45)] hover:shadow-[0_0_32px_rgba(230,0,122,0.6)] active:scale-98 transition-all flex items-center justify-center gap-2 group"
        >
          <span className="material-symbols-outlined text-[22px] group-hover:rotate-12 transition-transform">
            rocket_launch
          </span>
          <span>Generate &amp; Open Celebration Wish 🚀</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="min-h-[44px] py-2.5 px-4 rounded-full bg-[#2e263b] hover:bg-[#3e354b] border border-white/5 text-[#eaddf9] text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ffb1c7]">
              {copyFeedback ? 'check' : 'link'}
            </span>
            <span>{copyFeedback ? 'Link Copied! 🎉' : 'Copy Shareable Link 🔗'}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCelebration()}
            className="min-h-[44px] py-2.5 px-4 rounded-full bg-[#2e263b] hover:bg-[#3e354b] border border-white/5 text-[#ffdea8] text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Live Card Preview</span>
          </button>
        </div>
      </section>

      {/* Live Card Micro Preview Card */}
      <section className="mt-6 bg-[#120b1d]/85 border border-white/10 backdrop-blur-md rounded-2xl p-4 shadow-lg relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#feb700] text-[18px]">star_rate</span>
            <h2 className="font-semibold text-sm text-[#eaddf9]">Live Wish Preview Card</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#feb700]/20 text-[#ffdea8] text-[10px] font-bold">
            Active Draft
          </span>
        </div>

        {/* Preview Container */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#231c30] to-[#2e263b] border border-white/5 shadow-inner flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffb1c7]/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-[#393146] shadow-sm">
              <img
                src={wish.photoUrl}
                alt={wish.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-[#ffb1c7] tracking-tight truncate">
                  {wish.name.trim() || 'Birthday Star'}
                </span>
                {wish.age && (
                  <span className="px-2 py-0.5 rounded-full bg-[#feb700] text-[#412d00] text-[11px] font-extrabold">
                    Turning {wish.age}
                  </span>
                )}
              </div>
              <span className="text-xs text-[#e3bdc6] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#dcb8ff]">
                  music_note
                </span>
                <span className="truncate">
                  {wish.soundtrack === 'acoustic'
                    ? 'Festive Acoustic Birthday'
                    : wish.soundtrack === 'pop'
                    ? 'Upbeat Pop Celebration'
                    : 'Lofi Birthday Chimes'}
                </span>
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#eaddf9] italic bg-[#120b1d]/70 rounded-xl p-3 border border-white/5 leading-relaxed">
            "{wish.message}"
          </p>

          <div className="flex items-center justify-between text-[#aa8890] text-xs pt-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#feb700]">flare</span>
              <span>
                FX: <strong className="text-[#eaddf9] font-medium">{wish.themeFx}</strong>
              </span>
            </span>
            <button
              onClick={() => onOpenCelebration()}
              className="text-[#ffb1c7] hover:underline flex items-center gap-1"
            >
              Tap to blow candles 🕯️
            </button>
          </div>
        </div>
      </section>

      {/* Recent Saved Birthday Wishes History */}
      <section className="mt-6 flex flex-col gap-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-[#eaddf9] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#ffdea8] text-[18px]">
              history_edu
            </span>
            Recent Created Wishes
          </h2>
          <span className="text-xs text-[#ffb1c7] font-semibold">
            {recentWishes.length} wishes
          </span>
        </div>

        {recentWishes.map((recent) => (
          <div
            key={recent.id}
            className="bg-[#1f182c] border border-white/5 rounded-2xl p-3 shadow-md flex items-center justify-between gap-3 hover:bg-[#231c30] transition-colors"
          >
            <div
              onClick={() => onSelectRecentWish(recent)}
              className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-[#2e263b] shadow-sm">
                <img
                  src={recent.photoUrl}
                  alt={recent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-[#eaddf9] truncate">
                    {recent.name}
                  </span>
                  {recent.age && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#9e45f7]/30 text-[#dcb8ff] text-[10px] font-bold">
                      Age {recent.age}
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#e3bdc6]/80 truncate">
                  "{recent.message}"
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => onSelectRecentWish(recent)}
                title={`Edit wish for ${recent.name}`}
                className="w-8 h-8 rounded-full bg-[#2e263b] text-[#eaddf9] hover:bg-[#ffb1c7] hover:text-[#650032] flex items-center justify-center transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectRecentWish(recent);
                  onOpenCelebration(recent);
                }}
                title={`Open celebration for ${recent.name}`}
                className="w-8 h-8 rounded-full bg-[#2e263b] text-[#feb700] hover:bg-[#feb700] hover:text-[#412d00] flex items-center justify-center transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

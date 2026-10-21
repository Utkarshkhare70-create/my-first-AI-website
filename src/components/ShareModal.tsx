import React, { useState } from 'react';
import { BirthdayWish } from '../types/wish';
import { audio } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  wish: BirthdayWish;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, wish }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate shareable link
  const shareUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(
    wish.name
  )}&age=${wish.age || ''}&msg=${encodeURIComponent(wish.message)}&fx=${encodeURIComponent(
    wish.themeFx
  )}&sound=${wish.soundtrack}&photo=${encodeURIComponent(wish.photoUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    audio.playPopper();
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = `🎂 You're invited to celebrate ${wish.name}'s Birthday! Open the interactive hutk celebration: ${shareUrl}`;

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Birthday ${wish.name}! 🎉`,
          text: `Check out this magical personalized birthday wish for ${wish.name}!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1f182c] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#feb700]">celebration</span>
            <h3 className="font-bold text-lg text-[#eaddf9]">Share Celebration Wish</h3>
          </div>
          <button
            onClick={() => {
              audio.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[#393146] text-[#e3bdc6] flex items-center justify-center hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Recipient preview snippet */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#120b1d] border border-white/5">
          <img
            src={wish.photoUrl}
            alt={wish.name}
            className="w-12 h-12 rounded-full object-cover shadow-sm flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-sm text-[#ffb1c7] truncate">{wish.name}</h4>
            <p className="text-xs text-[#e3bdc6]/80 truncate">{wish.message}</p>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#aa8890] font-medium">Direct Celebration Link</label>
          <div className="flex items-center gap-2 bg-[#120b1d] p-1.5 rounded-xl border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-transparent flex-1 px-2 text-xs text-[#eaddf9] focus:outline-none select-all truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                copied
                  ? 'bg-[#feb700] text-[#412d00]'
                  : 'bg-[#e6007a] text-white hover:bg-[#ba0061]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleWhatsApp}
            className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleNativeShare}
            className="py-2.5 px-3 rounded-xl bg-[#2e263b] hover:bg-[#393146] border border-white/10 text-[#eaddf9] font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span>Share Everywhere</span>
          </button>
        </div>
      </div>
    </div>
  );
};

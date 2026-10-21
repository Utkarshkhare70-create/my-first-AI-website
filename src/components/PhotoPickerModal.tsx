import React, { useRef, useState } from 'react';
import { AVATAR_PRESETS } from '../utils/presets';
import { audio } from '../utils/audio';

interface PhotoPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPhoto: (url: string) => void;
  currentPhoto: string;
}

export const PhotoPickerModal: React.FC<PhotoPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectPhoto,
  currentPhoto,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [customUrl, setCustomUrl] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          audio.playClick();
          onSelectPhoto(reader.result);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      audio.playClick();
      onSelectPhoto(customUrl.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#1f182c] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb1c7]">add_a_photo</span>
            <h3 className="font-bold text-lg text-[#eaddf9]">Choose Recipient Photo</h3>
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

        {/* Upload from Device */}
        <div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 px-4 rounded-xl border border-dashed border-[#e6007a]/60 bg-[#e6007a]/10 hover:bg-[#e6007a]/20 text-[#ffb1c7] font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            <span>Upload Photo from Device</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Presets Grid */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wider text-[#aa8890] font-semibold">
            Or Choose from Festive Presets:
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {AVATAR_PRESETS.map((p) => {
              const isSelected = currentPhoto === p.url;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    audio.playClick();
                    onSelectPhoto(p.url);
                    onClose();
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-xl transition-all text-left ${
                    isSelected
                      ? 'bg-[#e6007a]/25 border border-[#e6007a]'
                      : 'bg-[#2e263b] hover:bg-[#393146] border border-transparent'
                  }`}
                >
                  <img
                    src={p.url}
                    alt={p.name}
                    className="w-11 h-11 rounded-full object-cover shadow-sm flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[#eaddf9] block truncate">
                      {p.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] text-[#feb700] font-bold">Selected</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Image URL */}
        <form onSubmit={handleCustomUrlSubmit} className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
          <label className="text-xs text-[#aa8890]">Paste direct image web link:</label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-[#120b1d] rounded-lg px-3 py-2 text-xs text-[#eaddf9] placeholder:text-[#aa8890] focus:outline-none focus:ring-1 focus:ring-[#e6007a]"
            />
            <button
              type="submit"
              disabled={!customUrl.trim()}
              className="px-3 py-2 rounded-lg bg-[#e6007a] text-white text-xs font-bold disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

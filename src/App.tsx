import { useEffect, useState } from 'react';
import { BirthdayWish, CelebrationTheme, SoundtrackId } from './types/wish';
import { DEFAULT_WISH, RECENT_WISHES } from './utils/presets';
import { audio } from './utils/audio';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { StudioEditor } from './components/StudioEditor';
import { CelebrationStage } from './components/CelebrationStage';
import { PhotoPickerModal } from './components/PhotoPickerModal';
import { ShareModal } from './components/ShareModal';
import { FxBackground } from './components/FxBackground';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'customize' | 'celebration'>('customize');
  const [wish, setWish] = useState<BirthdayWish>(DEFAULT_WISH);
  const [recentWishes, setRecentWishes] = useState<BirthdayWish[]>(RECENT_WISHES);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Parse URL query parameters on load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const name = params.get('name');
      const ageStr = params.get('age');
      const msg = params.get('msg');
      const fx = params.get('fx');
      const sound = params.get('sound');
      const photo = params.get('photo');
      const tabParam = params.get('tab');

      if (name) {
        const parsedAge = ageStr ? parseInt(ageStr, 10) : null;
        const loadedWish: BirthdayWish = {
          id: `custom-${Date.now()}`,
          name,
          age: isNaN(parsedAge as number) ? null : parsedAge,
          message: msg || `Happy Birthday ${name}! 🎂 Have a magnificent year ahead! ✨`,
          photoUrl: photo || DEFAULT_WISH.photoUrl,
          themeFx: (fx as CelebrationTheme) || 'Confetti Explosion',
          soundtrack: (sound as SoundtrackId) || 'acoustic',
          createdAt: 'Shared wish',
        };
        setWish(loadedWish);

        // If a shared link was opened, start right on the celebration experience!
        if (tabParam === 'celebration' || name !== DEFAULT_WISH.name) {
          setCurrentTab('celebration');
        }
      }

      // Check localStorage for saved wishes
      const saved = localStorage.getItem('hutk_recent_wishes') || localStorage.getItem('wishcraft_recent_wishes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentWishes(parsed);
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Update soundtrack when wish soundtrack changes
  useEffect(() => {
    if (isMusicPlaying) {
      audio.playSoundtrack(wish.soundtrack);
    }
  }, [wish.soundtrack]);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audio.setMuted(next);
    if (next) {
      setIsMusicPlaying(false);
    }
  };

  const handleToggleMusic = () => {
    if (isMuted) {
      handleToggleMute();
    }
    const playing = audio.togglePlay(wish.soundtrack);
    setIsMusicPlaying(playing);
  };

  const handleSaveAndOpenCelebration = (customWish?: BirthdayWish) => {
    const targetWish = customWish || wish;
    if (customWish) {
      setWish(customWish);
    }

    // Save to recents if not already there
    setRecentWishes((prev) => {
      const filtered = prev.filter((w) => w.id !== targetWish.id && w.name !== targetWish.name);
      const updated = [
        {
          ...targetWish,
          createdAt: 'Just now',
        },
        ...filtered,
      ].slice(0, 8);
      try {
        localStorage.setItem('hutk_recent_wishes', JSON.stringify(updated));
      } catch {
        // Storage quota
      }
      return updated;
    });

    setCurrentTab('celebration');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Auto-play music if not playing
    if (!isMuted && !isMusicPlaying) {
      audio.playSoundtrack(targetWish.soundtrack);
      setIsMusicPlaying(true);
    }
  };

  const handleSelectRecentWish = (selected: BirthdayWish) => {
    audio.playClick();
    setWish(selected);
  };

  const handleSelectPhoto = (photoUrl: string) => {
    setWish((prev) => ({ ...prev, photoUrl }));
  };

  return (
    <div className="min-h-screen bg-[#171023] text-[#eaddf9] flex flex-col relative selection:bg-[#e6007a] selection:text-white">
      {/* Dynamic Visual FX Background */}
      <FxBackground theme={wish.themeFx} />

      {/* Header */}
      <Navbar
        currentTab={currentTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenProfile={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full pt-16 flex flex-col relative z-10">
        {currentTab === 'customize' ? (
          <StudioEditor
            wish={wish}
            onChangeWish={setWish}
            onOpenCelebration={handleSaveAndOpenCelebration}
            onOpenPhotoPicker={() => setIsPhotoPickerOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            recentWishes={recentWishes}
            onSelectRecentWish={handleSelectRecentWish}
            isMusicPlaying={isMusicPlaying}
            onToggleMusicPreview={handleToggleMusic}
          />
        ) : (
          <CelebrationStage
            wish={wish}
            onBackToEditor={() => {
              audio.playClick();
              setCurrentTab('customize');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            isMusicPlaying={isMusicPlaying}
            onToggleMusic={handleToggleMusic}
          />
        )}
      </main>

      {/* Bottom Tab Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <PhotoPickerModal
        isOpen={isPhotoPickerOpen}
        onClose={() => setIsPhotoPickerOpen(false)}
        onSelectPhoto={handleSelectPhoto}
        currentPhoto={wish.photoUrl}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        wish={wish}
      />
    </div>
  );
}

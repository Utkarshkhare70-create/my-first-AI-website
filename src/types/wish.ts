export type CelebrationTheme = 'Confetti Explosion' | 'Balloon Parade' | 'Fireworks Blast' | 'Starry Magic';

export type SoundtrackId = 'acoustic' | 'pop' | 'lofi';

export interface BirthdayWish {
  id: string;
  name: string;
  age: number | null;
  message: string;
  photoUrl: string;
  themeFx: CelebrationTheme;
  soundtrack: SoundtrackId;
  quickTag?: string;
  createdAt: string;
  reactions?: Record<string, number>;
}

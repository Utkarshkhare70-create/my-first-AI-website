import { BirthdayWish } from '../types/wish';

export const APP_LOGO = 'https://lh3.googleusercontent.com/aida/AEtjO1Vx51Sb_Y1XyUjTQprui6Mv8VfNOGBhwmtXYOwYpGyh95AVCXquPQK7_7kv1KHxGidyckTStFnkbv5jrlZLoxDB49OW5ZLOGqtKwBUoqys9NGYGXLPYHu1xCGEJvMKoQZeiJmmtyodkshQ9Fubn_Sg4VRq19v7IsuBeWlyOJQSVOIJ0OIPBKp2S5UzylkLoGzqBR6PLuz5FFlOq2esoG8KqaG27xd7AS7jPbLLlXyIU_VO8yTY4ioXmevs';

export const AVATAR_PRESETS = [
  {
    id: 'utkarsh',
    name: 'Utkarsh (Studio Glow)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPkZuW8kTaHlR0p56iNulnyvFofl76sikApGrdvm_I0_G7gVOeJqxrGY7T2rNFKHLstA9HqtZrD4a6quRPXj3NNwnp6f8cKUJ4TlLsW8ZRVw8yCY3u4hnhOkr7T2kb-9UChj4Hm1jVcL6zb2cvTCB5lbcp6Dq891iRxFO2zLmytghXbL7yI1HaABWUC9BwW95GvHcysT5jLT_kmm3ki7RMJm3GVPyZ6sbCfnYBTOei4hag8bX5VVf1',
  },
  {
    id: 'party_selfie',
    name: 'Party Hat Selfie',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7A5r3X7HZp-vSvz5ZWUpwfYMEMTL6tKHsJpvCb2khxUKps4kSVGPt9J42xUh6btzLBJE7c_Cf-hH3wVSLA4Eb-rAxAdsjUgZ0ZH3zY-tmkP1urRjg2bs6ZeytwLX7lJOtRoANDayirD_UFykPBiW5UAoyNJlMzInx1y3N4cg70lmVrB8AcrCep8QTW9MQCUw1dQhIaNWRgJQJivvTwcb8ti6enqZemEUWSNStfrV3x2wW2RIh0HVZ',
  },
  {
    id: 'maya',
    name: 'Maya (Sparkles)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7avQSxhv6fSJM0LcFv2nTXNh79KsazZgEowwQ-S4kfa9B5zaH-YEMwL5M1DUhOPjES26qxLD0de4Vbu0qKGhqjITs3PqWlsHvR8EDrTRq0d17h83FMggD3TnkndQbqU_SX_a-mdv33YiPl5STmtV2910adkfXsJVfvAsi02A_YmdMn8uPxUVHczHu3q7AVt3s7Xx5_7FiZDMoan6SOtx3qJEtmyNc9kuE_dCXGI35ebT6c5cSn9km',
  },
  {
    id: 'aarav',
    name: 'Aarav (Kiddo Cupcake)',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJq6opw5wM40-DGc1XpOvaat_J-jiwj4lBCtavvadg6TvJCXcBp0Ie8JCFyP1WxSp9nDdqRNLhhQA_uuVkCc01ULorOmmxSQ14F70MI5LHGj0h3VqBHLfq2opk3nGk-jH_dH3roTqgK7yVdHTwQRMzQWMgrwYENwcYYKH_i5yucgcTcZBTd4jHqqP1HMuaQDt1_UreooQVFPfbE3zru331XPJ3RXGsQq1GwXRnGjENKMULLjPBP9Zo',
  },
];

export const DEFAULT_WISH: BirthdayWish = {
  id: 'utkarsh-24',
  name: 'Utkarsh',
  age: 24,
  message: 'Happy Birthday Utkarsh! 🎂 May your year ahead be packed with endless laughter, boundless adventures, and dreams turning into reality! Keep shining bright ✨',
  photoUrl: AVATAR_PRESETS[0].url,
  themeFx: 'Confetti Explosion',
  soundtrack: 'acoustic',
  createdAt: 'Just now',
  reactions: { '❤️': 12, '🎉': 28, '🔥': 9, '🥂': 15 },
};

export const RECENT_WISHES: BirthdayWish[] = [
  {
    id: 'maya-21',
    name: 'Maya Sharma',
    age: 21,
    message: 'Happy 21st Birthday Maya! 🥂 Keep glowing and chasing stars, you illuminate every room you walk into!',
    photoUrl: AVATAR_PRESETS[2].url,
    themeFx: 'Starry Magic',
    soundtrack: 'pop',
    createdAt: '2 hours ago',
    reactions: { '❤️': 34, '🎉': 42, '🥂': 29 },
  },
  {
    id: 'aarav-7',
    name: 'Aarav (Kiddo)',
    age: 7,
    message: 'Super hero birthday with cake & balloons! Wishing the coolest 7-year-old an action-packed birthday party! 🚀',
    photoUrl: AVATAR_PRESETS[3].url,
    themeFx: 'Balloon Parade',
    soundtrack: 'pop',
    createdAt: 'Yesterday',
    reactions: { '🎉': 51, '🎈': 37, '⚡': 18 },
  },
];

export const WISH_PRESETS = {
  Heartfelt: (name: string) =>
    `Happy Birthday ${name}! 🎂 May your year ahead be packed with endless laughter, boundless adventures, and dreams turning into reality! Keep shining bright ✨`,
  Fun: (name: string) =>
    `Happy Birthday ${name}! 🍕 Age is merely the number of years the world has been privileged to enjoy your questionable jokes. Let's eat way too much cake! 🎈`,
  Inspirational: (name: string) =>
    `To ${name}: A true trailblazer! May this new milestone unfold your grandest chapters yet. Dream without bounds, achieve with grace! 🚀🌟`,
  Poetic: (name: string) =>
    `Like vintage champagne and twilight skies, may your birthday shimmer with boundless warmth, deep harmony, and pure unforgettable grace 🥂🌙`,
};

export const EXTRA_SHUFFLE_MESSAGES = [
  (name: string) => `Cheers to another lap around the sun, ${name}! ☀️ Here’s to epic road trips, belly laughs, and zero regrets! 🥂🎉`,
  (name: string) => `Another year wiser, bolder, and even more fabulous! Happy Birthday ${name}! Let the celebrations begin! 🥳✨`,
  (name: string) => `Wishing the sweetest, wildest, happiest birthday to ${name}! May your day be as spectacular as your smile! 🍰💖`,
  (name: string) => `Level unlocked! 🎮 Happy Birthday ${name}! May all your quests in life reward you with epic memories and pure joy! 🏆🎈`,
  (name: string) => `To the legend ${name}: You don't get older, you just level up into rare vintage perfection! Happy Birthday! 🕶️🔥`,
];

export const MILESTONE_TAGS: Record<number, string> = {
  16: 'Sweet 16',
  18: 'Official 18',
  21: 'Fab 21',
  25: 'Quarter 25',
  30: 'Dirty 30',
  40: 'Fabulous 40',
  50: 'Golden 50',
  60: 'Diamond 60',
};

export const QUICK_TAGS = ['Best Friend 💛', 'Brother 🤜🤛', 'Sister ✨', 'Love ❤️', 'Colleague ☕', 'Partner in Crime 🕵️'];

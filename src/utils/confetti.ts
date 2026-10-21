import confetti from 'canvas-confetti';

export const triggerConfettiBurst = (originX: number = 0.5, originY: number = 0.5) => {
  // Vibrant celebration palette: Radiant Magenta, Festive Gold, Electric Purple, Coral, White
  const colors = ['#e6007a', '#feb700', '#9e45f7', '#ff6b5b', '#ffb1c7', '#ffffff', '#22d3ee'];

  // Multi-stage burst
  confetti({
    particleCount: 70,
    spread: 60,
    origin: { x: originX, y: originY },
    colors,
    ticks: 200,
    gravity: 0.8,
    scalar: 1.1,
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
    });
  }, 180);
};

export const triggerStarShower = () => {
  const count = 40;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#feb700', '#ffdea8', '#ffffff', '#ffd700'],
    shapes: ['star'] as confetti.Shape[],
    scalar: 1.2,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.4,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const triggerCandleBlownCelebration = () => {
  // Grand explosion of celebratory elements when candles are blown!
  triggerConfettiBurst(0.5, 0.45);
  setTimeout(() => {
    triggerStarShower();
  }, 350);
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 120,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#ffb1c7', '#e6007a', '#feb700', '#9e45f7'],
    });
  }, 600);
};

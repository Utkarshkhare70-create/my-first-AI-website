import React, { useEffect, useRef, useState } from 'react';
import { CelebrationTheme } from '../types/wish';
import { audio } from '../utils/audio';

interface FxBackgroundProps {
  theme: CelebrationTheme;
  interactive?: boolean;
}

interface Balloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  size: number;
  swayOffset: number;
  swaySpeed: number;
}

const BALLOON_COLORS = [
  'radial-gradient(circle at 35% 35%, #ff73b2, #e6007a)',
  'radial-gradient(circle at 35% 35%, #ffd166, #feb700)',
  'radial-gradient(circle at 35% 35%, #c084fc, #9e45f7)',
  'radial-gradient(circle at 35% 35%, #38bdf8, #0284c7)',
  'radial-gradient(circle at 35% 35%, #4ade80, #16a34a)',
];

export const FxBackground: React.FC<FxBackgroundProps> = ({ theme, interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  // Balloons management
  useEffect(() => {
    if (theme !== 'Balloon Parade') {
      setBalloons([]);
      return;
    }

    const initialBalloons: Balloon[] = Array.from({ length: 9 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 85 + 5,
      y: Math.random() * 80 + 30,
      speed: 0.15 + Math.random() * 0.25,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      size: 42 + Math.random() * 26,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.03,
    }));

    setBalloons(initialBalloons);

    let animationFrame: number;
    let time = 0;

    const animateBalloons = () => {
      time += 0.04;
      setBalloons((prev) =>
        prev.map((b) => {
          let newY = b.y - b.speed;
          if (newY < -15) {
            newY = 105;
          }
          return {
            ...b,
            y: newY,
          };
        })
      );
      animationFrame = requestAnimationFrame(animateBalloons);
    };

    animationFrame = requestAnimationFrame(animateBalloons);

    return () => cancelAnimationFrame(animationFrame);
  }, [theme]);

  // Canvas particle animation for Starry Magic, Fireworks, and Confetti
  useEffect(() => {
    if (theme === 'Balloon Parade') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay?: number;
      twinkle?: number;
      rotation?: number;
      vr?: number;
    }

    let particles: Particle[] = [];
    const colors = ['#e6007a', '#feb700', '#9e45f7', '#ffdb9d', '#ffb1c7', '#ffffff'];

    if (theme === 'Starry Magic') {
      // Create glowing starry sky
      particles = Array.from({ length: 45 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2.8 + 1,
        color: Math.random() > 0.4 ? '#feb700' : '#dcb8ff',
        alpha: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 0.05 + 0.01,
      }));
    } else if (theme === 'Confetti Explosion') {
      particles = Array.from({ length: 30 }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: Math.random() * 1.2 + 0.6,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.85,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 4,
      }));
    }

    let animationId: number;
    let fireworkTimer = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (theme === 'Starry Magic') {
        particles.forEach((p) => {
          p.alpha += p.twinkle || 0.02;
          if (p.alpha > 0.95 || p.alpha < 0.2) {
            p.twinkle = -(p.twinkle || 0.02);
          }
          ctx.save();
          ctx.globalAlpha = Math.max(0.1, Math.min(1, p.alpha));
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;

          // Draw 4-point star for larger particles
          if (p.size > 2.2) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      } else if (theme === 'Confetti Explosion') {
        particles.forEach((p) => {
          p.y += p.vy;
          p.x += p.vx + Math.sin(p.y * 0.02) * 0.5;
          p.rotation = (p.rotation || 0) + (p.vr || 1);

          if (p.y > height + 20) {
            p.y = -10;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(((p.rotation || 0) * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55);
          ctx.restore();
        });
      } else if (theme === 'Fireworks Blast') {
        fireworkTimer++;
        if (fireworkTimer % 90 === 0) {
          // Add burst of firework particles
          const burstX = Math.random() * (width * 0.7) + width * 0.15;
          const burstY = Math.random() * (height * 0.45) + height * 0.1;
          const burstColor = colors[Math.floor(Math.random() * colors.length)];
          const burstCount = 28;

          for (let i = 0; i < burstCount; i++) {
            const angle = (i / burstCount) * Math.PI * 2;
            const speed = Math.random() * 3.5 + 1.5;
            particles.push({
              x: burstX,
              y: burstY,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: Math.random() * 2.5 + 1.5,
              color: burstColor,
              alpha: 1,
              decay: 0.016 + Math.random() * 0.015,
            });
          }
        }

        // Render and update firework particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05; // gravity
          p.vx *= 0.98;
          p.alpha -= p.decay || 0.02;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  // Pop balloon handler
  const handlePopBalloon = (id: number) => {
    if (!interactive) return;
    audio.playBalloonPop();
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ambient gradient lights */}
      <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[#e6007a]/15 blur-3xl"></div>
      <div className="absolute top-1/3 -left-16 w-80 h-80 rounded-full bg-[#9e45f7]/15 blur-3xl"></div>
      <div className="absolute bottom-10 right-0 w-64 h-64 rounded-full bg-[#feb700]/12 blur-3xl"></div>

      {/* Canvas for Confetti, Starry Magic, Fireworks */}
      {theme !== 'Balloon Parade' && (
        <canvas ref={canvasRef} className="w-full h-full block" />
      )}

      {/* Interactive Balloons */}
      {theme === 'Balloon Parade' && (
        <div className="relative w-full h-full">
          {balloons.map((b) => (
            <button
              key={b.id}
              onClick={() => handlePopBalloon(b.id)}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}px`,
                height: `${b.size * 1.25}px`,
                background: b.color,
              }}
              title="Click to pop!"
              className={`absolute rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform hover:scale-110 active:scale-90 flex items-center justify-center group`}
            >
              {/* Balloon knot & string */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1.5 bg-black/40 rounded-sm"></div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-white/40"></div>
              {/* Balloon shine highlight */}
              <div className="absolute top-2 left-2 w-2.5 h-4 bg-white/45 rounded-full transform -rotate-45 blur-[0.5px]"></div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

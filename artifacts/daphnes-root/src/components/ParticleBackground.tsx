import { useEffect, useRef } from "react";
import { GAME_CONFIG } from "../config/gameConfig";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const COLORS = [
  "rgba(212,175,55,",   // gold
  "rgba(74,154,53,",    // leaf green
  "rgba(139,90,43,",    // bark
  "rgba(251,191,36,",   // bright amber
  "rgba(61,122,27,",    // dark green
];

function mkParticle(w: number, h: number): Particle {
  const maxLife = 120 + Math.random() * 180;
  return {
    x: Math.random() * w,
    y: h + 10,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -(GAME_CONFIG.PARTICLE_SPEED_MIN + Math.random() * (GAME_CONFIG.PARTICLE_SPEED_MAX - GAME_CONFIG.PARTICLE_SPEED_MIN)),
    size: 1.5 + Math.random() * 3,
    opacity: 0,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    life: 0,
    maxLife,
  };
}

export function ParticleBackground({ heat, unlockedCount }: { heat: number; unlockedCount: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const heatRef = useRef(heat);
  const countRef = useRef(unlockedCount);

  useEffect(() => { heatRef.current = heat; }, [heat]);
  useEffect(() => { countRef.current = unlockedCount; }, [unlockedCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed initial particles
    particlesRef.current = Array.from({ length: GAME_CONFIG.PARTICLE_COUNT }, () =>
      mkParticle(canvas.width, canvas.height)
    ).map((p) => ({ ...p, y: Math.random() * canvas.height, life: Math.random() * p.maxLife }));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const heatFactor = heatRef.current / 100;
      const greenFactor = countRef.current / 18;

      particlesRef.current.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy * (1 + heatFactor * 0.5);

        // Fade in / fade out
        const halfLife = p.maxLife / 2;
        p.opacity = p.life < halfLife
          ? (p.life / halfLife) * 0.7
          : ((p.maxLife - p.life) / halfLife) * 0.7;

        if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > w + 10) {
          particlesRef.current[i] = mkParticle(w, h);
          return;
        }

        // Glow effect
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        glow.addColorStop(0, `${p.color}${p.opacity.toFixed(2)})`);
        glow.addColorStop(1, `${p.color}0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.min(p.opacity * 1.5, 0.9).toFixed(2)})`;
        ctx.fill();
      });

      // Add heat shimmer at high heat
      if (heatFactor > 0.5) {
        const shimmerOpacity = (heatFactor - 0.5) * 0.15;
        ctx.fillStyle = `rgba(239,68,68,${shimmerOpacity})`;
        ctx.fillRect(0, 0, w, h);
      }

      // Add green glow at high unlock rate
      if (greenFactor > 0.3) {
        const greenOpacity = (greenFactor - 0.3) * 0.12;
        ctx.fillStyle = `rgba(74,154,53,${greenOpacity})`;
        ctx.fillRect(0, 0, w, h);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

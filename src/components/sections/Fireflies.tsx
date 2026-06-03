import { useMemo } from "react";

export function Fireflies({ count = 20 }: { count?: number }) {
  // useMemo prevents re-creating the array on every render
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 3 + (i % 5) * 1.2,
        left: (i * 17 + 7) % 100,
        top: (i * 23 + 11) % 100,
        delay: (i % 7) * 0.55,
        duration: 3.2 + (i % 4) * 0.9,
      })),
    [count],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ contain: "layout style paint" }}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-gold animate-firefly"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            boxShadow: `0 0 ${p.size * 3}px var(--color-gold)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            willChange: "opacity, transform",
          }}
        />
      ))}
    </div>
  );
}

export function FloatingLeaves({ count = 8 }: { count?: number }) {
  const leaves = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 13 + 5) % 100,
        duration: 15 + (i % 5) * 3,
        delay: i * 2,
      })),
    [count],
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-1 overflow-hidden"
      aria-hidden
    >
      {leaves.map((leaf) => (
        <span
          key={leaf.id}
          className="absolute text-2xl opacity-60"
          style={{
            left: `${leaf.left}%`,
            top: "-10vh",
            animation: `drift ${leaf.duration}s linear infinite`,
            animationDelay: `${leaf.delay}s`,
            willChange: "transform, opacity",
          }}
        >
          🍃
        </span>
      ))}
    </div>
  );
}

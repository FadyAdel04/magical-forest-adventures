export function Fireflies({ count = 20 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 3 + (i % 5) * 1.2,
    left: (i * 17 + 7) % 100,
    top: (i * 23 + 11) % 100,
    delay: (i % 7) * 0.55,
    duration: 3.2 + (i % 4) * 0.9,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
          }}
        />
      ))}
    </div>
  );
}

export function FloatingLeaves({ count = 8 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-1 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl opacity-60"
          style={{
            left: `${(i * 13 + 5) % 100}%`,
            top: "-10vh",
            animation: `drift ${15 + (i % 5) * 3}s linear infinite`,
            animationDelay: `${i * 2}s`,
          }}
        >
          🍃
        </span>
      ))}
    </div>
  );
}

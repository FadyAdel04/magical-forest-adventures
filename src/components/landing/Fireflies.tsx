export function Fireflies({ count = 20 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const size = 4 + Math.random() * 6;
        return (
          <span
            key={i}
            className="absolute rounded-full bg-[var(--color-gold)] animate-firefly"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${size * 3}px var(--color-gold)`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function FloatingLeaves({ count = 8 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-10vh`,
            animation: `drift ${15 + Math.random() * 15}s linear infinite`,
            animationDelay: `${Math.random() * 15}s`,
          }}
        >
          🍃
        </span>
      ))}
    </div>
  );
}

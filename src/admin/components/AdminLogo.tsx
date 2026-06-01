import { cn } from "@/lib/utils";
import logo from "@/assets/logo.jpg";

type AdminLogoProps = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "light" | "dark";
};

const sizes = {
  sm: { img: "h-10 w-10", title: "text-base", sub: "text-[9px]" },
  md: { img: "h-14 w-14", title: "text-lg", sub: "text-[10px]" },
  lg: { img: "h-20 w-20", title: "text-2xl", sub: "text-xs" },
};

export function AdminLogo({
  size = "md",
  showText = true,
  className,
  variant = "dark",
}: AdminLogoProps) {
  const s = sizes[size];
  const textClass = variant === "dark" ? "text-cream" : "text-forest-deep";
  const subClass = variant === "dark" ? "text-cream/60" : "text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-3", className)} dir="rtl">
      <img
        src={logo}
        alt="نسيج"
        className={cn("shrink-0 rounded-xl object-contain shadow-md ring-2 ring-white/20", s.img)}
      />
      {showText && (
        <div className="text-right">
          <p className={cn("font-display font-black leading-none", s.title, textClass)}>نسيج</p>
          <p className={cn("mt-0.5 font-bold tracking-wide", s.sub, subClass)}>NASEEG</p>
        </div>
      )}
    </div>
  );
}

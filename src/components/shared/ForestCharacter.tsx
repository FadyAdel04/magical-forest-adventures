import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ForestCharacterProps = ImgHTMLAttributes<HTMLImageElement> & {
  /** Removes dark matte when PNG has a black backdrop */
  cutout?: boolean;
};

export function ForestCharacter({
  src,
  alt = "",
  className,
  cutout = true,
  ...props
}: ForestCharacterProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
      className={cn(
        "pointer-events-none h-auto max-w-full select-none",
        cutout && "character-cutout",
        className,
      )}
    />
  );
}

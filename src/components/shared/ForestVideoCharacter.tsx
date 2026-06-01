import type { VideoHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ForestVideoCharacterProps = VideoHTMLAttributes<HTMLVideoElement> & {
  cutout?: boolean;
};

export function ForestVideoCharacter({
  src,
  className,
  cutout = true,
  ...props
}: ForestVideoCharacterProps) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-hidden={props["aria-label"] ? undefined : true}
      {...props}
      className={cn(
        "pointer-events-none h-auto max-w-full select-none object-contain",
        cutout && "character-cutout",
        className,
      )}
    />
  );
}

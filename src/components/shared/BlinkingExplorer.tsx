import { explorerCharacter } from "@/assets/characters";
import { cn } from "@/lib/utils";
import { ForestCharacter } from "./ForestCharacter";

type BlinkingExplorerProps = {
  className?: string;
  imageClassName?: string;
};

/** Explorer with CSS eyelid overlays — tune positions if asset changes */
export function BlinkingExplorer({ className, imageClassName }: BlinkingExplorerProps) {
  return (
    <div className={cn("relative inline-block w-full", className)}>
      <ForestCharacter
        src={explorerCharacter}
        alt="مستكشف الغابة"
        className={imageClassName}
      />
      <span className="explorer-eyelid explorer-eyelid--left" aria-hidden />
      <span className="explorer-eyelid explorer-eyelid--right" aria-hidden />
    </div>
  );
}

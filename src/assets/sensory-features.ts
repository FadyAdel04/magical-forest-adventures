/** Hero sensory feature illustrations (replace icon placeholders) */
import featureCandle from "./cndl.png";
import featureTouch from "./Layer 3.png";
import featurePuzzle from "./puzl.png";
import featureWorld from "./castle.png";
import featureBook from "./audio.png";

/** Order matches features: شمعة → استماع → اكتشاف → بازل → حكي */
export const sensoryFeatureImages = [
  featureCandle,
  featureBook,
  featureWorld,
  featurePuzzle,
  featureTouch,
] as const;

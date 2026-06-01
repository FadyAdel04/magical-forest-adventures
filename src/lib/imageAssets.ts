import product from "@/assets/product.jpg";
import product2 from "@/assets/product2.jpg";
import product3 from "@/assets/product3.jpg";
import product4 from "@/assets/product4.jpg";

export type ImageAssetKey = "product" | "product2" | "product3" | "product4";

export const IMAGE_ASSETS: Record<ImageAssetKey, string> = {
  product,
  product2,
  product3,
  product4,
};

export function resolveLegacyImage(key: ImageAssetKey): string {
  return IMAGE_ASSETS[key] ?? IMAGE_ASSETS.product;
}

export function resolveSlideImage(imageUrl: string): string {
  if (!imageUrl) return IMAGE_ASSETS.product;
  return imageUrl;
}

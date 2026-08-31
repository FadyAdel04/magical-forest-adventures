import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackViewContent, getPixelProductParams } from "@/lib/meta-pixel";
import { useStore } from "./useStore";

/**
 * Hook to automatically track PageView on SPA route changes
 * and track ViewContent on the main landing page using dynamic catalog data.
 */
export function useMetaPixel() {
  const location = useLocation();
  const { catalog, isReady } = useStore();
  const trackedViewKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Fire Meta PageView on every SPA navigation route change
    trackPageView();
  }, [location.pathname, location.search]);

  useEffect(() => {
    // Fire ViewContent on landing page root once catalog data is ready from Supabase / store
    if (location.pathname === "/" && isReady && catalog) {
      const key = `${location.pathname}-${catalog.updatedAt || catalog.id}-${catalog.priceAfter}`;
      if (trackedViewKeyRef.current !== key) {
        trackedViewKeyRef.current = key;
        const params = getPixelProductParams(catalog);
        if (params) {
          trackViewContent(params);
        }
      }
    }
  }, [location.pathname, location.search, isReady, catalog]);
}

/**
 * Component version to place inside BrowserRouter
 */
export function MetaPixelTracker() {
  useMetaPixel();
  return null;
}

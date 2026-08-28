import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackViewContent } from "@/lib/meta-pixel";

/**
 * Hook to automatically track PageView on SPA route changes
 * and track ViewContent on the main landing page.
 */
export function useMetaPixel() {
  const location = useLocation();

  useEffect(() => {
    // Fire Meta PageView on every SPA navigation route change
    trackPageView();

    // Fire ViewContent on landing page root
    if (location.pathname === "/") {
      trackViewContent();
    }
  }, [location.pathname, location.search]);
}

/**
 * Component version to place inside BrowserRouter
 */
export function MetaPixelTracker() {
  useMetaPixel();
  return null;
}

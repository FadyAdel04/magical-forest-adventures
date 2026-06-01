import { useEffect, type ReactNode } from "react";
import { hydrateStore } from "@/lib/store";

export function StoreProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void hydrateStore();
  }, []);

  return children;
}

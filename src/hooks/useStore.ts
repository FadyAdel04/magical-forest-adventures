import { useSyncExternalStore } from "react";
import { getStoreSnapshot, subscribe, type StoreSnapshot } from "@/lib/store";

export type StoreState = StoreSnapshot;

export function useStore(): StoreState {
  return useSyncExternalStore(subscribe, getStoreSnapshot, getStoreSnapshot);
}

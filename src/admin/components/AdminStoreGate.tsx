import type { ReactNode } from "react";
import { Loader2, RefreshCw, WifiOff } from "lucide-react";
import { useStore } from "@/hooks/useStore";
import { refreshStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function AdminStoreGate({ children }: { children: ReactNode }) {
  const { isLoading, isReady, error } = useStore();

  if (isLoading && !isReady) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-forest" />
        <p className="text-sm font-medium">جاري تحميل البيانات من قاعدة البيانات...</p>
      </div>
    );
  }

  if (error && !isReady) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <WifiOff className="h-10 w-10 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" className="gap-2" onClick={() => void refreshStore()}>
          <RefreshCw className="h-4 w-4" />
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return children;
}

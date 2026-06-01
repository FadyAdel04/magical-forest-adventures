import { useRef } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MAX_BYTES = 1_500_000;

type ImageUploadFieldProps = {
  label?: string;
  value: string;
  onChange: (dataUrl: string) => void;
  className?: string;
};

export function ImageUploadField({ label = "الصورة", value, onChange, className }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("حجم الصورة كبير — الحد الأقصى 1.5 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={className} dir="rtl">
      {label && <Label className="mb-2 block text-right">{label}</Label>}
      <div className="flex flex-col items-end gap-3 sm:flex-row-reverse sm:items-start">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40">
          {value ? (
            <>
              <img src={value} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white shadow"
                aria-label="حذف الصورة"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Upload className="h-8 w-8 opacity-40" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col items-end gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            <Upload className="ml-2 h-4 w-4" />
            رفع صورة جديدة
          </Button>
          <p className="text-right text-xs text-muted-foreground">JPG أو PNG — حتى 1.5 ميجابايت</p>
        </div>
      </div>
    </div>
  );
}

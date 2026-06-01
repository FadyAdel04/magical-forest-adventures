import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type RtlSwitchProps = {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
};

/** Switch with label on the right (RTL-native layout) */
export function RtlSwitch({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  className,
}: RtlSwitchProps) {
  return (
    <div
      className={cn(
        "flex flex-row-reverse items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/30 px-4 py-3",
        className,
      )}
      dir="rtl"
    >
      <div className="min-w-0 flex-1 text-right">
        <Label htmlFor={id} className="cursor-pointer text-sm font-bold text-forest-deep">
          {label}
        </Label>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="shrink-0 data-[state=checked]:bg-forest"
        dir="ltr"
      />
    </div>
  );
}

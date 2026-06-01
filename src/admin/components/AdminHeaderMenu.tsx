import { ExternalLink, LogOut, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Extra actions (not main nav) — mobile/tablet header */
export function AdminHeaderMenu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-full border-forest/25 bg-forest/10 text-forest-deep hover:bg-forest/15"
          aria-label="المزيد"
        >
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52 text-right">
        <DropdownMenuItem asChild className="cursor-pointer justify-end gap-2">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            عرض الموقع
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer justify-end gap-2 text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

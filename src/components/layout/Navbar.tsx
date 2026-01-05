import { Link, useLocation } from "react-router-dom";
import { GraduationCap, BarChart3, FolderKanban, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Trang chủ", icon: Home },
  { to: "/diem", label: "Xem điểm CS", icon: BarChart3 },
  { to: "/diem_ce", label: "Xem điểm CE", icon: BarChart3 },
  { to: "/do-an", label: "Đồ án năm 4", icon: FolderKanban },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            TOOL-CSE<span className="text-primary">-BKHCM</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

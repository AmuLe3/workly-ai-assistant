import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarClock,
  BookOpen,
  MessagesSquare,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { ResponsibleAIDialog } from "@/components/ResponsibleAIDialog";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Notes Summarizer", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research", icon: BookOpen },
  { to: "/chat", label: "AI Chat", icon: MessagesSquare },
] as const;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="gradient-brand flex size-10 items-center justify-center rounded-xl font-display text-lg font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
        W
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-semibold">Workly AI</span>
        <span className="block text-[11px] text-muted-foreground">Workplace assistant</span>
      </span>
    </Link>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--brand)]"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-[18px] transition-colors",
                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[264px] shrink-0 flex-col justify-between border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <div className="flex flex-col gap-8">
          <Logo />
          <NavLinks />
        </div>
        <div className="rounded-xl border border-border bg-background/40 p-3">
          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            AI-generated content may contain errors. Review important information before using or
            sharing it.
          </p>
          <div className="mt-3">
            <ResponsibleAIDialog />
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-sidebar-border bg-sidebar/95 px-4 py-3 backdrop-blur lg:hidden">
        <Logo />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-border p-2 text-foreground transition-colors hover:bg-surface-hover"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-x-0 top-[61px] z-30 border-b border-sidebar-border bg-sidebar px-4 py-4 shadow-[var(--shadow-soft)] lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
          <div className="mt-4">
            <ResponsibleAIDialog />
          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </div>
        <p className="mx-auto max-w-6xl px-4 pb-10 text-center text-xs text-muted-foreground sm:px-6 lg:px-10">
          AI-generated content may contain errors. Review important information before using or
          sharing it.
        </p>
      </main>
    </div>
  );
}

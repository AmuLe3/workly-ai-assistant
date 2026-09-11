import type { LucideIcon } from "lucide-react";

export function PageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6 flex items-start gap-4">
      <span className="gradient-brand flex size-11 shrink-0 items-center justify-center rounded-xl text-primary-foreground shadow-[var(--shadow-glow)]">
        <Icon className="size-5" />
      </span>
      <div>
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}

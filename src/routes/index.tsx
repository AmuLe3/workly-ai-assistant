import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Layers, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResponsibleAIDialog } from "@/components/ResponsibleAIDialog";
import { TOOLS } from "@/lib/tools";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workly AI Dashboard — Your AI Workplace Assistant" },
      {
        name: "description",
        content:
          "One dashboard with five AI productivity tools: email drafting, meeting summaries, task planning, research briefs and workplace chat.",
      },
      { property: "og:title", content: "Workly AI Dashboard — Your AI Workplace Assistant" },
      {
        property: "og:description",
        content:
          "Automate emails, summarize meetings, organize tasks, research smarter, and work more efficiently with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const STATS = [
  {
    label: "5 AI Tools",
    detail: "Email, notes, planning, research and chat in a single workspace.",
    icon: Layers,
  },
  {
    label: "Work Smarter",
    detail: "Structured starting points instead of a blank page.",
    icon: Sparkles,
  },
  {
    label: "Human Review Recommended",
    detail: "Every output is a draft for you to check and refine.",
    icon: ShieldCheck,
  },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="panel relative overflow-hidden p-6 sm:p-10">
        <div
          aria-hidden
          className="gradient-brand pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-20 blur-3xl"
        />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Workly AI · workplace productivity
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Your <span className="text-gradient-brand">AI Workplace Assistant</span>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Automate emails, summarize meetings, organize tasks, research smarter, and work more
            efficiently with AI.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/email">
                Start with Email
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/chat">Open AI Chat</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map(({ label, detail, icon: Icon }) => (
          <article
            key={label}
            className="panel p-5 transition-transform duration-200 hover:-translate-y-1"
          >
            <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-background/40 text-primary">
              <Icon className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold">{label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold">Productivity tools</h2>
            <p className="text-sm text-muted-foreground">Pick a tool to get started.</p>
          </div>
          <div className="hidden sm:block">
            <ResponsibleAIDialog label="Responsible AI" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TOOLS.map(({ to, name, description, icon: Icon }) => (
            <article
              key={to}
              className="panel group flex flex-col p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50"
            >
              <span className="gradient-brand flex size-11 items-center justify-center rounded-xl text-primary-foreground shadow-[var(--shadow-glow)]">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{name}</h3>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <Button asChild variant="secondary" className="mt-5 w-full">
                <Link to={to}>
                  Open Tool
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

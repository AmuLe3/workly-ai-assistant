import { ShieldCheck } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const POINTS = [
  {
    title: "Review before you use it",
    body: "Every draft, summary, plan and brief produced here is a starting point. Read it carefully and correct anything that is wrong or out of context before sending or sharing it.",
  },
  {
    title: "Be careful with sensitive information",
    body: "Avoid entering confidential, personal or commercially sensitive details unless it is genuinely necessary and permitted by your organisation's policy.",
  },
  {
    title: "AI does not replace professional judgment",
    body: "Legal, financial, medical, HR and other consequential decisions need a qualified human. Treat AI output as input to your thinking, not a substitute for it.",
  },
  {
    title: "Verify research against reliable sources",
    body: "The research assistant organises thinking; it does not supply verified facts and deliberately produces no citations. Confirm every claim against named, reputable sources.",
  },
];

export function ResponsibleAIDialog({ label = "Responsible AI" }: { label?: string }) {
  return (
    <Dialog>
      <DialogTrigger className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-hover">
        <ShieldCheck className="size-4 text-primary" />
        {label}
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Responsible AI at Workly</DialogTitle>
          <DialogDescription>
            How to get useful results from this assistant without getting caught out by it.
          </DialogDescription>
        </DialogHeader>
        <ul className="mt-2 space-y-4">
          {POINTS.map((p) => (
            <li key={p.title} className="rounded-xl border border-border bg-background/40 p-4">
              <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}

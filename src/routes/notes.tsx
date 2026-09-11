import { createFileRoute } from "@tanstack/react-router";
import { FileText, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/OutputPanel";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workly AI" },
      {
        name: "description",
        content:
          "Paste meeting notes or a transcript and get a structured summary with key points, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Workly AI" },
      {
        property: "og:description",
        content: "Turn meeting notes into summaries, decisions and action items.",
      },
    ],
  }),
  component: NotesTool,
});

const SAMPLE = `Weekly product sync, Tuesday.
Thabo shared that onboarding drop-off is highest on the payment step.
We agreed to run a two-week experiment with a simplified payment screen.
Naledi will prepare the designs by Friday.
Support tickets are up 12% month on month, mostly password resets.
We decided to postpone the referral feature until the next quarter.
Kagiso will review the analytics dashboard and report back next week.`;

function NotesTool() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (notes.trim().length < 30) {
      setError("Paste a bit more of the meeting notes — at least a few sentences.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOutput(await summarizeMeeting(notes));
    } catch {
      setError("Something went wrong while summarizing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        icon={FileText}
        title="Meeting Notes Summarizer"
        description="Turn meeting notes into summaries, decisions and action items. Paste raw notes or a transcript below."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-4 p-5 sm:p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="notes">Meeting notes or transcript</Label>
              <button
                type="button"
                onClick={() => setNotes(SAMPLE)}
                className="text-xs text-primary transition-opacity hover:opacity-80"
              >
                Load sample notes
              </button>
            </div>
            <Textarea
              id="notes"
              rows={18}
              placeholder="Paste your meeting notes here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[360px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              {notes.trim() ? `${notes.trim().split(/\s+/).length} words` : "No notes yet"}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="hero" onClick={run} disabled={loading}>
              <Sparkles className="size-4" />
              {loading ? "Summarizing…" : "Summarize Meeting"}
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => {
                setNotes("");
                setOutput("");
                setError(null);
              }}
            >
              <Trash2 className="size-4" />
              Clear
            </Button>
          </div>
        </section>

        <OutputPanel
          title="Structured summary"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={notes.trim() ? run : undefined}
          emptyHint="You'll get a summary, key points, decisions, action items with owners, deadlines and follow-ups."
          note="AI-generated summaries can miss nuance — check them against the notes before circulating."
        />
      </div>
    </div>
  );
}

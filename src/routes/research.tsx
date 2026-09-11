import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

import { OutputPanel } from "@/components/OutputPanel";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateResearch } from "@/lib/ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workly AI" },
      {
        name: "description",
        content:
          "Generate a structured research brief with a topic overview, key insights, considerations, next steps and further questions.",
      },
      { property: "og:title", content: "AI Research Assistant — Workly AI" },
      {
        property: "og:description",
        content: "Explore workplace topics and generate structured insights.",
      },
    ],
  }),
  component: ResearchTool,
});

const EMPTY = {
  topic: "",
  question: "",
  context: "",
  length: "Standard" as "Short" | "Standard" | "Detailed",
};

function ResearchTool() {
  const [form, setForm] = useState(EMPTY);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (!form.topic.trim()) {
      setError("Enter a research topic to get started.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOutput(await generateResearch(form));
    } catch {
      setError("Something went wrong while preparing the brief. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        icon={BookOpen}
        title="AI Research Assistant"
        description="Explore workplace topics and generate structured insights. Use it to organise your thinking before you gather real sources."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Research topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Hybrid work policies for small teams"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="question">Research question</Label>
            <Input
              id="question"
              placeholder="e.g. What should we consider before moving to three office days?"
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bg">Background / context</Label>
            <Textarea
              id="bg"
              rows={6}
              placeholder="What has already happened, who is involved, and what decision does this support?"
              value={form.context}
              onChange={(e) => setForm({ ...form, context: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="length">Desired output length</Label>
            <Select
              value={form.length}
              onValueChange={(v) =>
                setForm({ ...form, length: v as "Short" | "Standard" | "Detailed" })
              }
            >
              <SelectTrigger id="length">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Short">Short</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="hero" onClick={run} disabled={loading}>
              <Sparkles className="size-4" />
              {loading ? "Researching…" : "Generate Research Brief"}
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => {
                setForm(EMPTY);
                setOutput("");
                setError(null);
              }}
            >
              <Trash2 className="size-4" />
              Clear form
            </Button>
          </div>
        </section>

        <OutputPanel
          title="Research brief"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={form.topic.trim() ? run : undefined}
          emptyHint="You'll get an overview, key insights, considerations, next steps and questions for further research."
          note="AI-generated research must be verified using reliable sources. This tool deliberately produces no citations — it will not present invented references as real."
        />
      </div>
    </div>
  );
}

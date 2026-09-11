import { createFileRoute } from "@tanstack/react-router";
import { Mail, Sparkles, Trash2 } from "lucide-react";
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
import { generateEmail, type Tone } from "@/lib/ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workly AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails with a subject line, body and sign-off in formal, friendly, professional or persuasive tone.",
      },
      { property: "og:title", content: "Smart Email Generator — Workly AI" },
      {
        property: "og:description",
        content: "Draft polished workplace emails with customizable tone.",
      },
    ],
  }),
  component: EmailTool,
});

const TONES: Tone[] = ["Formal", "Friendly", "Professional", "Persuasive"];

const EMPTY = { recipient: "", purpose: "", context: "", tone: "Professional" as Tone, instructions: "" };

function EmailTool() {
  const [form, setForm] = useState(EMPTY);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = form.recipient.trim() !== "" && form.purpose.trim() !== "";

  async function run() {
    if (!canGenerate) {
      setError("Add a recipient and a purpose so the draft has something to work from.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setOutput(await generateEmail(form));
    } catch {
      setError("Something went wrong while generating the email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setForm(EMPTY);
    setOutput("");
    setError(null);
  }

  return (
    <div>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Draft polished workplace emails with customizable tone. Fill in the context, choose a tone and generate a subject line, body and sign-off."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="panel space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient / audience</Label>
            <Input
              id="recipient"
              placeholder="e.g. Sipho Ndlovu, Operations Manager"
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Input
              id="purpose"
              placeholder="e.g. Request a deadline extension for the Q3 report"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Main message or context</Label>
            <Textarea
              id="context"
              rows={6}
              placeholder="What does the reader need to know? Include dates, numbers and any background."
              value={form.context}
              onChange={(e) => setForm({ ...form, context: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select
              value={form.tone}
              onValueChange={(tone) => setForm({ ...form, tone: tone as Tone })}
            >
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Additional instructions (optional)</Label>
            <Textarea
              id="instructions"
              rows={3}
              placeholder="e.g. Keep it under 120 words and mention the meeting on Friday."
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <Button variant="hero" onClick={run} disabled={loading}>
              <Sparkles className="size-4" />
              {loading ? "Generating…" : "Generate Email"}
            </Button>
            <Button variant="outline" onClick={clear} disabled={loading}>
              <Trash2 className="size-4" />
              Clear form
            </Button>
          </div>
        </section>

        <OutputPanel
          title="Generated email"
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          onRegenerate={canGenerate ? run : undefined}
          emptyHint="Your draft will appear here with a suggested subject line, body and sign-off."
          note="AI-generated content may require human review before sending."
        />
      </div>
    </div>
  );
}

import { Check, Copy, Loader2, Pencil, RefreshCw, Sparkle } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface OutputPanelProps {
  title: string;
  value: string;
  onChange: (next: string) => void;
  loading?: boolean | undefined;
  error?: string | null | undefined;
  onRegenerate?: (() => void) | undefined;
  emptyHint: string;
  note?: ReactNode | undefined;
}

export function OutputPanel({
  title,
  value,
  onChange,
  loading,
  error,
  onRegenerate,
  emptyHint,
  note,
}: OutputPanelProps) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy — select the text and copy manually.");
    }
  }

  return (
    <section className="panel flex min-h-[420px] flex-col p-5 sm:p-6" aria-live="polite">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {value && !loading && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={copy}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setEditing((v) => !v)}>
              <Pencil className="size-4" />
              {editing ? "Done" : "Edit"}
            </Button>
            {onRegenerate && (
              <Button variant="secondary" size="sm" onClick={onRegenerate}>
                <RefreshCw className="size-4" />
                Regenerate
              </Button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm">Generating…</p>
          <div className="mt-2 w-full max-w-sm space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded-full bg-surface-hover"
                style={{ width: `${90 - i * 12}%`, animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm font-medium text-destructive">{error}</p>
          {onRegenerate && (
            <Button variant="secondary" size="sm" onClick={onRegenerate}>
              <RefreshCw className="size-4" />
              Try again
            </Button>
          )}
        </div>
      ) : value ? (
        editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[320px] flex-1 resize-y bg-background/50 font-mono text-[13px] leading-relaxed"
          />
        ) : (
          <pre className="flex-1 overflow-x-auto whitespace-pre-wrap rounded-xl bg-background/50 p-4 text-[13.5px] leading-relaxed text-foreground/90">
            {value}
          </pre>
        )
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-border bg-background/40">
            <Sparkle className="size-5 text-primary" />
          </span>
          <p className="max-w-xs text-sm">{emptyHint}</p>
        </div>
      )}

      {note && <p className="mt-4 text-xs text-muted-foreground">{note}</p>}
    </section>
  );
}

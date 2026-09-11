import { createFileRoute } from "@tanstack/react-router";
import { MessagesSquare, RotateCcw, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatReply } from "@/lib/ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Workplace Chat — Workly AI" },
      {
        name: "description",
        content:
          "Ask workplace productivity questions: prepare for meetings, improve messages, organise your workload or brainstorm project ideas.",
      },
      { property: "og:title", content: "AI Workplace Chat — Workly AI" },
      {
        property: "og:description",
        content: "Ask questions and get AI-powered workplace assistance.",
      },
    ],
  }),
  component: ChatTool,
});

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Help me prepare for a meeting",
  "Improve this professional message",
  "Help me organise my workload",
  "Brainstorm project ideas",
  "Explain a workplace concept",
];

/** Renders **bold** segments and keeps line breaks. */
function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <p key={li} className={cn("min-h-[0.5em]", li > 0 && "mt-1")}>
          {line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((part, pi) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pi} className="font-semibold text-foreground">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
              return (
                <em key={pi} className="text-muted-foreground">
                  {part.slice(1, -1)}
                </em>
              );
            }
            return <span key={pi}>{part}</span>;
          })}
        </p>
      ))}
    </>
  );
}

function ChatTool() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content };
    const historyLength = messages.length;
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const reply = await chatReply(content, historyLength);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
    } catch {
      setError("The assistant didn't respond. Please try sending that again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        icon={MessagesSquare}
        title="AI Workplace Chat"
        description="Ask questions and get AI-powered workplace assistance — from meeting prep to organising your workload."
      />

      <section className="panel flex h-[calc(100vh-16rem)] min-h-[520px] flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <p className="text-sm text-muted-foreground">
            {messages.length === 0 ? "New conversation" : `${messages.length} messages`}
          </p>
          <Button
            variant="ghost"
            size="sm"
            disabled={messages.length === 0 || loading}
            onClick={() => {
              setMessages([]);
              setError(null);
            }}
          >
            <RotateCcw className="size-4" />
            Clear chat
          </Button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.length === 0 && !loading && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="gradient-brand flex size-12 items-center justify-center rounded-2xl text-primary-foreground shadow-[var(--shadow-glow)]">
                <MessagesSquare className="size-5" />
              </span>
              <h2 className="font-display text-lg font-semibold">How can I help with work today?</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Pick a suggestion below or type your own question.
              </p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] text-[14.5px] leading-relaxed sm:max-w-[75%]",
                  m.role === "user"
                    ? "rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-primary-foreground"
                    : "text-foreground/90",
                )}
              >
                <RichText text={m.content} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="size-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: `${i * 140}ms` }}
                  />
                ))}
              </span>
              Thinking…
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border px-4 py-4 sm:px-6">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                disabled={loading}
                className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about meetings, messages, workload, ideas…"
              className="max-h-40 min-h-[44px] flex-1 resize-none bg-background/50"
            />
            <Button type="submit" variant="hero" size="icon" disabled={loading || !input.trim()}>
              <SendHorizonal className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            AI-generated content may contain errors. Review important information before using or
            sharing it.
          </p>
        </div>
      </section>
    </div>
  );
}

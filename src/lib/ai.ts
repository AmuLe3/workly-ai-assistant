/**
 * AI service layer.
 *
 * Right now these functions return realistic, locally-generated sample
 * responses so the whole product is usable without any provider connected.
 * When a real AI backend is added, only this file changes: replace each
 * `simulate(...)` body with a call to a server function / API route that
 * holds the API key server-side. No keys ever live in this file.
 */

export type Tone = "Formal" | "Friendly" | "Professional" | "Persuasive";

const DELAY = 900;

function simulate<T>(value: T, ms = DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function clean(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function sentences(text: string): string[] {
  return text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

function titleCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/* ------------------------------- Email ---------------------------------- */

export interface EmailInput {
  recipient: string;
  purpose: string;
  context: string;
  tone: Tone;
  instructions?: string;
}

const openers: Record<Tone, (r: string) => string> = {
  Formal: (r) => `Dear ${r},`,
  Friendly: (r) => `Hi ${r},`,
  Professional: (r) => `Hello ${r},`,
  Persuasive: (r) => `Hello ${r},`,
};

const closers: Record<Tone, string> = {
  Formal: "Yours sincerely,",
  Friendly: "Thanks so much,",
  Professional: "Kind regards,",
  Persuasive: "Looking forward to your response,",
};

const bridges: Record<Tone, string> = {
  Formal:
    "I am writing to you regarding the matter set out below, and would appreciate your consideration.",
  Friendly: "I wanted to reach out quickly about something I think you'll find useful.",
  Professional: "I'm getting in touch to share some context and agree on the next steps.",
  Persuasive:
    "I believe there is a clear opportunity here, and I'd like to walk you through why it matters.",
};

export async function generateEmail(input: EmailInput): Promise<string> {
  const recipient = clean(input.recipient) || "there";
  const purpose = clean(input.purpose) || "a quick update";
  const context = clean(input.context) || "There are no additional details at this stage.";
  const extra = clean(input.instructions || "");

  const subject = titleCase(purpose).replace(/\.$/, "");
  const points = sentences(input.context).slice(0, 3);

  const body = [
    `Subject: ${subject}`,
    "",
    openers[input.tone](recipient),
    "",
    bridges[input.tone],
    "",
    `${titleCase(context)}`,
    points.length > 1
      ? ["", "Key points:", ...points.map((p) => `• ${p.replace(/\.$/, "")}`)].join("\n")
      : "",
    extra ? `\n${titleCase(extra)}` : "",
    "",
    input.tone === "Persuasive"
      ? "If this sounds workable, I'd be glad to set up a short call this week to move it forward."
      : "Please let me know if you would like any further detail, or if a short call would be easier.",
    "",
    closers[input.tone],
    "[Your name]",
    "[Your role · Your organisation]",
  ]
    .filter((line) => line !== "")
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");

  return simulate(body);
}

/* ---------------------------- Meeting notes ------------------------------ */

export async function summarizeMeeting(notes: string): Promise<string> {
  if (!notes.trim()) return "";
  return summarizeMeetingFn({ data: { notes: notes.trim() } });
}

/* ------------------------------- Planner --------------------------------- */

export type Priority = "High" | "Medium" | "Low";

export interface PlannerTask {
  id: string;
  name: string;
  deadline: string;
  priority: Priority;
  duration: number; // hours
}

export interface PlannerInput {
  tasks: PlannerTask[];
  hoursPerDay: number;
  startHour: number;
  mode: "Daily" | "Weekly";
}

function fmtHour(h: number) {
  const hour = Math.floor(h);
  const min = Math.round((h - hour) * 60);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${min.toString().padStart(2, "0")} ${suffix}`;
}

export async function generatePlan(input: PlannerInput): Promise<string> {
  const order: Priority[] = ["High", "Medium", "Low"];
  const sorted = [...input.tasks].sort(
    (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority),
  );

  const days =
    input.mode === "Weekly"
      ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      : ["Today"];

  const buckets: string[] = [];
  let dayIndex = 0;
  let cursor = input.startHour;
  let used = 0;

  for (const task of sorted) {
    if (used + task.duration > input.hoursPerDay && dayIndex < days.length - 1) {
      dayIndex += 1;
      cursor = input.startHour;
      used = 0;
    }
    const end = cursor + task.duration;
    buckets.push(
      `${days[dayIndex]} · ${fmtHour(cursor)} – ${fmtHour(end)} · [${task.priority}] ${task.name}${
        task.deadline ? ` (due ${task.deadline})` : ""
      }`,
    );
    cursor = end + 0.25;
    used += task.duration;
  }

  const byPriority = (p: Priority) =>
    sorted.filter((t) => t.priority === p).map((t) => `• ${t.name} — ${t.duration}h`);

  const total = sorted.reduce((sum, t) => sum + t.duration, 0);

  const out = [
    `${input.mode.toUpperCase()} WORK PLAN`,
    `${sorted.length} task${sorted.length === 1 ? "" : "s"} · ${total}h of focused work · ${input.hoursPerDay}h available per day`,
    "",
    "HIGH PRIORITY",
    ...(byPriority("High").length ? byPriority("High") : ["• None"]),
    "",
    "MEDIUM PRIORITY",
    ...(byPriority("Medium").length ? byPriority("Medium") : ["• None"]),
    "",
    "LOW PRIORITY",
    ...(byPriority("Low").length ? byPriority("Low") : ["• None"]),
    "",
    "SUGGESTED TIME BLOCKS",
    ...buckets,
    "",
    "WORKING NOTES",
    "• Protect the first block of the day for the highest-priority task.",
    "• Keep a 15-minute buffer between blocks for overrun and messages.",
    total > input.hoursPerDay * days.length
      ? "• The workload exceeds the hours available — consider moving low-priority items or renegotiating a deadline."
      : "• The workload fits inside the hours you entered.",
  ].join("\n");

  return simulate(out, 800);
}

/* ------------------------------- Research -------------------------------- */

export interface ResearchInput {
  topic: string;
  question: string;
  context: string;
  length: "Short" | "Standard" | "Detailed";
}

export async function generateResearch(input: ResearchInput): Promise<string> {
  const topic = clean(input.topic) || "the topic";
  const question = clean(input.question) || `What should we understand about ${topic}?`;
  const depth = input.length === "Detailed" ? 5 : input.length === "Standard" ? 4 : 3;

  const insights = [
    `Definitions and scope vary across organisations, so agree on what ${topic} means in your context before comparing sources.`,
    `Most practical guidance on ${topic} separates the underlying principle from the specific tools used to apply it.`,
    `Constraints — budget, time, team capability and policy — usually shape outcomes more than the approach chosen.`,
    `Measurement matters: decide up front what a good result for "${question}" would actually look like.`,
    `Trade-offs are typical: gains in speed or cost often come with added coordination or risk elsewhere.`,
  ].slice(0, depth);

  const out = [
    `RESEARCH BRIEF — ${titleCase(topic)}`,
    `Guiding question: ${question}`,
    input.context ? `Context provided: ${clean(input.context)}` : "",
    "",
    "TOPIC OVERVIEW",
    `${titleCase(topic)} is best approached by first mapping what is already known inside your organisation, then filling gaps with external evidence. This brief is a structured starting point for that work — it organises thinking rather than supplying verified facts.`,
    "",
    "KEY INSIGHTS",
    ...insights.map((i) => `• ${i}`),
    "",
    "IMPORTANT CONSIDERATIONS",
    "• Source quality: prefer primary research, official documentation and peer-reviewed work over summaries.",
    "• Recency: check whether the field has changed materially in the last 12–24 months.",
    "• Bias: note who funded or published a source and what outcome they favour.",
    "• Applicability: evidence from a different sector or company size may not transfer.",
    "",
    "RECOMMENDED NEXT STEPS",
    "1. Write a one-line problem statement and the decision this research must support.",
    "2. Collect three to five credible sources and record what each actually claims.",
    "3. Interview one or two people with direct experience of the problem.",
    "4. Summarise findings against your guiding question and flag remaining unknowns.",
    "",
    "SUGGESTED QUESTIONS FOR FURTHER RESEARCH",
    `• What evidence would change our current view on ${topic}?`,
    "• Which assumptions are we making that have not been tested?",
    "• What has already been tried here, and what was the outcome?",
    "• What is the cost of being wrong, and how would we detect it early?",
    "",
    "VERIFICATION NOTE",
    "This brief contains no citations by design. Nothing above should be treated as a sourced fact — verify each point against reliable, named sources before using it in a decision or document.",
  ]
    .filter(Boolean)
    .join("\n");

  return simulate(out, 1000);
}

/* --------------------------------- Chat ---------------------------------- */

export async function chatReply(message: string, history: number): Promise<string> {
  const m = message.toLowerCase();

  if (/meeting|prepare/.test(m)) {
    return simulate(
      [
        "Here's a simple way to prepare for the meeting:",
        "",
        "**1. Purpose** — write one sentence describing the decision or outcome you need.",
        "**2. Agenda** — three items maximum, each with a time box and an owner.",
        "**3. Pre-read** — share context in advance so the meeting is for discussion, not briefing.",
        "**4. Questions** — list the two hardest questions you might be asked and draft answers.",
        "**5. Close** — reserve the last five minutes for actions, owners and dates.",
        "",
        "Want me to turn your notes into an agenda? Paste them here.",
      ].join("\n"),
    );
  }
  if (/improve|rewrite|message|email|tone/.test(m)) {
    return simulate(
      [
        "Happy to help sharpen it. A quick checklist I'd apply:",
        "",
        "• Lead with the ask or the outcome in the first line.",
        "• Cut hedging (\"just\", \"maybe\", \"I was wondering\").",
        "• One idea per paragraph, and bullets for anything listed.",
        "• End with a specific next step and a date.",
        "",
        "Paste the message and tell me the tone you want, or use the **Email Generator** tool for a full draft.",
      ].join("\n"),
    );
  }
  if (/organis|organiz|workload|prioriti|busy|overwhelm/.test(m)) {
    return simulate(
      [
        "Let's get the workload under control:",
        "",
        "**1.** List everything outstanding — no filtering yet.",
        "**2.** Mark each item as High, Medium or Low based on consequence, not urgency alone.",
        "**3.** Estimate hours honestly, then compare the total to the hours you actually have.",
        "**4.** If it doesn't fit, decide what moves — and tell the affected people early.",
        "",
        "The **Task Planner** tool will build the time blocks for you once you have the list.",
      ].join("\n"),
    );
  }
  if (/brainstorm|idea|project/.test(m)) {
    return simulate(
      [
        "Here are a few angles to start from:",
        "",
        "• **Remove a step** — what part of the current process could disappear entirely?",
        "• **Serve the edge case** — who is currently poorly served, and what would fix that?",
        "• **Shorten the loop** — where does feedback arrive too late to be useful?",
        "• **Reuse an asset** — what do you already have that is underused?",
        "",
        "Tell me the domain and constraints and I'll narrow these down.",
      ].join("\n"),
    );
  }
  if (/explain|what is|how does|concept/.test(m)) {
    return simulate(
      [
        "I can explain it in three layers — plain summary, why it matters at work, and a worked example.",
        "",
        "Give me the exact term or concept and, if useful, the role of the person you'll be explaining it to. I'll match the depth to that audience.",
        "",
        "_Do check anything factual against a reliable source before you pass it on._",
      ].join("\n"),
    );
  }

  return simulate(
    [
      history === 0
        ? "Good question — here's how I'd approach it."
        : "Thanks for the extra detail. Building on that:",
      "",
      `• Clarify the outcome you want from "${clean(message).slice(0, 80)}".`,
      "• Identify who else is affected and what they need to know.",
      "• Break the work into steps small enough to finish in one sitting.",
      "• Decide the first step and when you'll do it.",
      "",
      "Tell me more about the situation and I'll get more specific — or open one of the tools in the sidebar for a structured draft.",
    ].join("\n"),
  );
}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "google/gemini-3.8-flash";
const ENDPOINT = "https://ai.gateway.lovable.dev/v1/chat/completions";

const RESPONSIBLE_AI =
  "Never invent facts, statistics, citations, sources, names, dates or personal details that the user did not provide. " +
  "Clearly frame your output as suggestions rather than verified information. Encourage human review for important workplace decisions.";

interface ChatMsg {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callGateway(messages: ChatMsg[]): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured.");

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("The AI is busy right now. Please try again shortly.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted. Please top up to keep using the AI tools.");
    throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response.");
  return text;
}

/* --------------------------- Meeting summariser --------------------------- */

export const summarizeMeetingFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ notes: z.string().min(20) }).parse(data))
  .handler(async ({ data }) =>
    callGateway([
      {
        role: "system",
        content: [
          "You are a precise meeting-notes analyst. Extract structure ONLY from the notes given.",
          "",
          "Rules:",
          "- An ACTION ITEM is a task somebody must still perform. A DECISION is an agreement or choice already made; a decision must NOT be repeated as an action item unless the notes also state a task arising from it.",
          "- Only list a responsible person when a real person's name or a clearly identified role (e.g. 'the design team', 'Head of Support') is attached to a task. Never treat ordinary words such as 'The', 'We', 'It' as names. If nobody is named for a task, write 'Unassigned'.",
          "- Deadlines/dates must be copied exactly as written in the notes. Never invent or infer dates.",
          "- If a section has nothing in the notes, write '• Not stated in the notes.'",
          "- Do not add advice, commentary or content that is not derived from the notes.",
          RESPONSIBLE_AI,
          "",
          "Output plain text with these exact uppercase headings, in this order, with a blank line between sections:",
          "MEETING SUMMARY (2-4 sentences)",
          "KEY DISCUSSION POINTS (bullets with •)",
          "DECISIONS MADE (bullets with •)",
          "ACTION ITEMS (numbered, format: 'Person — Task — Deadline or No deadline stated')",
          "RESPONSIBLE PEOPLE (bullets with •, each name once)",
          "DEADLINES / DATES (bullets with •, format: 'Date — what is due')",
          "FOLLOW-UP ITEMS (bullets with •, only genuine open items from the notes)",
          "Do not use markdown headings, asterisks or code fences.",
        ].join("\n"),
      },
      { role: "user", content: `Meeting notes:\n\n${data.notes}` },
    ]),
  );

/* ------------------------------- Research -------------------------------- */

export const researchFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        topic: z.string().min(1),
        question: z.string().optional().default(""),
        context: z.string().optional().default(""),
        length: z.enum(["Short", "Standard", "Detailed"]).default("Standard"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const depth =
      data.length === "Short"
        ? "Keep it tight: roughly 250-350 words."
        : data.length === "Detailed"
          ? "Be thorough: roughly 800-1100 words."
          : "Roughly 500-650 words.";

    return callGateway([
      {
        role: "system",
        content: [
          "You are a research analyst. ANSWER the user's actual research question with substantive analysis of the topic itself.",
          "Do NOT give generic advice about how to conduct research, and do not tell the user to gather sources instead of answering.",
          "Discuss the concrete, real-world specifics of the topic: how it works, where it applies, what helps and what goes wrong.",
          RESPONSIBLE_AI,
          "Never fabricate citations, statistics, studies or named sources. Speak in qualitative terms instead of invented numbers.",
          depth,
          "",
          "Output plain text using these uppercase headings, in this order, including only the sections that genuinely fit the topic:",
          "TOPIC OVERVIEW",
          "KEY INSIGHTS",
          "BENEFITS / OPPORTUNITIES (when relevant)",
          "RISKS / CHALLENGES (when relevant)",
          "PRACTICAL APPLICATIONS (when relevant)",
          "IMPORTANT CONSIDERATIONS",
          "RECOMMENDATIONS / NEXT STEPS",
          "QUESTIONS FOR FURTHER RESEARCH",
          "VERIFICATION NOTE (remind the reader this brief contains no citations and that important points must be verified against reliable named sources)",
          "Use • for bullets and numbers for ordered steps. No markdown headings, asterisks or code fences.",
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          `Research topic: ${data.topic}`,
          data.question ? `Research question: ${data.question}` : "",
          data.context ? `Background / context provided by the user: ${data.context}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ]);
  });

/* --------------------------------- Chat ---------------------------------- */

export const chatFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        messages: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string(),
            }),
          )
          .min(1)
          .max(40),
      })
      .parse(data),
  )
  .handler(async ({ data }) =>
    callGateway([
      {
        role: "system",
        content: [
          "You are Workly AI, a workplace productivity assistant.",
          "Before answering, work out the user's actual intent and every constraint they stated — time available, deadline, date, audience, format, length, tools, seniority — and build the answer around those specifics.",
          "Never fall back on a generic template. If the user says they have two hours to prepare a presentation tomorrow, produce an actual two-hour, time-blocked preparation plan for that presentation, not general meeting advice.",
          "Handle presentations, meetings, emails and messages, workload organisation, brainstorming, workplace communication, project planning, professional development and explaining workplace concepts — adapting the shape of the answer to each.",
          "Preserve the user's own dates, deadlines, durations, names and requested formats exactly. If key information is missing, give sensible general suggestions and ask at most one short clarifying question at the end — never invent personal facts about the user, their colleagues or their organisation.",
          RESPONSIBLE_AI,
          "Be concise and practical: short paragraphs, bullets with •, bold key labels with **text**. Aim for under 300 words unless the request clearly needs more.",
        ].join("\n"),
      },
      ...data.messages,
    ]),
  );

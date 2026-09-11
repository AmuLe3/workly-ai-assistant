import { BookOpen, CalendarClock, FileText, Mail, MessagesSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ToolMeta {
  to: "/email" | "/notes" | "/planner" | "/research" | "/chat";
  name: string;
  description: string;
  icon: LucideIcon;
}

export const TOOLS: ToolMeta[] = [
  {
    to: "/email",
    name: "Smart Email Generator",
    description: "Draft polished workplace emails with customizable tone.",
    icon: Mail,
  },
  {
    to: "/notes",
    name: "Meeting Notes Summarizer",
    description: "Turn meeting notes into summaries, decisions and action items.",
    icon: FileText,
  },
  {
    to: "/planner",
    name: "AI Task Planner",
    description: "Organize and prioritize your daily or weekly workload.",
    icon: CalendarClock,
  },
  {
    to: "/research",
    name: "Research Assistant",
    description: "Explore workplace topics and generate structured insights.",
    icon: BookOpen,
  },
  {
    to: "/chat",
    name: "AI Workplace Chat",
    description: "Ask questions and get AI-powered workplace assistance.",
    icon: MessagesSquare,
  },
];

# Workly AI Assistant

Build a complete modern responsive web application called “Workly AI – AI Workplace Productivity Assistant”.

PROJECT PURPOSE:

Workly AI is a single integrated AI-powered productivity platform designed to help professionals, students, small businesses, and teams automate common workplace tasks.

This is ONE application with multiple tools inside one dashboard, not separate websites.

MAIN FEATURES:

1. Smart Email Generator

Create a professional AI email generation tool.

Inputs:

- Recipient / audience

- Email purpose

- Main message or context

- Tone selector:

  - Formal

  - Friendly

  - Professional

  - Persuasive

- Optional additional instructions

Include a “Generate Email” button.

Generated output should contain:

- Suggested subject line

- Email body

- Professional sign-off

Allow the user to:

- Copy the generated email

- Edit the generated output

- Regenerate the response

- Clear the form

Include a small reminder:

“AI-generated content may require human review before sending.”

2. Meeting Notes Summarizer

Allow users to paste long meeting notes or transcripts.

Include a “Summarize Meeting” button.

Generate structured output containing:

- Meeting Summary

- Key Discussion Points

- Decisions Made

- Action Items

- Responsible Person

- Deadlines / Dates

- Follow-up Items

Allow users to copy and edit the generated result.

3. AI Task Planner

Allow users to enter a list of tasks.

Inputs:

- Tasks

- Deadlines

- Priority

- Estimated duration

- Available working hours

Include options for:

- Daily Plan

- Weekly Plan

Generate a practical work schedule.

Separate tasks into:

- High Priority

- Medium Priority

- Low Priority

Display suggested time blocks and task order.

Include a reminder that AI schedules are recommendations and users should adjust them when circumstances change.

4. AI Research Assistant

Allow users to enter:

- Research topic

- Research question

- Background/context

- Desired output length

Generate structured research assistance with:

- Topic Overview

- Key Insights

- Important Considerations

- Recommended Next Steps

- Suggested Questions for Further Research

Clearly state that AI-generated research should be verified using reliable sources.

Do not present fictional references or fabricated citations as real sources.

5. AI Workplace Chat

Create a chatbot-style interface where users can ask workplace productivity questions.

Examples:

- Help me prepare for a meeting

- Improve this professional message

- Help me organise my workload

- Brainstorm project ideas

- Explain a workplace concept

Display user and AI messages in a clean conversational interface.

Include a text input and Send button.

Add quick prompt suggestions above or below the chat input.

DASHBOARD:

Create a modern SaaS-style dashboard.

Use a dark professional visual theme inspired by modern productivity platforms.

Layout:

LEFT SIDEBAR:

- Workly AI logo/name

- Dashboard

- Email Generator

- Notes Summarizer

- Task Planner

- Research

- AI Chat

Keep sidebar visible on desktop.

On mobile, convert sidebar into a collapsible menu.

MAIN DASHBOARD HEADER:

Large welcome card containing:

“Your AI Workplace Assistant”

Subtitle:

“Automate emails, summarize meetings, organize tasks, research smarter, and work more efficiently with AI.”

Buttons:

- Start with Email

- Open AI Chat

PRODUCTIVITY STATS:

Display three attractive statistic cards:

“5 AI Tools”

“Work Smarter”

“Human Review Recommended”

Do not make unsupported claims such as exact hours saved or percentage improvements.

PRODUCTIVITY TOOL CARDS:

Create cards for:

Smart Email Generator

Description:

“Draft polished workplace emails with customizable tone.”

Meeting Notes Summarizer

Description:

“Turn meeting notes into summaries, decisions and action items.”

AI Task Planner

Description:

“Organize and prioritize your daily or weekly workload.”

Research Assistant

Description:

“Explore workplace topics and generate structured insights.”

AI Workplace Chat

Description:

“Ask questions and get AI-powered workplace assistance.”

Each card should have an icon and an “Open Tool” button.

UI / UX REQUIREMENTS:

Use:

- Dark navy/charcoal background

- Purple, pink or coral gradient accents

- Rounded cards

- Soft shadows

- Modern typography

- Clear spacing

- Professional SaaS visual style

- Subtle hover effects

- Smooth transitions

The application must feel professional rather than overly decorative.

Ensure strong contrast and readability.

Make the application fully responsive for:

- Desktop

- Tablet

- Mobile

RESPONSIBLE AI:

Add a small visible notice in the interface:

“AI-generated content may contain errors. Review important information before using or sharing it.”

Create a Responsible AI section or modal explaining:

- Users should review AI-generated content.

- Sensitive or confidential information should not be entered unnecessarily.

- AI output should not replace professional judgment.

- Research information should be verified using reliable sources.

FUNCTIONAL REQUIREMENTS:

All sidebar navigation items must work.

Each tool should open its corresponding page or dashboard section.

Forms must be interactive.

Buttons must visibly respond when clicked.

Generated outputs should appear in clearly separated output panels.

Provide realistic sample AI responses if a live AI API is not connected yet.

Do not leave buttons that appear functional but do nothing.

Use reusable components and maintain a consistent design system across the platform.

TECHNICAL REQUIREMENTS:

Use React and modern frontend development practices.

Structure the project cleanly.

Ensure it can be deployed as a functioning web application.

Prepare the application so a real AI API can be connected later.

Do not expose API keys in frontend code.

Include appropriate loading, empty and error states.

Add icons where helpful.

The finished result should look suitable for a professional project portfolio and assessment.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/070b0919-dfab-4fb2-81da-f4e861c9dd7e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

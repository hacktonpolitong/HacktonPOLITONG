# ADR-0001: MVP Scope

## Status

Accepted for initial setup.

## Context

PilotOps AI is being built as a B2B AI-powered web application for the Shanghai International Hackathon 2026.

The target user is the Head of International Expansion at a Chinese warehouse automation company. The target market for the MVP is Italy, specifically warehouse automation and logistics operations.

The product spec emphasizes that a generic market report is not enough. The useful output is a practical first-pilot strategy: which buyer segment to approach, which concrete Italian target accounts to start from, which warehouse process to pilot, what proof is missing, what objections to expect, and what pilot package to propose.

The team also needs an MVP that is narrow, credible, demoable, and feasible within hackathon constraints.

## Decision

The MVP will focus on generating a Pilot Control Room for the first Italian pilot opportunity.

The MVP includes:

- product intake;
- documentation readiness checklist;
- structured AI analysis engine;
- Italian customer segment recommendation;
- warehouse process recommendation;
- trust gap analysis;
- pilot offer generation;
- buyer objection simulation;
- Target Account Shortlist from a curated target-account database;
- sales pack generation;
- next 7 days action plan.

The MVP will focus on:

- Chinese warehouse automation companies;
- Italian warehouse/logistics buyers;
- first pilot sale strategy;
- curated company shortlist for account prioritization;
- operational workflow selection;
- low-risk pilot packaging;
- structured dashboard output.

The initial implementation should prefer curated/local seed knowledge over broad scraping. The Target Account Shortlist should come from a controlled curated target-account database with company-level public contact paths and role-based outreach. Real-time external research may be added later only if it supports the Pilot Control Room without expanding the scope into a generic research or lead-harvesting platform.

## Consequences

This decision keeps the MVP specific and demoable.

Positive consequences:

- clearer positioning against generic market intelligence tools;
- simpler product story for the hackathon demo;
- narrower AI pipeline;
- more concrete dashboard output;
- easier division of work across docs, AI/data, and frontend.

Tradeoffs:

- the MVP will not provide a complete market-entry program;
- account shortlisting depends on the quality and coverage of the curated dataset;
- compliance output must stay at checklist/readiness level;
- market evidence may be curated rather than fully live;
- future CRM or outreach functionality will require separate design.

## Out of Scope

The MVP will not:

- cover all European countries;
- perform full legal or compliance certification;
- guarantee real sales leads or closed pilots;
- build a full CRM;
- scrape the entire web at scale;
- collect private personal contact data or personal decision-maker emails;
- autonomously send outreach;
- behave as a plain chatbot;
- produce only a long generic report;
- implement robotics simulation;
- validate CE or machinery safety compliance as a legal authority.

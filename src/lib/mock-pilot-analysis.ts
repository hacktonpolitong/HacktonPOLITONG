import { deterministicPilotAnalysis } from "./pilot-analysis-fallback";
import type { ProductProfile } from "./pilot-analysis-types";

export const demoProductProfile: ProductProfile = {
  companyName: "Shenzhen Northstar Mobility",
  productCategory: "AMR robots for internal warehouse transport",
  targetMarket: "Italy",
  description:
    "The NSM-300 moves totes, cartons and small carts between picking, packing and dispatch staging areas. It can start with operator tablet dispatch or CSV task import before deeper WMS integration.",
  benefits: [
    "Reduce manual walking time",
    "Deploy in one warehouse zone before scaling",
    "Avoid full conveyor redesign",
    "Support modular fleet expansion"
  ],
  currentProof: [
    "Technical specifications",
    "API summary",
    "Fictional demo case outline from a similar Chinese fulfilment workflow"
  ],
  documentationStatus:
    "Technical specs and API summary available; CE/safety summary, Italian support model and localized ROI proof still need buyer-ready packaging.",
  pilotAmbition: "Win a 45-day paid pilot with a mid-size Italian 3PL or e-commerce fulfilment warehouse.",
  constraints: [
    "No Italian reference customer",
    "No local maintenance partner identified",
    "Integration should start with operator tablet dispatch or CSV task import",
    "ROI assumptions must be localized to the buyer's route baseline"
  ]
};

export const mockPilotAnalysis = deterministicPilotAnalysis;

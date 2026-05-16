import type { ProductProfile } from "@/lib/pilot-analysis-types";

export type ProductFlags = {
  hasElectricalComponents: boolean;
  hasBattery: boolean;
  hasWireless: boolean;
  hasMovingParts: boolean;
  hasAIOrAutonomy: boolean;
  hasSoftwareOrCloud: boolean;
  intendedForIndustrialUse: boolean;
  intendedForConsumers: boolean;
};

export type ProductTypeConfig = {
  id: string;
  label: string;
  defaultCategory: string;
  defaultFlags: ProductFlags;
  suggestedEvidenceTypes: string[];
  defaultIntendedUse: string;
  defaultCustomerType: "Industrial" | "Logistics" | "Integrator" | "Unknown";
  defaultStage: "Prototype" | "Pilot" | "Sold in China" | "Preparing EU market entry";
};

const conservativeFlags: ProductFlags = {
  hasElectricalComponents: true,
  hasBattery: false,
  hasWireless: false,
  hasMovingParts: false,
  hasAIOrAutonomy: false,
  hasSoftwareOrCloud: false,
  intendedForIndustrialUse: true,
  intendedForConsumers: false
};

export const productTypeConfigs: ProductTypeConfig[] = [
  {
    id: "amr",
    label: "Autonomous Mobile Robot (AMR)",
    defaultCategory: "AMR",
    defaultFlags: {
      hasElectricalComponents: true,
      hasBattery: true,
      hasWireless: true,
      hasMovingParts: true,
      hasAIOrAutonomy: true,
      hasSoftwareOrCloud: true,
      intendedForIndustrialUse: true,
      intendedForConsumers: false
    },
    suggestedEvidenceTypes: ["technical specifications", "CE/safety summary", "battery documentation", "navigation safety file"],
    defaultIntendedUse: "Autonomous material handling in warehouses and logistics centers",
    defaultCustomerType: "Logistics",
    defaultStage: "Pilot"
  },
  {
    id: "agv",
    label: "Automated Guided Vehicle (AGV)",
    defaultCategory: "AGV",
    defaultFlags: {
      ...conservativeFlags,
      hasBattery: true,
      hasWireless: true,
      hasMovingParts: true
    },
    suggestedEvidenceTypes: ["technical specifications", "battery documentation", "route safety notes", "maintenance plan"],
    defaultIntendedUse: "Guided pallet or material movement in industrial warehouses",
    defaultCustomerType: "Industrial",
    defaultStage: "Pilot"
  },
  {
    id: "robotic-picking",
    label: "Robotic Picking System",
    defaultCategory: "picking robot",
    defaultFlags: {
      ...conservativeFlags,
      hasMovingParts: true,
      hasAIOrAutonomy: true,
      hasSoftwareOrCloud: true
    },
    suggestedEvidenceTypes: ["gripper specifications", "vision model notes", "safety file", "throughput test report"],
    defaultIntendedUse: "Automated item picking or piece handling in warehouse operations",
    defaultCustomerType: "Logistics",
    defaultStage: "Pilot"
  },
  {
    id: "robotic-arm",
    label: "Robotic Arm / Manipulator",
    defaultCategory: "picking robot",
    defaultFlags: {
      ...conservativeFlags,
      hasMovingParts: true,
      hasAIOrAutonomy: true,
      hasSoftwareOrCloud: true
    },
    suggestedEvidenceTypes: ["robot arm specifications", "end-effector documentation", "safety enclosure notes", "application video"],
    defaultIntendedUse: "Industrial manipulation, picking, packing, or handling tasks",
    defaultCustomerType: "Industrial",
    defaultStage: "Pilot"
  },
  {
    id: "automated-forklift",
    label: "Automated Forklift / Pallet Mover",
    defaultCategory: "AGV",
    defaultFlags: {
      ...conservativeFlags,
      hasBattery: true,
      hasWireless: true,
      hasMovingParts: true,
      hasAIOrAutonomy: true,
      hasSoftwareOrCloud: true
    },
    suggestedEvidenceTypes: ["load rating", "fork safety notes", "battery file", "route risk assessment"],
    defaultIntendedUse: "Automated pallet movement in warehouses and manufacturing sites",
    defaultCustomerType: "Industrial",
    defaultStage: "Pilot"
  },
  {
    id: "sorting",
    label: "Conveyor or Sorting Automation",
    defaultCategory: "sorting automation",
    defaultFlags: {
      ...conservativeFlags,
      hasMovingParts: true
    },
    suggestedEvidenceTypes: ["throughput test", "conveyor safety summary", "barcode integration notes", "installation plan"],
    defaultIntendedUse: "Conveyor, parcel sorting, or line-side movement in logistics operations",
    defaultCustomerType: "Logistics",
    defaultStage: "Pilot"
  },
  {
    id: "asrs",
    label: "Automated Storage and Retrieval System (AS/RS)",
    defaultCategory: "WMS/orchestration",
    defaultFlags: {
      ...conservativeFlags,
      hasWireless: true,
      hasMovingParts: true,
      hasAIOrAutonomy: true,
      hasSoftwareOrCloud: true
    },
    suggestedEvidenceTypes: ["system architecture", "safety concept", "WMS integration notes", "installation requirements"],
    defaultIntendedUse: "Automated storage and retrieval for warehouse inventory flows",
    defaultCustomerType: "Industrial",
    defaultStage: "Pilot"
  },
  {
    id: "vision-sensor",
    label: "Warehouse Vision / Sensor System",
    defaultCategory: "inventory scanning robot",
    defaultFlags: {
      ...conservativeFlags,
      hasWireless: true,
      hasAIOrAutonomy: true,
      hasSoftwareOrCloud: true
    },
    suggestedEvidenceTypes: ["sensor specifications", "data handling notes", "accuracy report", "IT security summary"],
    defaultIntendedUse: "Inventory scanning, visibility, or quality checks in warehouse environments",
    defaultCustomerType: "Logistics",
    defaultStage: "Pilot"
  },
  {
    id: "fleet-gateway",
    label: "Fleet Management / WMS Hardware Gateway",
    defaultCategory: "WMS/orchestration",
    defaultFlags: {
      ...conservativeFlags,
      hasWireless: true,
      hasSoftwareOrCloud: true
    },
    suggestedEvidenceTypes: ["API documentation", "data security notes", "architecture diagram", "integration checklist"],
    defaultIntendedUse: "Fleet orchestration, WMS handoff, or hardware gateway control for warehouse automation",
    defaultCustomerType: "Integrator",
    defaultStage: "Pilot"
  },
  {
    id: "charging",
    label: "Charging Dock / Battery System",
    defaultCategory: "AGV",
    defaultFlags: {
      ...conservativeFlags,
      hasBattery: true
    },
    suggestedEvidenceTypes: ["battery safety file", "charging specs", "electrical compliance notes", "installation requirements"],
    defaultIntendedUse: "Charging infrastructure or battery management for warehouse automation fleets",
    defaultCustomerType: "Industrial",
    defaultStage: "Pilot"
  },
  {
    id: "iot-tracking",
    label: "Industrial IoT Tracking Device",
    defaultCategory: "WMS/orchestration",
    defaultFlags: {
      ...conservativeFlags,
      hasBattery: true,
      hasWireless: true,
      hasSoftwareOrCloud: true
    },
    suggestedEvidenceTypes: ["radio specifications", "battery file", "data handling notes", "device labels"],
    defaultIntendedUse: "Asset, pallet, or inventory tracking in industrial warehouse operations",
    defaultCustomerType: "Industrial",
    defaultStage: "Pilot"
  },
  {
    id: "safety-lidar",
    label: "Safety Scanner / LiDAR Module",
    defaultCategory: "inventory scanning robot",
    defaultFlags: {
      ...conservativeFlags,
      hasWireless: true,
      hasAIOrAutonomy: true,
      hasSoftwareOrCloud: true
    },
    suggestedEvidenceTypes: ["safety rating", "sensor specifications", "risk assessment", "test report"],
    defaultIntendedUse: "Safety sensing, obstacle detection, or perception for warehouse automation systems",
    defaultCustomerType: "Integrator",
    defaultStage: "Pilot"
  },
  {
    id: "smart-mobility-subsystem",
    label: "Smart Mobility Subsystem",
    defaultCategory: "AMR",
    defaultFlags: {
      ...conservativeFlags,
      hasBattery: true,
      hasWireless: true,
      hasMovingParts: true,
      hasAIOrAutonomy: true,
      hasSoftwareOrCloud: true
    },
    suggestedEvidenceTypes: ["navigation notes", "wireless specs", "safety assumptions", "integration guide"],
    defaultIntendedUse: "Mobility subsystem for warehouse automation, robotics, or guided industrial vehicles",
    defaultCustomerType: "Integrator",
    defaultStage: "Pilot"
  },
  {
    id: "other",
    label: "Other Warehouse Automation Product",
    defaultCategory: "WMS/orchestration",
    defaultFlags: conservativeFlags,
    suggestedEvidenceTypes: ["technical specifications", "EU compliance notes", "product labels", "use-case description"],
    defaultIntendedUse: "Warehouse automation product for industrial or logistics operations",
    defaultCustomerType: "Unknown",
    defaultStage: "Preparing EU market entry"
  }
];

export function getProductTypeConfig(productTypeId: string): ProductTypeConfig {
  return productTypeConfigs.find((config) => config.id === productTypeId) ?? productTypeConfigs[productTypeConfigs.length - 1];
}

export function inferProductFlags(config: ProductTypeConfig, evidenceText: string): ProductFlags {
  const text = evidenceText.toLowerCase();

  return {
    hasElectricalComponents: config.defaultFlags.hasElectricalComponents || hasAny(text, ["electric", "electrical", "voltage", "power"]),
    hasBattery: config.defaultFlags.hasBattery || hasAny(text, ["battery", "lithium", "charging", "charger", "dock"]),
    hasWireless: config.defaultFlags.hasWireless || hasAny(text, ["wi-fi", "wifi", "bluetooth", "wireless", "rf", "5g", "lte"]),
    hasMovingParts: config.defaultFlags.hasMovingParts || hasAny(text, ["robot", "amr", "agv", "motor", "conveyor", "forklift", "axis", "actuator"]),
    hasAIOrAutonomy: config.defaultFlags.hasAIOrAutonomy || hasAny(text, ["ai", "autonomous", "vision", "slam", "navigation", "perception"]),
    hasSoftwareOrCloud: config.defaultFlags.hasSoftwareOrCloud || hasAny(text, ["cloud", "dashboard", "wms", "api", "software", "fleet"]),
    intendedForIndustrialUse: true,
    intendedForConsumers: false
  };
}

export function buildProductProfileFromType(input: {
  companyName: string;
  productName: string;
  productTypeId: string;
  description: string;
  uploadedEvidenceText: string;
}): ProductProfile {
  const config = getProductTypeConfig(input.productTypeId);
  const combinedEvidence = `${config.label} ${input.productName} ${input.description} ${input.uploadedEvidenceText}`;
  const flags = inferProductFlags(config, combinedEvidence);
  const hasChinaSales = hasAny(combinedEvidence.toLowerCase(), ["sold in china", "deployed in china", "chinese customer", "china case"]);
  const currentProof = [
    ...config.suggestedEvidenceTypes.slice(0, 3),
    hasChinaSales ? "Chinese deployment or customer evidence mentioned" : "Supplier evidence uploaded for review"
  ];
  const missingProof = [
    "buyer-ready CE/safety summary",
    "EU support and spare parts plan",
    "localized ROI assumptions",
    "Italian buyer reference or equivalent proof"
  ];

  return {
    companyName: input.companyName.trim(),
    productName: input.productName.trim(),
    productCategory: config.defaultCategory,
    targetMarket: "Italy / European Union",
    description: [
      input.description.trim() || config.defaultIntendedUse,
      `Selected product type: ${config.label}.`,
      `Intended use: ${config.defaultIntendedUse}.`,
      `Inferred product flags: ${formatFlags(flags)}.`
    ].join("\n"),
    benefits: buildDefaultBenefits(config, flags),
    currentProof,
    documentationStatus: `Uploaded evidence will be checked against likely EU buyer expectations. Suggested evidence: ${config.suggestedEvidenceTypes.join(", ")}.`,
    pilotAmbition: `Prepare a buyer-ready EU market-entry pack for a first ${config.defaultStage.toLowerCase()} with an Italian industrial or logistics buyer.`,
    constraints: missingProof
  };
}

function buildDefaultBenefits(config: ProductTypeConfig, flags: ProductFlags) {
  const benefits = [
    `Supports ${config.defaultIntendedUse.toLowerCase()}`,
    "Can be framed as a bounded first-pilot workflow",
    "Converts supplier documentation into buyer-facing proof priorities"
  ];

  if (flags.hasAIOrAutonomy) {
    benefits.push("Highlights autonomy, navigation, or perception claims for EU buyer review");
  }

  if (flags.hasSoftwareOrCloud) {
    benefits.push("Surfaces software, WMS, API, and data-handling questions early");
  }

  return benefits;
}

function formatFlags(flags: ProductFlags) {
  return Object.entries(flags)
    .filter(([, value]) => value)
    .map(([key]) => key.replace(/([A-Z])/g, " $1").replace(/^has /, "").toLowerCase())
    .join(", ");
}

function hasAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

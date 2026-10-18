import { LabTest } from "./labTests";
import { bharatTests } from "./bharatTests";

const dhBaseTests: LabTest[] = [
  // ─── HEALTH PACKAGES ───
  {
    id: "DH-PKG-1",
    name: "DH Health Package 1",
    category: "Health Package",
    testCategory: "Health Package",
    price: 7500,
    discountPrice: 1599,
    turnaroundTime: "24 Hours",
    fastingRequired: true,
    homeCollection: true,
    includedTests: [
      "Glucose Fasting (BSF) (1)",
      "Haemogram (CBC + ESR) (27)",
      "HbA1C (Glycosylated Haemoglobin) (2)",
      "Kidney Function Test (KFT) (12)",
      "Lipid Profile (9)",
      "Iron Profile Test (7)",
      "Thyroid Profile Total (3)",
      "Urine Routine & Microscopic Examination (23)",
      "Vitamin B12/Cyanocobalamin (1)",
      "Vitamin D 25 Hydroxy (1)",
      "Liver Function Test (LFT) (12)"
    ]
  },
  {
    id: "DH-PKG-2",
    name: "DH Health Package 2",
    category: "Health Package",
    testCategory: "Health Package",
    price: 4500,
    discountPrice: 1099,
    turnaroundTime: "12-24 Hours",
    fastingRequired: true,
    homeCollection: true,
    includedTests: [
      "CBC + ESR (26)",
      "Liver Function Test (11)",
      "Kidney Function Test (7)",
      "Lipid Profile (9)",
      "Thyroid Function Test (3)",
      "Fasting Blood Sugar",
      "Iron Profile (4)",
      "HbA1C (Glycosylated Haemoglobin) (2)",
      "Urine Routine & Microscopic Examination (23)"
    ]
  },
  {
    id: "DH-PKG-3",
    name: "DH Health Package 3",
    category: "Health Package",
    testCategory: "Health Package",
    price: 3050,
    discountPrice: 799,
    turnaroundTime: "12 Hours",
    fastingRequired: false,
    homeCollection: true,
    includedTests: [
      "CBC + ESR (26 Tests)",
      "Liver Function Test (11)",
      "Kidney Function Test (7)",
      "Lipid Profile (9)",
      "Thyroid Function Test (3)",
      "Fasting Blood Sugar"
    ]
  },
  {
    id: "DH-PKG-4",
    name: "SWASTH PLUS VITAMIN PANEL",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 2710,
    discountPrice: 1770,
    turnaroundTime: "24 Hours",
    fastingRequired: true,
    homeCollection: true,
    includedTests: ["Vitamin D 25-OH", "Vitamin B12", "Serum Calcium", "Folic Acid"]
  },
  {
    id: "DH-PKG-5",
    name: "FEVER PANEL - ADVANCE",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 3150,
    discountPrice: 1720,
    turnaroundTime: "12 Hours",
    fastingRequired: false,
    homeCollection: true,
    includedTests: ["CBC + ESR", "Dengue NS1 Ag", "Malaria Antigen", "Widal Test", "Urine Routine", "CRP"]
  },
  {
    id: "DH-PKG-6",
    name: "LIVER & KIDNEY PANEL",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 1800,
    discountPrice: 1530,
    turnaroundTime: "24 Hours",
    fastingRequired: true,
    homeCollection: true,
    includedTests: ["Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Uric Acid", "Electrolytes"]
  },

  // ─── ROUTINE & SPECIAL TESTS ───
  {
    id: "DH-101",
    name: "COMPLETE BLOOD COUNT (CBC)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 350,
    discountPrice: 299,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-102",
    name: "HbA1c; GLYCOSYLATED HEMOGLOBIN",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 500,
    discountPrice: 399,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-103",
    name: "THYROID PROFILE TOTAL (T3, T4, TSH)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 650,
    discountPrice: 499,
    turnaroundTime: "Same Day",
    fastingRequired: true,
    homeCollection: true
  },
  {
    id: "DH-104",
    name: "URINE EXAMINATION, ROUTINE (R/E)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 150,
    discountPrice: 120,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-105",
    name: "GLUCOSE, FASTING (BSF)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 100,
    discountPrice: 80,
    turnaroundTime: "Same Day",
    fastingRequired: true,
    homeCollection: true
  },
  {
    id: "DH-106",
    name: "GLUCOSE, POST PRANDIAL (PP), 2 HOURS",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 100,
    discountPrice: 90,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-107",
    name: "LIVER FUNCTION TEST (LFT)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 900,
    discountPrice: 699,
    turnaroundTime: "Same Day",
    fastingRequired: true,
    homeCollection: true
  },
  {
    id: "DH-108",
    name: "KIDNEY FUNCTION TEST (KFT)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 950,
    discountPrice: 749,
    turnaroundTime: "Same Day",
    fastingRequired: true,
    homeCollection: true
  },
  {
    id: "DH-109",
    name: "LIPID PROFILE BASIC",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 1100,
    discountPrice: 799,
    turnaroundTime: "Same Day",
    fastingRequired: true,
    homeCollection: true
  },
  {
    id: "DH-110",
    name: "VITAMIN D 25 - HYDROXY",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 1800,
    discountPrice: 1299,
    turnaroundTime: "24 Hours",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-111",
    name: "VITAMIN B12; CYANOCOBALAMIN",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 1400,
    discountPrice: 999,
    turnaroundTime: "24 Hours",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-112",
    name: "C-REACTIVE PROTEIN (CRP), QUANTITATIVE",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 500,
    discountPrice: 399,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-113",
    name: "ESR (ERYTHROCYTE SEDIMENTATION RATE)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 160,
    discountPrice: 120,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-114",
    name: "CREATININE, SERUM",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 180,
    discountPrice: 140,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-115",
    name: "TSH (THYROID STIMULATING HORMONE)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 250,
    discountPrice: 199,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-116",
    name: "URIC ACID, SERUM",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 200,
    discountPrice: 150,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-117",
    name: "HEMOGLOBIN (Hb)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 130,
    discountPrice: 99,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-118",
    name: "DENGUE FEVER NS1 ANTIGEN, EIA",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 850,
    discountPrice: 650,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-119",
    name: "MALARIA PARASITE / RAPID ANTIGEN",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 200,
    discountPrice: 130,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-120",
    name: "WIDAL TEST (TYPHOID SLIDE/TUBE)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 300,
    discountPrice: 200,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-121",
    name: "SERUM CALCIUM",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 280,
    discountPrice: 200,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-122",
    name: "SERUM ELECTROLYTES (NA, K, CL)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 600,
    discountPrice: 450,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-123",
    name: "IRON PROFILE (IRON, TIBC, % SAT)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 850,
    discountPrice: 599,
    turnaroundTime: "Same Day",
    fastingRequired: true,
    homeCollection: true
  },
  {
    id: "DH-124",
    name: "SERUM FERRITIN",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 700,
    discountPrice: 499,
    turnaroundTime: "24 Hours",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-125",
    name: "BLOOD GROUP ABO & RH TYPING",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 150,
    discountPrice: 100,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-126",
    name: "RA FACTOR (RHEUMATOID ARTHRITIS)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 450,
    discountPrice: 350,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-127",
    name: "BETA HCG, TOTAL (PREGNANCY/MATERNAL)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 800,
    discountPrice: 599,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-128",
    name: "URINE CULTURE & SENSITIVITY",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 950,
    discountPrice: 750,
    turnaroundTime: "48 Hours",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-129",
    name: "PROSTATE SPECIFIC ANTIGEN (PSA) TOTAL",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 800,
    discountPrice: 599,
    turnaroundTime: "24 Hours",
    fastingRequired: false,
    homeCollection: true
  },
  {
    id: "DH-130",
    name: "D-DIMER (QUANTITATIVE)",
    category: "Individual Test",
    testCategory: "Routine & Special",
    price: 1200,
    discountPrice: 899,
    turnaroundTime: "Same Day",
    fastingRequired: false,
    homeCollection: true
  }
];

const existingNames = new Set(dhBaseTests.map(t => t.name.trim().toUpperCase()));

// Bharat Lab tests (strictly ONLY individual tests, no health packages)
const bharatIndividualTests: LabTest[] = bharatTests
  .filter(test => {
    // Strictly exclude health packages
    if (test.category === "Health Package") return false;
    const n = test.name.trim().toUpperCase();
    if (
      n.includes("SWASTH BHARAT") ||
      n.includes("AAROGYA") ||
      n.includes("PACKAGE") ||
      n.includes("PROFILE ADVANCE") ||
      n.includes("CAMP PROFILE")
    ) {
      return false;
    }
    // Avoid duplicate names if already present in Diagnostics Hub
    if (existingNames.has(n)) return false;
    return true;
  })
  .map(test => ({
    id: test.id.startsWith("DH-") ? test.id : `DH-${test.id}`,
    name: test.name,
    category: "Individual Test" as const,
    testCategory: "Routine & Special",
    price: test.price,
    discountPrice: test.discountPrice,
    turnaroundTime: test.turnaroundTime || "Same Day",
    fastingRequired: test.fastingRequired || false,
    homeCollection: true,
    includedTests: test.includedTests
  }));

export const diagnosticsHubTests: LabTest[] = [
  ...dhBaseTests,
  ...bharatIndividualTests
];

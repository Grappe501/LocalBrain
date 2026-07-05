/**
 * OPERATOR-WALKTHROUGH-001 — County Fair scenario fixtures.
 * "Unknown Person → Trusted Relationship"
 */

export const WALKTHROUGH_001_WORKSPACE = "county-fair-walkthrough";

export const EXISTING_CONTACTS = [
  {
    display_name: "Kelly Morgan",
    email: "kelly.morgan@countyfair.example.com",
    tags: ["county:benton", "volunteer"],
  },
  {
    display_name: "Chris Patel",
    email: "chris.patel@countyfair.example.com",
    tags: ["county:benton", "steward"],
  },
] as const;

export const VOTER_JANE_SMITH = {
  county: "Benton",
  last_name: "Smith",
  first_name: "Jane",
  address_line1: "123 Oak Street",
  city: "Springfield",
  state: "MO",
  postal_code: "65801",
  date_of_birth: "1985-06-15",
} as const;

/** Online registration export — includes duplicate Kelly + two new volunteers */
export const COUNTY_FAIR_CSV = [
  "Full Name,Email,Phone,County,Notes",
  "Kelly Morgan,kelly.morgan@countyfair.example.com,555-1001,Benton,Returning volunteer",
  "Alex Rivera,alex.rivera@countyfair.example.com,555-2002,Benton,Phone bank interest",
  "Sam Nguyen,sam.nguyen@countyfair.example.com,555-3003,Benton,Canvassing",
].join("\n");

/** Handwritten sheet — one row at a time in OCR workspace */
export const OCR_JANE_FIELDS = {
  display_name: "Jane Smith",
  county: "Benton",
  notes: "Met at fair booth — check voter roll",
} as const;

/** Person met at fair — manual entry */
export const MANUAL_JORDAN_FIELDS = {
  display_name: "Jordan Lee",
  email: "jordan.lee@fair.example.com",
  phone: "555-4004",
  county: "Benton",
  notes: "County fair conversation — follow up",
} as const;

export const CONTEXT_LABEL = "Benton County Fair 2026";
export const ORG_NAME = "County Fair Volunteer Corps";

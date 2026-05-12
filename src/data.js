// ─── Category palette ──────────────────────────────────────────────────────
export const CAT = {
  Screwdrivers: { c: "#4298f5", bg: "rgba(66,152,245,0.1)",  border: "rgba(66,152,245,0.25)"  },
  Wrenches:     { c: "#f59c42", bg: "rgba(245,156,66,0.1)",  border: "rgba(245,156,66,0.25)"  },
  Pliers:       { c: "#42d29b", bg: "rgba(66,210,155,0.1)",  border: "rgba(66,210,155,0.25)"  },
  Hammers:      { c: "#d25050", bg: "rgba(210,80,80,0.1)",   border: "rgba(210,80,80,0.25)"   },
  Measuring:    { c: "#b464f5", bg: "rgba(180,100,245,0.1)", border: "rgba(180,100,245,0.25)" },
  "Hex Keys":   { c: "#f5d242", bg: "rgba(245,210,66,0.1)",  border: "rgba(245,210,66,0.25)"  },
  Electrical:   { c: "#42d7f5", bg: "rgba(66,215,245,0.1)",  border: "rgba(66,215,245,0.25)"  },
  Cutting:      { c: "#f58242", bg: "rgba(245,130,66,0.1)",  border: "rgba(245,130,66,0.25)"  },
};

// ─── Condition palette ─────────────────────────────────────────────────────
export const COND = {
  Good:            { c: "#28d282", bg: "rgba(40,210,130,0.1)"  },
  Worn:            { c: "#efb932", bg: "rgba(239,185,50,0.1)"  },
  "Needs Service": { c: "#d24141", bg: "rgba(210,65,65,0.12)" },
};

// ─── Demo users ────────────────────────────────────────────────────────────
export const USERS = {
  admin:    { password: "admin123", name: "Admin User",     rfid: "RFID-001" },
  tech01:   { password: "tech2024", name: "Tech Operator",  rfid: "RFID-002" },
  engineer: { password: "eng@hub",  name: "Lead Engineer",  rfid: "RFID-003" },
};

// ─── Tool inventory ────────────────────────────────────────────────────────
export const TOOLS = [
  // Screwdrivers
  { id:  1, name: "Flathead Screwdriver",  category: "Screwdrivers", type: "Flathead",   tray: "A1", size: "5mm",        condition: "Good",         serial: "SD-001" },
  { id:  2, name: "Phillips Screwdriver",  category: "Screwdrivers", type: "Phillips",   tray: "A1", size: "PH2",        condition: "Good",         serial: "SD-002" },
  { id:  3, name: "Phillips Screwdriver",  category: "Screwdrivers", type: "Phillips",   tray: "A1", size: "PH1",        condition: "Worn",         serial: "SD-003" },
  { id:  4, name: "Torx Screwdriver",      category: "Screwdrivers", type: "Torx",       tray: "A2", size: "T20",        condition: "Good",         serial: "SD-004" },
  { id:  5, name: "Torx Screwdriver",      category: "Screwdrivers", type: "Torx",       tray: "A2", size: "T25",        condition: "Good",         serial: "SD-005" },
  { id:  6, name: "Precision Screwdriver", category: "Screwdrivers", type: "Precision",  tray: "A3", size: "1.5mm",      condition: "Good",         serial: "SD-006" },
  { id:  7, name: "Precision Screwdriver", category: "Screwdrivers", type: "Precision",  tray: "A3", size: "2mm",        condition: "Good",         serial: "SD-007" },
  { id:  8, name: "Flathead Screwdriver",  category: "Screwdrivers", type: "Flathead",   tray: "A1", size: "8mm",        condition: "Needs Service",serial: "SD-008" },
  // Wrenches
  { id:  9, name: "Combination Wrench",    category: "Wrenches",     type: "Combination",tray: "B1", size: "10mm",       condition: "Good",         serial: "WR-001" },
  { id: 10, name: "Combination Wrench",    category: "Wrenches",     type: "Combination",tray: "B1", size: "13mm",       condition: "Good",         serial: "WR-002" },
  { id: 11, name: "Combination Wrench",    category: "Wrenches",     type: "Combination",tray: "B1", size: "17mm",       condition: "Good",         serial: "WR-003" },
  { id: 12, name: "Combination Wrench",    category: "Wrenches",     type: "Combination",tray: "B2", size: "19mm",       condition: "Worn",         serial: "WR-004" },
  { id: 13, name: "Adjustable Wrench",     category: "Wrenches",     type: "Adjustable", tray: "B2", size: '8"',         condition: "Good",         serial: "WR-005" },
  { id: 14, name: "Adjustable Wrench",     category: "Wrenches",     type: "Adjustable", tray: "B2", size: '12"',        condition: "Good",         serial: "WR-006" },
  { id: 15, name: "Socket Wrench",         category: "Wrenches",     type: "Socket",     tray: "B3", size: '3/8"',       condition: "Good",         serial: "WR-007" },
  { id: 16, name: "Torque Wrench",         category: "Wrenches",     type: "Torque",     tray: "B4", size: "20-200Nm",   condition: "Good",         serial: "WR-008" },
  // Pliers
  { id: 17, name: "Needle-Nose Pliers",    category: "Pliers",       type: "Needle-Nose",tray: "C1", size: "6 inch",     condition: "Good",         serial: "PL-001" },
  { id: 18, name: "Slip-Joint Pliers",     category: "Pliers",       type: "Slip-Joint", tray: "C1", size: "8 inch",     condition: "Good",         serial: "PL-002" },
  { id: 19, name: "Locking Pliers",        category: "Pliers",       type: "Locking",    tray: "C2", size: "7 inch",     condition: "Good",         serial: "PL-003" },
  { id: 20, name: "Locking Pliers",        category: "Pliers",       type: "Locking",    tray: "C2", size: "10 inch",    condition: "Worn",         serial: "PL-004" },
  { id: 21, name: "Diagonal Cutters",      category: "Pliers",       type: "Cutting",    tray: "C3", size: "6 inch",     condition: "Good",         serial: "PL-005" },
  // Hammers
  { id: 22, name: "Claw Hammer",           category: "Hammers",      type: "Claw",       tray: "D1", size: "16 oz",      condition: "Good",         serial: "HM-001" },
  { id: 23, name: "Claw Hammer",           category: "Hammers",      type: "Claw",       tray: "D1", size: "20 oz",      condition: "Good",         serial: "HM-002" },
  { id: 24, name: "Ball Peen Hammer",      category: "Hammers",      type: "Ball Peen",  tray: "D2", size: "12 oz",      condition: "Good",         serial: "HM-003" },
  { id: 25, name: "Rubber Mallet",         category: "Hammers",      type: "Mallet",     tray: "D2", size: "32 oz",      condition: "Good",         serial: "HM-004" },
  { id: 26, name: "Dead Blow Hammer",      category: "Hammers",      type: "Dead Blow",  tray: "D3", size: "24 oz",      condition: "Needs Service",serial: "HM-005" },
  // Measuring
  { id: 27, name: "Tape Measure",          category: "Measuring",    type: "Tape",       tray: "E1", size: "5m",         condition: "Good",         serial: "MS-001" },
  { id: 28, name: "Tape Measure",          category: "Measuring",    type: "Tape",       tray: "E1", size: "10m",        condition: "Good",         serial: "MS-002" },
  { id: 29, name: "Digital Caliper",       category: "Measuring",    type: "Caliper",    tray: "E2", size: "150mm",      condition: "Good",         serial: "MS-003" },
  { id: 30, name: "Spirit Level",          category: "Measuring",    type: "Level",      tray: "E2", size: "600mm",      condition: "Good",         serial: "MS-004" },
  // Hex Keys
  { id: 31, name: "Allen Key Set",         category: "Hex Keys",     type: "Metric",     tray: "F1", size: "1.5-10mm",   condition: "Good",         serial: "HX-001" },
  { id: 32, name: "Hex Bit Set",           category: "Hex Keys",     type: "Imperial",   tray: "F1", size: '1/16-3/8"',  condition: "Good",         serial: "HX-002" },
  // Electrical
  { id: 33, name: "Multimeter",            category: "Electrical",   type: "Digital",    tray: "G1", size: "Standard",   condition: "Good",         serial: "EL-001" },
  { id: 34, name: "Wire Stripper",         category: "Electrical",   type: "Stripper",   tray: "G1", size: "10-22 AWG",  condition: "Good",         serial: "EL-002" },
  // Cutting
  { id: 35, name: "Utility Knife",         category: "Cutting",      type: "Retractable",tray: "G2", size: "18mm",       condition: "Good",         serial: "CT-001" },
];

export const TOOL_TYPES = [...new Set(TOOLS.map((t) => t.type))].sort();
export const ALL_TRAYS  = [...new Set(TOOLS.map((t) => t.tray))].sort();

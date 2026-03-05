// 80/20 T-Slot Aluminum Extrusion Product Catalog
// Pricing in AUD - Queensland Market 2026

export const PROFILES = {
  '2020': {
    id: '2020',
    name: '20×20 Lite',
    width: 20, // mm
    height: 20,
    pricePerMeter: 18.00,
    maxSafeSpan: 600, // mm without support
    momentOfInertia: 0.69e-8, // m^4 (I for 2020 profile)
    color: '#b8b8b8',
    description: 'Lightweight – ideal for small frames, 3D printer enclosures',
    slotWidth: 6, // mm
    boltSize: 'M5',
  },
  '4040': {
    id: '4040',
    name: '40×40 Standard',
    width: 40,
    height: 40,
    pricePerMeter: 36.00,
    maxSafeSpan: 1200,
    momentOfInertia: 8.08e-8,
    color: '#c0c0c0',
    description: 'The workhorse – desks, sim rigs, lab benches',
    slotWidth: 8,
    boltSize: 'M8',
  },
  '4080': {
    id: '4080',
    name: '40×80 Heavy',
    width: 40,
    height: 80,
    pricePerMeter: 74.25,
    maxSafeSpan: 2000,
    momentOfInertia: 50.46e-8, // on-edge
    color: '#d0d0d0',
    description: 'Heavy duty – engine stands, industrial workbenches',
    slotWidth: 8,
    boltSize: 'M8',
  },
};

export const FINISHES = {
  silver: { id: 'silver', name: 'Clear Anodized (Silver)', multiplier: 1.0 },
  black: { id: 'black', name: 'Black Anodized', multiplier: 1.35 },
};

export const HARDWARE = {
  cornerBracket: {
    name: 'L-Bracket (Cast Aluminum)',
    price: 6.80,
    cost: 2.50,
  },
  tNut: {
    name: 'T-Nut (Drop-In)',
    price: 0.90,
    cost: 0.20,
  },
  bolt: {
    name: 'Button Head Bolt (16mm)',
    price: 0.85,
    cost: 0.18,
  },
  endCap: {
    name: 'Plastic End Cap',
    price: 1.80,
    cost: 0.40,
  },
  gusset: {
    name: 'Corner Gusset (Heavy Duty)',
    price: 9.00,
    cost: 3.20,
  },
};

export const ACCESSORIES = {
  casters: {
    name: 'Heavy Duty Locking Casters (Set of 4)',
    price: 85.00,
    cost: 18.00,
    category: 'mobility',
  },
  levelingFeet: {
    name: 'Levelling Feet (Set of 4)',
    price: 65.00,
    cost: 14.00,
    category: 'mobility',
  },
  cableClips: {
    name: 'Cable Management Clips (Set of 10)',
    price: 19.00,
    cost: 3.00,
    category: 'cable',
  },
  monitorMount: {
    name: 'Monitor Arm Mount',
    price: 120.00,
    cost: 30.00,
    category: 'tech',
  },
  ledStrip: {
    name: 'LED Light Strip (T-Slot Mount)',
    price: 45.00,
    cost: 12.00,
    category: 'lighting',
  },
  pegboardPanel: {
    name: 'Pegboard Back Panel',
    price: 55.00,
    cost: 15.00,
    category: 'storage',
  },
  powerStrip: {
    name: 'T-Slot Power Strip (4 Outlet)',
    price: 68.00,
    cost: 22.00,
    category: 'power',
  },
  pcMount: {
    name: 'Under-Desk PC Mount',
    price: 120.00,
    cost: 30.00,
    category: 'tech',
  },
};

export const CUTTING_FEE = 3.50; // per cut in AUD

export const SHIPPING_TIERS = {
  pickup: { name: 'Free Local Pickup (Yatala / Brendale)', price: 0 },
  seqCourier: { name: 'SEQ Courier (Brisbane / Gold Coast / Sunshine Coast)', price: 45.00 },
  qldRegional: { name: 'QLD Regional (Townsville / Cairns / Mackay)', price: 120.00 },
  national: { name: 'National (Interstate)', price: 180.00 },
};

// Aluminum 6063-T6 material properties
export const MATERIAL = {
  name: 'Aluminum 6063-T6',
  elasticModulus: 69e9, // Pa (69 GPa)
  yieldStrength: 214e6, // Pa
  density: 2700, // kg/m³
};

export const TEMPLATES = {
  executiveDesk: {
    id: 'executiveDesk',
    name: 'Executive Tech Desk',
    icon: '🖥️',
    description: 'Premium standing/sitting desk with cable management',
    category: 'office',
    defaults: { width: 1500, depth: 750, height: 750, profile: '4040' },
  },
  garageWorkbench: {
    id: 'garageWorkbench',
    name: 'Pro Garage Workbench',
    icon: '🔧',
    description: 'Heavy-duty workbench for tools and projects',
    category: 'garage',
    defaults: { width: 1800, depth: 900, height: 900, profile: '4040' },
  },
  labBench: {
    id: 'labBench',
    name: 'Modular Lab Station',
    icon: '🔬',
    description: 'Clean, modular bench for R&D and electronics',
    category: 'lab',
    defaults: { width: 1200, depth: 600, height: 850, profile: '4040' },
  },
  simRig: {
    id: 'simRig',
    name: 'Racing Sim Cockpit',
    icon: '🏎️',
    description: 'Zero-flex racing simulator chassis',
    category: 'gaming',
    defaults: { width: 800, depth: 1400, height: 1000, profile: '4040' },
  },
  compactDesk: {
    id: 'compactDesk',
    name: 'Compact Desk',
    icon: '💻',
    description: 'Space-efficient desk for home offices',
    category: 'office',
    defaults: { width: 1000, depth: 600, height: 750, profile: '4040' },
  },
};

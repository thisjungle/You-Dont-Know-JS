// Q-Slot Workbench Builder — Product Catalog
// Pricing in AUD — Queensland Market 2026

export const PROFILES = {
  '2020': {
    id: '2020',
    name: '20×20 Lite',
    width: 20,
    height: 20,
    pricePerMeter: 18.00,
    maxSafeSpan: 600,
    momentOfInertia: 0.69e-8,
    color: '#b8b8b8',
    description: 'Light shelving and small jigs only',
    slotWidth: 6,
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
    description: 'The workhorse — handles most garage builds',
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
    momentOfInertia: 50.46e-8,
    color: '#d0d0d0',
    description: 'Engine work, welding tables, serious loads',
    slotWidth: 8,
    boltSize: 'M8',
  },
};

export const FINISHES = {
  silver: { id: 'silver', name: 'Clear Anodized (Silver)', multiplier: 1.0 },
  black: { id: 'black', name: 'Black Anodized', multiplier: 1.35 },
};

export const WORKTOPS = {
  mdf: {
    id: 'mdf',
    name: '25mm MDF (Paintable)',
    pricePerSqM: 45.00,
    thickness: 25,
    color: '#c4a882',
    description: 'Cheap, replaceable, easy to drill into',
  },
  plywood: {
    id: 'plywood',
    name: '18mm Marine Plywood',
    pricePerSqM: 85.00,
    thickness: 18,
    color: '#d4b07a',
    description: 'Moisture resistant, great all-rounder',
  },
  butcherBlock: {
    id: 'butcherBlock',
    name: '40mm Hardwood Butcher Block',
    pricePerSqM: 220.00,
    thickness: 40,
    color: '#a0734a',
    description: 'Premium solid timber — looks and feels incredible',
  },
  stainless: {
    id: 'stainless',
    name: '1.5mm Stainless Steel Top',
    pricePerSqM: 310.00,
    thickness: 1.5,
    color: '#b0b8c0',
    description: 'Chemical resistant, easy clean, welding-safe',
  },
  rubberMat: {
    id: 'rubberMat',
    name: '6mm Rubber Workshop Mat',
    pricePerSqM: 55.00,
    thickness: 6,
    color: '#3a3a3a',
    description: 'Anti-fatigue, protects parts, dampens vibration',
  },
};

export const BACK_PANELS = {
  none: {
    id: 'none',
    name: 'No Back Panel',
    pricePerSqM: 0,
    color: null,
    description: 'Open back — wall-mount your own storage',
  },
  pegboard: {
    id: 'pegboard',
    name: 'Steel Pegboard',
    pricePerSqM: 65.00,
    color: '#4a4a5a',
    description: 'Classic tool storage — hang anything',
  },
  slatwall: {
    id: 'slatwall',
    name: 'Aluminium Slat Wall',
    pricePerSqM: 110.00,
    color: '#7a7a8a',
    description: 'Modular hooks, bins, and shelves — fully rearrangeable',
  },
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
    id: 'casters',
    name: 'Heavy Duty Locking Casters (×4)',
    price: 85.00,
    description: 'Roll it around, lock it in place',
    icon: '🛞',
  },
  levelingFeet: {
    id: 'levelingFeet',
    name: 'Levelling Feet with Rubber Pads (×4)',
    price: 65.00,
    description: 'Rock-solid on uneven garage floors',
    icon: '🔩',
  },
  vicePlate: {
    id: 'vicePlate',
    name: 'Vice Mounting Plate (T-Slot)',
    price: 48.00,
    description: 'Bolt any vice straight to the frame — relocatable',
    icon: '🗜️',
  },
  powerStrip: {
    id: 'powerStrip',
    name: 'T-Slot Power Strip (6 Outlet + 2 USB)',
    price: 89.00,
    description: 'Mounts in any T-slot — 10A rated, surge protected',
    icon: '🔌',
  },
  ledBar: {
    id: 'ledBar',
    name: 'LED Work Light Bar (T-Slot Mount)',
    price: 65.00,
    description: '5000K daylight — mounts under overhead shelf or back panel',
    icon: '💡',
  },
  drawerUnit: {
    id: 'drawerUnit',
    name: 'Under-Bench Drawer Unit (3 Drawer)',
    price: 185.00,
    description: 'Steel drawers on ball-bearing slides — bolts to frame',
    icon: '🗄️',
  },
  airHoseReel: {
    id: 'airHoseReel',
    name: 'Retractable Air Hose Reel Mount',
    price: 42.00,
    description: 'T-slot bracket for mounting hose reel under or behind bench',
    icon: '🌀',
  },
  toolHooks: {
    id: 'toolHooks',
    name: 'T-Slot Tool Hook Set (12 pack)',
    price: 36.00,
    description: 'Assorted hooks — spanners, pliers, screwdrivers',
    icon: '🪝',
  },
  magneticStrip: {
    id: 'magneticStrip',
    name: 'Magnetic Tool Strip (600mm)',
    price: 28.00,
    description: 'Strong rare-earth magnets — mounts to back panel frame',
    icon: '🧲',
  },
  cabinetDoors: {
    id: 'cabinetDoors',
    name: 'Undershelf Cabinet Doors (pair)',
    price: 95.00,
    description: 'Close off the lower shelf — keep it tidy',
    icon: '🚪',
  },
};

export const CUTTING_FEE = 3.50;

export const SHIPPING_TIERS = {
  pickup: { name: 'Free Local Pickup (Yatala / Brendale)', price: 0 },
  seqCourier: { name: 'SEQ Courier (Brisbane / Gold Coast / Sunny Coast)', price: 45.00 },
  qldRegional: { name: 'QLD Regional', price: 120.00 },
  national: { name: 'National (Interstate)', price: 180.00 },
};

export const MATERIAL = {
  name: 'Aluminum 6063-T6',
  elasticModulus: 69e9,
  yieldStrength: 214e6,
  density: 2700,
};

export const TEMPLATES = {
  standardBench: {
    id: 'standardBench',
    name: 'Standard Workbench',
    icon: '🔧',
    description: '1.8m all-purpose garage bench',
    defaults: { width: 1800, depth: 750, height: 900, profile: '4040' },
  },
  heavyDuty: {
    id: 'heavyDuty',
    name: 'Heavy Duty Bench',
    icon: '⚙️',
    description: '2.4m for engine work and heavy projects',
    defaults: { width: 2400, depth: 900, height: 900, profile: '4080' },
  },
  compactBench: {
    id: 'compactBench',
    name: 'Compact Bench',
    icon: '📐',
    description: '1.2m for tight garages and sheds',
    defaults: { width: 1200, depth: 600, height: 900, profile: '4040' },
  },
  mobileCart: {
    id: 'mobileCart',
    name: 'Mobile Tool Cart',
    icon: '🛒',
    description: '900mm rolling cart — take it to the job',
    defaults: { width: 900, depth: 600, height: 850, profile: '4040' },
  },
};

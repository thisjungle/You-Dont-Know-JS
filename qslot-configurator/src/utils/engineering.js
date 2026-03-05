// Structural Engineering Calculations for 80/20 T-Slot Extrusions
// Based on Euler-Bernoulli beam theory for 6063-T6 Aluminum

import { PROFILES, MATERIAL, HARDWARE, CUTTING_FEE } from '../data/catalog';

/**
 * Calculate beam deflection (sag) using Euler-Bernoulli beam theory
 * δ = (P × L³) / (48 × E × I)
 *
 * For uniformly distributed load:
 * δ = (5 × w × L⁴) / (384 × E × I)
 *
 * @param {number} lengthMm - Beam span length in mm
 * @param {string} profileId - Profile type ('2020', '4040', '4080')
 * @param {number} loadKg - Point load at center in kg
 * @returns {object} Deflection analysis
 */
export function calculateDeflection(lengthMm, profileId, loadKg = 50, numSupports = 0) {
  const profile = PROFILES[profileId];
  if (!profile) return null;

  // Divide span by number of sections (supports + 1) to get effective beam length
  const sections = numSupports + 1;
  const effectiveLengthMm = lengthMm / sections;

  const L = effectiveLengthMm / 1000; // convert to meters
  const P = loadKg * 9.81; // convert to Newtons
  const E = MATERIAL.elasticModulus;
  const I = profile.momentOfInertia;

  // Point load at center
  const deflection = (P * Math.pow(L, 3)) / (48 * E * I);
  const deflectionMm = deflection * 1000;

  // Safety thresholds
  const maxDeflection = 1.5; // mm
  const warningDeflection = 1.0; // mm

  let status = 'safe';
  let color = '#22c55e'; // green
  let message = 'Structural integrity: Excellent';

  if (deflectionMm > maxDeflection) {
    status = 'danger';
    color = '#ef4444'; // red
    message = `Excessive sag detected (${deflectionMm.toFixed(2)}mm). Add center support or upgrade profile.`;
  } else if (deflectionMm > warningDeflection) {
    status = 'warning';
    color = '#f59e0b'; // amber
    message = `Approaching deflection limit (${deflectionMm.toFixed(2)}mm). Consider adding support.`;
  }

  return {
    deflectionMm: Math.round(deflectionMm * 100) / 100,
    status,
    color,
    message,
    maxSpan: profile.maxSafeSpan,
    needsSupport: deflectionMm > maxDeflection,
    suggestedUpgrade: deflectionMm > maxDeflection ? getSuggestedUpgrade(profileId) : null,
  };
}

export function getSuggestedUpgrade(currentProfile) {
  const upgrades = { '2020': '4040', '4040': '4080', '4080': null };
  return upgrades[currentProfile];
}

/**
 * Returns true if the profile can handle the span safely (with up to 3 auto-supports).
 */
export function isProfileSafeForSpan(profileId, spanMm, loadKg = 50) {
  for (let supports = 0; supports <= 3; supports++) {
    const result = calculateDeflection(spanMm, profileId, loadKg, supports);
    if (result && result.status === 'safe') return true;
  }
  return false;
}

/**
 * Returns the lightest profile that can safely handle the span at the given load.
 */
export function getMinimumSafeProfile(spanMm, loadKg = 50) {
  const profileOrder = ['2020', '4040', '4080'];
  for (const profileId of profileOrder) {
    if (isProfileSafeForSpan(profileId, spanMm, loadKg)) {
      return profileId;
    }
  }
  return '4080'; // heaviest available
}

/**
 * Calculate the number of center supports needed based on span
 * @param {number} spanMm - Total span in mm
 * @param {string} profileId - Profile type
 * @returns {number} Number of center supports needed
 */
export function calculateCenterSupports(spanMm, profileId) {
  const profile = PROFILES[profileId];
  if (!profile) return 0;
  const maxSpan = profile.maxSafeSpan;
  if (spanMm <= maxSpan) return 0;
  return Math.ceil(spanMm / maxSpan) - 1;
}

/**
 * Calculate cut lengths from external dimensions
 * The key insight: external dimensions include the profile width
 *
 * @param {object} dims - { width, depth, height } in mm (external)
 * @param {string} profileId - Profile type
 * @returns {object} Cut list with lengths and quantities
 */
export function calculateCutList(dims, profileId, extraSupports = 0) {
  const profile = PROFILES[profileId];
  const pw = profile.width; // profile width in mm

  // External dimensions to internal beam lengths
  const widthBeamLength = dims.width - (2 * pw);
  const depthBeamLength = dims.depth - (2 * pw);
  const legLength = dims.height; // legs are full height

  // Center supports for width beams (auto-calculated + user-added)
  const widthSupports = calculateCenterSupports(widthBeamLength, profileId) + extraSupports;
  // Center supports for depth beams (auto-calculated only)
  const depthSupports = calculateCenterSupports(depthBeamLength, profileId);

  const cuts = [];

  // Top frame - width beams (front and back)
  cuts.push({
    label: 'Top Rail (Width)',
    length: widthBeamLength,
    quantity: 2,
    direction: 'x',
  });

  // Top frame - depth beams (left and right)
  cuts.push({
    label: 'Top Rail (Depth)',
    length: depthBeamLength,
    quantity: 2,
    direction: 'z',
  });

  // Bottom frame - width beams (front and back)
  cuts.push({
    label: 'Bottom Rail (Width)',
    length: widthBeamLength,
    quantity: 2,
    direction: 'x',
  });

  // Bottom frame - depth beams (left and right)
  cuts.push({
    label: 'Bottom Rail (Depth)',
    length: depthBeamLength,
    quantity: 2,
    direction: 'z',
  });

  // Legs (4 corners)
  cuts.push({
    label: 'Leg',
    length: legLength,
    quantity: 4,
    direction: 'y',
  });

  // Center support legs if needed
  const totalCenterLegs = (widthSupports * 2); // supports on front and back rails
  if (totalCenterLegs > 0) {
    cuts.push({
      label: 'Center Support Leg',
      length: legLength,
      quantity: totalCenterLegs,
      direction: 'y',
    });

    // Center cross beams at support points
    cuts.push({
      label: 'Center Cross Beam',
      length: depthBeamLength,
      quantity: widthSupports,
      direction: 'z',
    });
  }

  return {
    cuts,
    totalCuts: cuts.reduce((sum, c) => sum + c.quantity, 0),
    totalLength: cuts.reduce((sum, c) => sum + (c.length * c.quantity), 0),
    centerSupports: widthSupports,
  };
}

/**
 * Calculate intersections and required hardware
 * Every 90° joint requires: 1 bracket + 2 T-nuts + 2 bolts
 *
 * @param {object} dims - { width, depth, height }
 * @param {string} profileId
 * @returns {object} Hardware bill
 */
export function calculateHardware(dims, profileId, extraSupports = 0) {
  const centerSupports = calculateCenterSupports(
    dims.width - (2 * PROFILES[profileId].width),
    profileId
  ) + extraSupports;

  // Base frame: 4 corners × 2 levels (top/bottom) = 8 corner joints
  // Each corner: 2 joints (one for each direction)
  let intersections = 8 * 2; // 16 for the base rectangular frame

  // Legs connect to top and bottom frames: 4 legs × 2 ends = 8
  intersections += 4 * 2;

  // Center supports: each support leg has 2 connections + cross beams
  if (centerSupports > 0) {
    intersections += centerSupports * 2 * 2; // support legs, top and bottom
    intersections += centerSupports * 2; // cross beam connections
  }

  const sparesMultiplier = 1.1; // 10% spares

  const brackets = intersections;
  const tNuts = Math.ceil(intersections * 2 * sparesMultiplier);
  const bolts = Math.ceil(intersections * 2 * sparesMultiplier);
  const endCaps = 4; // for leg bottoms

  return {
    intersections,
    brackets: { quantity: brackets, unitPrice: HARDWARE.cornerBracket.price },
    tNuts: { quantity: tNuts, unitPrice: HARDWARE.tNut.price },
    bolts: { quantity: bolts, unitPrice: HARDWARE.bolt.price },
    endCaps: { quantity: endCaps, unitPrice: HARDWARE.endCap.price },
    centerSupports,
  };
}

/**
 * Calculate full Bill of Materials with pricing
 */
export function calculateBOM(dims, profileId, finishMultiplier = 1.0, extraSupports = 0) {
  const profile = PROFILES[profileId];
  const cutList = calculateCutList(dims, profileId, extraSupports);
  const hardware = calculateHardware(dims, profileId, extraSupports);

  // Aluminum cost
  const totalMeters = cutList.totalLength / 1000;
  const aluminumCost = totalMeters * profile.pricePerMeter * finishMultiplier;

  // Cutting cost
  const cuttingCost = cutList.totalCuts * CUTTING_FEE;

  // Hardware cost
  const hardwareCost =
    hardware.brackets.quantity * hardware.brackets.unitPrice +
    hardware.tNuts.quantity * hardware.tNuts.unitPrice +
    hardware.bolts.quantity * hardware.bolts.unitPrice +
    hardware.endCaps.quantity * hardware.endCaps.unitPrice;

  const subtotal = aluminumCost + cuttingCost + hardwareCost;
  const gst = subtotal * 0.1; // 10% GST (Australia)
  const total = subtotal + gst;

  return {
    profile: profile.name,
    dimensions: { ...dims },
    cutList,
    hardware,
    pricing: {
      aluminum: Math.round(aluminumCost * 100) / 100,
      cutting: Math.round(cuttingCost * 100) / 100,
      hardware: Math.round(hardwareCost * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      total: Math.round(total * 100) / 100,
    },
  };
}

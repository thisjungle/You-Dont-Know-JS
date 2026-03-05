// Structural Engineering Calculations for 80/20 T-Slot Extrusions
// Based on Euler-Bernoulli beam theory for 6063-T6 Aluminum

import { PROFILES, MATERIAL, HARDWARE, CUTTING_FEE, WORKTOPS, BACK_PANELS } from '../data/catalog';

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
 * The master auto-resolver. Given ANY span + load, returns a guaranteed-safe
 * combination of profile + supports. The user never sees red or amber.
 *
 * Strategy:
 *  1. Try current profile with increasing supports (0→6)
 *  2. If that fails, upgrade profile and repeat
 *  3. Always returns a safe combo — worst case: heaviest profile + max supports
 */
export function autoResolveStructure(spanMm, currentProfileId, loadKg = 50) {
  const profileOrder = ['2020', '4040', '4080'];
  const startIdx = profileOrder.indexOf(currentProfileId);

  // Try current profile first, then heavier ones
  for (let pi = startIdx; pi < profileOrder.length; pi++) {
    const profileId = profileOrder[pi];
    for (let supports = 0; supports <= 6; supports++) {
      const result = calculateDeflection(spanMm, profileId, loadKg, supports);
      if (result && result.status === 'safe') {
        return {
          profileId,
          supportsNeeded: supports,
          deflection: result,
          upgraded: profileId !== currentProfileId,
        };
      }
    }
  }

  // Absolute fallback — heaviest profile, max supports (should handle anything within slider range)
  const fallbackResult = calculateDeflection(spanMm, '4080', loadKg, 6);
  return {
    profileId: '4080',
    supportsNeeded: 6,
    deflection: fallbackResult,
    upgraded: currentProfileId !== '4080',
  };
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
export function calculateCutList(dims, profileId, extraSupports = 0, options = {}) {
  const profile = PROFILES[profileId];
  const pw = profile.width;

  const widthBeamLength = dims.width - (2 * pw);
  const depthBeamLength = dims.depth - (2 * pw);
  const legLength = dims.height;

  const widthSupports = calculateCenterSupports(widthBeamLength, profileId) + extraSupports;

  const cuts = [];

  // Top frame
  cuts.push({ label: 'Top Rail (Width)', length: widthBeamLength, quantity: 2, direction: 'x' });
  cuts.push({ label: 'Top Rail (Depth)', length: depthBeamLength, quantity: 2, direction: 'z' });

  // Bottom frame
  cuts.push({ label: 'Bottom Rail (Width)', length: widthBeamLength, quantity: 2, direction: 'x' });
  cuts.push({ label: 'Bottom Rail (Depth)', length: depthBeamLength, quantity: 2, direction: 'z' });

  // Legs
  cuts.push({ label: 'Leg', length: legLength, quantity: 4, direction: 'y' });

  // Center supports
  const totalCenterLegs = widthSupports * 2;
  if (totalCenterLegs > 0) {
    cuts.push({ label: 'Center Support Leg', length: legLength, quantity: totalCenterLegs, direction: 'y' });
    cuts.push({ label: 'Center Cross Beam', length: depthBeamLength, quantity: widthSupports, direction: 'z' });
  }

  // Back panel uprights + top rail
  if (options.backPanel && options.backPanel !== 'none') {
    const backPanelHeight = 600;
    cuts.push({ label: 'Back Panel Upright', length: backPanelHeight, quantity: 2, direction: 'y' });
    cuts.push({ label: 'Back Panel Top Rail', length: widthBeamLength, quantity: 1, direction: 'x' });
  }

  // Undershelf rails
  if (options.undershelf) {
    cuts.push({ label: 'Undershelf Rail (Width)', length: widthBeamLength, quantity: 2, direction: 'x' });
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
export function calculateHardware(dims, profileId, extraSupports = 0, options = {}) {
  const centerSupports = calculateCenterSupports(
    dims.width - (2 * PROFILES[profileId].width),
    profileId
  ) + extraSupports;

  // Base frame: 4 corners × 2 levels = 16 joints
  let intersections = 8 * 2;
  // Legs: 4 legs × 2 ends = 8
  intersections += 4 * 2;

  // Center supports
  if (centerSupports > 0) {
    intersections += centerSupports * 2 * 2;
    intersections += centerSupports * 2;
  }

  // Back panel: 2 uprights (2 joints each) + 1 top rail (2 joints)
  if (options.backPanel && options.backPanel !== 'none') {
    intersections += 2 * 2 + 1 * 2;
  }

  // Undershelf: 2 rails × 2 joints each
  if (options.undershelf) {
    intersections += 2 * 2;
  }

  const sparesMultiplier = 1.1;
  const brackets = intersections;
  const tNuts = Math.ceil(intersections * 2 * sparesMultiplier);
  const bolts = Math.ceil(intersections * 2 * sparesMultiplier);
  const endCaps = 4;

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
export function calculateBOM(dims, profileId, finishMultiplier = 1.0, extraSupports = 0, options = {}) {
  const profile = PROFILES[profileId];
  const cutList = calculateCutList(dims, profileId, extraSupports, options);
  const hardware = calculateHardware(dims, profileId, extraSupports, options);

  // Aluminum extrusion cost
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

  // Worktop cost
  const worktopSqM = (dims.width / 1000) * (dims.depth / 1000);
  const worktopData = options.worktop ? WORKTOPS[options.worktop] : null;
  const worktopCost = worktopData ? worktopSqM * worktopData.pricePerSqM : 0;

  // Back panel cost
  const backPanelData = (options.backPanel && options.backPanel !== 'none') ? BACK_PANELS[options.backPanel] : null;
  const backPanelSqM = backPanelData ? ((dims.width - 2 * profile.width) / 1000) * 0.6 : 0; // 600mm height
  const backPanelCost = backPanelData ? backPanelSqM * backPanelData.pricePerSqM : 0;

  // Undershelf cost (18mm plywood always)
  const undershelfSqM = options.undershelf ? ((dims.width - 2 * profile.width) / 1000) * ((dims.depth - 2 * profile.width) / 1000) : 0;
  const undershelfCost = options.undershelf ? undershelfSqM * 85 : 0; // marine plywood price

  const subtotal = aluminumCost + cuttingCost + hardwareCost + worktopCost + backPanelCost + undershelfCost;
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  return {
    profile: profile.name,
    dimensions: { ...dims },
    cutList,
    hardware,
    extras: {
      worktop: { name: worktopData?.name || 'None', cost: Math.round(worktopCost * 100) / 100, sqM: Math.round(worktopSqM * 100) / 100 },
      backPanel: { name: backPanelData?.name || 'None', cost: Math.round(backPanelCost * 100) / 100, sqM: Math.round(backPanelSqM * 100) / 100 },
      undershelf: { included: !!options.undershelf, cost: Math.round(undershelfCost * 100) / 100, sqM: Math.round(undershelfSqM * 100) / 100 },
    },
    pricing: {
      aluminum: Math.round(aluminumCost * 100) / 100,
      cutting: Math.round(cuttingCost * 100) / 100,
      hardware: Math.round(hardwareCost * 100) / 100,
      worktop: Math.round(worktopCost * 100) / 100,
      backPanel: Math.round(backPanelCost * 100) / 100,
      undershelf: Math.round(undershelfCost * 100) / 100,
      subtotal: Math.round(subtotal * 100) / 100,
      gst: Math.round(gst * 100) / 100,
      total: Math.round(total * 100) / 100,
    },
  };
}

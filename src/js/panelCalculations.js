/**
 * Panel calculation logic
 * Calculates how many MDF panels are needed for a set of parts
 * Uses simple row-based cutting (no optimization/nesting)
 */

import { PANEL_STOCK, DEFAULTS } from './constants.js';

/**
 * Calculate usable panel dimensions after border discard
 * 
 * @param {number} discardMargin - Border discard margin per side (mm)
 * @returns {Object} - Usable dimensions { width, height }
 */
export function getUsablePanelDimensions(discardMargin = DEFAULTS.PANEL_DISCARD_MARGIN) {
  return {
    width: PANEL_STOCK.WIDTH - (discardMargin * 2),
    height: PANEL_STOCK.HEIGHT - (discardMargin * 2)
  };
}

/**
 * Expand parts list to individual pieces for cutting
 * Each part with quantity > 1 becomes multiple individual pieces
 * 
 * @param {Array} parts - Parts list
 * @returns {Array} - Expanded list of individual pieces
 */
function expandParts(parts) {
  const expanded = [];
  
  for (const part of parts) {
    for (let i = 0; i < part.quantity; i++) {
      expanded.push({
        moduleName: part.moduleName,
        partName: part.partName,
        width: part.width,
        height: part.height,
        thickness: part.thickness
      });
    }
  }
  
  return expanded;
}

/**
 * Group parts by thickness
 * 
 * @param {Array} parts - Parts list
 * @returns {Object} - Parts grouped by thickness
 */
export function groupPartsByThickness(parts) {
  const groups = {};
  
  for (const part of parts) {
    const thickness = part.thickness;
    if (!groups[thickness]) {
      groups[thickness] = [];
    }
    groups[thickness].push(part);
  }
  
  return groups;
}

/**
 * Calculate panels needed for a set of parts of the same thickness
 * Uses Guillotine bin-packing algorithm for better space utilization:
 * - Tracks free rectangles on each panel
 * - Places pieces in best-fitting free rectangle
 * - Splits remaining space after placement
 * - Parts may rotate 90° to fit better
 * 
 * @param {Array} parts - Parts list (same thickness)
 * @param {number} kerfWidth - Kerf width between cuts (mm)
 * @param {number} discardMargin - Border discard margin (mm)
 * @returns {Object} - { panelCount, placements }
 */
export function calculatePanelsForParts(parts, kerfWidth = DEFAULTS.KERF_WIDTH, discardMargin = DEFAULTS.PANEL_DISCARD_MARGIN) {
  if (parts.length === 0) {
    return { panelCount: 0, placements: [] };
  }
  
  // Expand parts to individual pieces
  const pieces = expandParts(parts);
  
  // Get usable dimensions
  const usable = getUsablePanelDimensions(discardMargin);
  
  // Sort pieces by area (descending) for better packing
  const sortedPieces = [...pieces].sort((a, b) => {
    const aArea = a.width * a.height;
    const bArea = b.width * b.height;
    if (bArea !== aArea) return bArea - aArea;
    // Tie-breaker: longer dimension first
    return Math.max(b.width, b.height) - Math.max(a.width, a.height);
  });
  
  // Track panels with their free rectangles
  const panels = [];
  
  for (const piece of sortedPieces) {
    let placed = false;
    
    // Try to fit in existing panels
    for (const panel of panels) {
      if (tryPlacePieceGuillotine(panel, piece, usable, kerfWidth)) {
        placed = true;
        break;
      }
    }
    
    // Need a new panel
    if (!placed) {
      const newPanel = createPanel(usable);
      if (tryPlacePieceGuillotine(newPanel, piece, usable, kerfWidth)) {
        panels.push(newPanel);
      } else {
        // Piece doesn't fit on a fresh panel - it's too large
        console.warn(`Part "${piece.partName}" (${piece.width}x${piece.height}) is too large for panel`);
        const errorPanel = createPanel(usable);
        errorPanel.placements.push({
          ...piece,
          x: 0,
          y: 0,
          rotated: false,
          error: 'Too large for panel'
        });
        panels.push(errorPanel);
      }
    }
  }
  
  // Collect all placements
  const allPlacements = [];
  panels.forEach((panel, index) => {
    panel.placements.forEach(placement => {
      allPlacements.push({
        ...placement,
        panelIndex: index
      });
    });
  });
  
  return {
    panelCount: panels.length,
    placements: allPlacements
  };
}

/**
 * Create a new panel tracking object with guillotine algorithm
 * 
 * @param {Object} usable - Usable panel dimensions
 * @returns {Object} - Panel tracking object
 */
function createPanel(usable) {
  return {
    // Free rectangles available for placement
    freeRects: [{ x: 0, y: 0, width: usable.width, height: usable.height }],
    placements: []
  };
}

/**
 * Try to place a piece on a panel using guillotine algorithm
 * 
 * @param {Object} panel - Panel tracking object
 * @param {Object} piece - Piece to place
 * @param {Object} usable - Usable panel dimensions
 * @param {number} kerfWidth - Kerf width
 * @returns {boolean} - Whether piece was placed
 */
function tryPlacePieceGuillotine(panel, piece, usable, kerfWidth) {
  // Try both orientations
  const orientations = [
    { width: piece.width, height: piece.height, rotated: false },
    { width: piece.height, height: piece.width, rotated: true }
  ];
  
  let bestFit = null;
  let bestFitIndex = -1;
  let bestOrientation = null;
  
  for (const orient of orientations) {
    // Skip if piece doesn't fit panel at all
    if (orient.width > usable.width || orient.height > usable.height) {
      continue;
    }
    
    // Find best fitting free rectangle (Best Short Side Fit)
    for (let i = 0; i < panel.freeRects.length; i++) {
      const rect = panel.freeRects[i];
      
      if (orient.width <= rect.width && orient.height <= rect.height) {
        // Calculate leftover (shorter side is better)
        const leftoverH = rect.width - orient.width;
        const leftoverV = rect.height - orient.height;
        const shortSide = Math.min(leftoverH, leftoverV);
        
        if (bestFit === null || shortSide < bestFit.shortSide) {
          bestFit = { shortSide, rect, x: rect.x, y: rect.y };
          bestFitIndex = i;
          bestOrientation = orient;
        }
      }
    }
  }
  
  if (bestFit === null) {
    return false;
  }
  
  // Place the piece
  panel.placements.push({
    ...piece,
    x: bestFit.x,
    y: bestFit.y,
    rotated: bestOrientation.rotated,
    placedWidth: bestOrientation.width,
    placedHeight: bestOrientation.height
  });
  
  // Split the free rectangle (guillotine split)
  const rect = bestFit.rect;
  const placedW = bestOrientation.width + kerfWidth;
  const placedH = bestOrientation.height + kerfWidth;
  
  // Remove the used rectangle
  panel.freeRects.splice(bestFitIndex, 1);
  
  // Add new free rectangles from the split
  // Right portion (if there's space)
  if (rect.width - placedW > 0) {
    panel.freeRects.push({
      x: rect.x + placedW,
      y: rect.y,
      width: rect.width - placedW,
      height: rect.height
    });
  }
  
  // Bottom portion (if there's space)
  if (rect.height - placedH > 0) {
    panel.freeRects.push({
      x: rect.x,
      y: rect.y + placedH,
      width: bestOrientation.width, // Only up to the placed piece width
      height: rect.height - placedH
    });
  }
  
  // Merge overlapping free rectangles for better utilization
  mergeFreeRects(panel);
  
  return true;
}

/**
 * Merge adjacent free rectangles where possible
 * 
 * @param {Object} panel - Panel tracking object
 */
function mergeFreeRects(panel) {
  // Remove rectangles that are fully contained within others
  for (let i = panel.freeRects.length - 1; i >= 0; i--) {
    for (let j = 0; j < panel.freeRects.length; j++) {
      if (i === j) continue;
      
      const a = panel.freeRects[i];
      const b = panel.freeRects[j];
      
      // Check if a is contained within b
      if (a.x >= b.x && a.y >= b.y && 
          a.x + a.width <= b.x + b.width && 
          a.y + a.height <= b.y + b.height) {
        panel.freeRects.splice(i, 1);
        break;
      }
    }
  }
  
  // Sort by position (top-left first) for consistent placement
  panel.freeRects.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });
}

/**
 * Calculate panels needed for entire project
 * Groups parts by thickness and calculates panels for each group
 * 
 * @param {Array} allParts - All parts in the project
 * @param {Object} settings - Project settings (kerfWidth, panelDiscardMargin, panelPrices)
 * @returns {Object} - Panel requirements by thickness with pricing and usage efficiency
 */
export function calculateProjectPanels(allParts, settings = {}) {
  const kerfWidth = settings.kerfWidth ?? DEFAULTS.KERF_WIDTH;
  const discardMargin = settings.panelDiscardMargin ?? DEFAULTS.PANEL_DISCARD_MARGIN;
  const panelPrices = settings.panelPrices ?? DEFAULTS.PANEL_PRICES;
  
  // Group by thickness
  const groups = groupPartsByThickness(allParts);
  const usable = getUsablePanelDimensions(discardMargin);
  const panelArea = usable.width * usable.height;
  
  // Calculate panels for each thickness
  const results = {};
  let totalPanels = 0;
  let totalCost = 0;
  let totalUsedArea = 0;
  let totalPanelArea = 0;
  
  for (const [thickness, parts] of Object.entries(groups)) {
    const result = calculatePanelsForParts(parts, kerfWidth, discardMargin);
    const price = panelPrices[thickness] || 0;
    
    // Calculate used area for this thickness
    let usedArea = 0;
    for (const placement of result.placements) {
      const w = placement.placedWidth || placement.width;
      const h = placement.placedHeight || placement.height;
      usedArea += w * h;
    }
    
    const thisPanelArea = result.panelCount * panelArea;
    const usagePercent = thisPanelArea > 0 ? (usedArea / thisPanelArea) * 100 : 0;
    
    // Calculate costs based on usage
    const fullPanelCost = result.panelCount * price;
    const proportionalCost = (usedArea / panelArea) * price;
    
    results[thickness] = {
      panelCount: result.panelCount,
      partCount: parts.reduce((sum, p) => sum + p.quantity, 0),
      placements: result.placements,
      pricePerPanel: price,
      cost: fullPanelCost,
      usedArea: usedArea,
      totalPanelArea: thisPanelArea,
      usagePercent: usagePercent,
      proportionalCost: proportionalCost
    };
    
    totalPanels += result.panelCount;
    totalCost += fullPanelCost;
    totalUsedArea += usedArea;
    totalPanelArea += thisPanelArea;
  }
  
  const overallUsagePercent = totalPanelArea > 0 ? (totalUsedArea / totalPanelArea) * 100 : 0;
  const totalProportionalCost = Object.values(results).reduce((sum, r) => sum + r.proportionalCost, 0);
  
  return {
    byThickness: results,
    totalPanels: totalPanels,
    totalCost: totalCost,
    totalProportionalCost: totalProportionalCost,
    totalUsedArea: totalUsedArea,
    totalPanelArea: totalPanelArea,
    overallUsagePercent: overallUsagePercent,
    usableDimensions: usable,
    stockDimensions: { width: PANEL_STOCK.WIDTH, height: PANEL_STOCK.HEIGHT }
  };
}

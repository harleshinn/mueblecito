/**
 * Parts generator
 * Combines cabinet and drawer parts for a complete cut list
 */

import { generateCabinetParts } from './cabinetCalculations.js';
import { generateDrawerParts } from './drawerCalculations.js';

/**
 * Generate all parts for a single module
 * 
 * @param {Object} module - Module piece
 * @returns {Array} - Array of part objects
 */
export function generateModuleParts(module) {
  const parts = [];
  
  // Cabinet box parts
  const cabinetParts = generateCabinetParts(module);
  parts.push(...cabinetParts);
  
  // Drawer parts (if applicable)
  if (module.hasDrawers) {
    const drawerParts = generateDrawerParts(module);
    parts.push(...drawerParts);
  }
  
  return parts;
}

/**
 * Generate all parts for a project
 * 
 * @param {Object} project - Project with modules array
 * @returns {Array} - Array of all part objects
 */
export function generateProjectParts(project) {
  const allParts = [];
  const modules = project.modules || [];
  
  for (const module of modules) {
    // Skip modules not included in calculation
    if (module.includeInCalculation === false) {
      continue;
    }
    const parts = generateModuleParts(module);
    allParts.push(...parts);
  }
  
  return allParts;
}

/**
 * Get parts summary for display
 * Groups parts by thickness and calculates totals
 * 
 * @param {Array} parts - Parts list
 * @returns {Object} - Summary object
 */
export function getPartsSummary(parts) {
  const totalParts = parts.reduce((sum, p) => sum + p.quantity, 0);
  
  // Group by thickness
  const byThickness = {};
  for (const part of parts) {
    const t = part.thickness;
    if (!byThickness[t]) {
      byThickness[t] = { count: 0, area: 0 };
    }
    byThickness[t].count += part.quantity;
    byThickness[t].area += (part.width * part.height * part.quantity);
  }
  
  // Convert area to square meters
  for (const t of Object.keys(byThickness)) {
    byThickness[t].areaSqM = byThickness[t].area / 1000000;
  }
  
  return {
    totalParts,
    byThickness,
    uniquePartTypes: parts.length
  };
}

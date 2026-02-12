/**
 * Drawer calculation logic
 * Calculates dimensions for drawer parts based on module and drawer configuration
 */

import { PART_TYPES, DEFAULTS } from './constants.js';
import { createPart } from './models.js';
import { calculateInternalWidth, calculateInternalDepth } from './cabinetCalculations.js';

/**
 * Calculate drawer internal width
 * Drawer internal width = cabinet internal width - (drawer slide clearance × 2)
 * 
 * @param {Object} module - Module piece
 * @returns {number} - Drawer internal width in mm
 */
export function calculateDrawerInternalWidth(module) {
  const cabinetInternalWidth = calculateInternalWidth(module);
  const slideClearance = module.drawerSlideClearance ?? DEFAULTS.DRAWER_SLIDE_CLEARANCE;
  
  return cabinetInternalWidth - (slideClearance * 2);
}

/**
 * Generate all drawer parts for a module
 * Each drawer has: 2 sides, 1 front, 1 back, 1 bottom
 * Drawers can have individual heights and depths
 * 
 * @param {Object} module - Module piece
 * @returns {Array} - Array of part objects
 */
export function generateDrawerParts(module) {
  if (!module.hasDrawers) {
    return [];
  }
  
  const drawers = module.drawers || [];
  
  if (drawers.length === 0) {
    return [];
  }
  
  const parts = [];
  const moduleQuantity = module.quantity;
  const drawerInternalWidth = calculateDrawerInternalWidth(module);
  const bottomThickness = module.drawerBottomThickness ?? DEFAULTS.DRAWER_BOTTOM_THICKNESS;
  
  // Group drawers by unique dimension combinations to reduce part entries
  const dimensionGroups = new Map();
  
  drawers.forEach(drawer => {
    const faceHeight = drawer.height || DEFAULTS.DRAWER_HEIGHT;
    const boxHeight = drawer.boxHeight || DEFAULTS.DRAWER_BOX_HEIGHT;
    const depth = drawer.depth || calculateInternalDepth(module);
    const key = `${faceHeight}_${boxHeight}_${depth}`;
    
    if (!dimensionGroups.has(key)) {
      dimensionGroups.set(key, { faceHeight, boxHeight, depth, count: 0 });
    }
    dimensionGroups.get(key).count++;
  });
  
  // Generate parts for each dimension group
  let groupIndex = 1;
  for (const [key, group] of dimensionGroups) {
    const { faceHeight, boxHeight, depth, count } = group;
    const totalDrawers = count * moduleQuantity;
    const suffix = dimensionGroups.size > 1 ? ` (${groupIndex})` : '';
    
    // Drawer side panels (2 per drawer)
    // Dimensions: depth × boxHeight
    parts.push(createPart({
      moduleName: module.name,
      partName: PART_TYPES.DRAWER_SIDE + suffix,
      quantity: 2 * totalDrawers,
      width: depth,
      height: boxHeight,
      thickness: module.structuralThickness
    }));
    
    // Drawer front panel (internal) (1 per drawer)
    // This is the front panel of the drawer box, not the visible face
    // Dimensions: internal width × boxHeight
    parts.push(createPart({
      moduleName: module.name,
      partName: PART_TYPES.DRAWER_FRONT + suffix,
      quantity: 1 * totalDrawers,
      width: drawerInternalWidth,
      height: boxHeight,
      thickness: module.structuralThickness
    }));
    
    // Drawer back panel (1 per drawer)
    // This is the back panel of the drawer box
    // Dimensions: internal width × boxHeight
    parts.push(createPart({
      moduleName: module.name,
      partName: PART_TYPES.DRAWER_BACK + suffix,
      quantity: 1 * totalDrawers,
      width: drawerInternalWidth,
      height: boxHeight,
      thickness: module.structuralThickness
    }));
    
    // Drawer bottom (1 per drawer)
    // Dimensions: internal width × depth
    parts.push(createPart({
      moduleName: module.name,
      partName: PART_TYPES.DRAWER_BOTTOM + suffix,
      quantity: 1 * totalDrawers,
      width: drawerInternalWidth,
      height: depth,
      thickness: bottomThickness
    }));
    
    // Drawer face (visible facade) - dimensions depend on drawer front type
    // Inset: fits inside the opening (internal width - gaps)
    // Overlay: covers the full cabinet front width for that drawer area
    const drawerFrontType = module.drawerFrontType || 'overlay';
    const drawerSpacing = module.drawerSpacing ?? DEFAULTS.DRAWER_SPACING;
    let faceWidth, adjustedFaceHeight;
    
    if (drawerFrontType === 'inset') {
      // Inset: face fits inside the cabinet opening between side panels
      faceWidth = calculateInternalWidth(module) - (2 * drawerSpacing);
      adjustedFaceHeight = faceHeight - (2 * drawerSpacing);
    } else {
      // Overlay: face covers the full cabinet width
      faceWidth = module.width;
      adjustedFaceHeight = faceHeight;
    }
    
    const isShaker = module.drawerFrontStyle === 'shaker';
    
    if (isShaker) {
      // Shaker drawer face: stiles + rails + center panel
      const railW = module.drawerShakerRailWidth || DEFAULTS.SHAKER_RAIL_WIDTH;
      const stileW = module.drawerShakerStileWidth || DEFAULTS.SHAKER_STILE_WIDTH;
      const panelThickness = module.drawerShakerPanelThickness || DEFAULTS.SHAKER_PANEL_THICKNESS;
      const tenonDepth = DEFAULTS.SHAKER_TENON_DEPTH;
      
      // Stiles: full face height, stileWidth wide (2 per face)
      parts.push(createPart({
        moduleName: module.name,
        partName: PART_TYPES.DRAWER_FACE_STILE + suffix,
        quantity: 2 * totalDrawers,
        width: stileW,
        height: adjustedFaceHeight,
        thickness: module.structuralThickness
      }));
      
      // Rails: span between stiles (2 per face)
      const railLength = faceWidth - (2 * stileW);
      parts.push(createPart({
        moduleName: module.name,
        partName: PART_TYPES.DRAWER_FACE_RAIL + suffix,
        quantity: 2 * totalDrawers,
        width: railLength,
        height: railW,
        thickness: module.structuralThickness
      }));
      
      // Center panel: fits inside the frame with tenon overlap
      const panelWidth = faceWidth - (2 * stileW) + (2 * tenonDepth);
      const panelHeight = adjustedFaceHeight - (2 * railW) + (2 * tenonDepth);
      parts.push(createPart({
        moduleName: module.name,
        partName: PART_TYPES.DRAWER_FACE_PANEL + suffix,
        quantity: 1 * totalDrawers,
        width: panelWidth,
        height: panelHeight,
        thickness: panelThickness
      }));
    } else {
      // Flat drawer face: single slab panel
      parts.push(createPart({
        moduleName: module.name,
        partName: PART_TYPES.DRAWER_FACE + suffix,
        quantity: 1 * totalDrawers,
        width: faceWidth,
        height: adjustedFaceHeight,
        thickness: module.structuralThickness
      }));
    }
    
    groupIndex++;
  }
  
  return parts;
}

/**
 * Get drawer dimensions summary for display
 * 
 * @param {Object} module - Module piece
 * @returns {Object|null} - Dimension summary or null if no drawers
 */
export function getDrawerDimensionsSummary(module) {
  if (!module.hasDrawers) {
    return null;
  }
  
  const drawers = module.drawers || [];
  if (drawers.length === 0) {
    return null;
  }
  
  return {
    count: drawers.length,
    internalWidth: calculateDrawerInternalWidth(module),
    drawers: drawers,
    bottomThickness: module.drawerBottomThickness ?? DEFAULTS.DRAWER_BOTTOM_THICKNESS
  };
}

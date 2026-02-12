/**
 * Cabinet calculation logic
 * Calculates dimensions for cabinet box parts based on module configuration
 */

import { CABINET_TYPES, BACK_PANEL_TYPES, PART_TYPES, DEFAULTS } from './constants.js';
import { createPart } from './models.js';

/**
 * Calculate the box height for a cabinet
 * Lower cabinets: total height - countertop thickness (if applicable) - leg height
 * Upper cabinets: total height (used directly)
 * 
 * @param {Object} module - Module piece
 * @returns {number} - Box height in mm
 */
export function calculateBoxHeight(module) {
  if (module.type === CABINET_TYPES.UPPER) {
    return module.height;
  }
  
  // Lower cabinet
  const countertopDeduction = module.hasCountertop ? module.countertopThickness : 0;
  return module.height - countertopDeduction - module.legHeight;
}

/**
 * Calculate internal width of the cabinet
 * Internal width = cabinet width - (panel thickness × 2)
 * 
 * @param {Object} module - Module piece
 * @returns {number} - Internal width in mm
 */
export function calculateInternalWidth(module) {
  return module.width - (module.structuralThickness * 2);
}

/**
 * Calculate internal height of the cabinet
 * Accounts for top and bottom panels based on cabinet type and hasTop setting
 * 
 * @param {Object} module - Module piece
 * @returns {number} - Internal height in mm
 */
export function calculateInternalHeight(module) {
  const boxHeight = calculateBoxHeight(module);
  
  if (module.type === CABINET_TYPES.UPPER) {
    // Upper cabinets always have top and bottom panels
    return boxHeight - (module.structuralThickness * 2);
  }
  
  // Lower cabinet - check if it has a top panel
  const hasTop = module.hasTop ?? true;
  const topDeduction = hasTop ? module.structuralThickness : 0;
  return boxHeight - module.structuralThickness - topDeduction; // bottom + optional top
}

/**
 * Calculate internal depth (usually same as cabinet depth)
 * 
 * @param {Object} module - Module piece
 * @returns {number} - Internal depth in mm
 */
export function calculateInternalDepth(module) {
  return module.depth;
}

/**
 * Generate all cabinet box parts for a module
 * 
 * @param {Object} module - Module piece
 * @returns {Array} - Array of part objects
 */
export function generateCabinetParts(module) {
  const parts = [];
  const boxHeight = calculateBoxHeight(module);
  const internalWidth = calculateInternalWidth(module);
  const internalHeight = calculateInternalHeight(module);
  const quantity = module.quantity;
  
  // Side panels (2 per cabinet)
  // Side panel height = box height (for both lower and upper)
  // Side panel width = cabinet depth
  parts.push(createPart({
    moduleName: module.name,
    partName: PART_TYPES.SIDE,
    quantity: 2 * quantity,
    width: module.depth,
    height: boxHeight,
    thickness: module.structuralThickness
  }));
  
  // Top panel - for upper cabinets always, for lower cabinets when hasTop is true
  // Lower cabinets: top panel fits between sides (internal width)
  // Upper cabinets: top panel also fits between sides (internal width)
  const needsTopPanel = module.type === CABINET_TYPES.UPPER || (module.hasTop ?? true);
  if (needsTopPanel) {
    parts.push(createPart({
      moduleName: module.name,
      partName: PART_TYPES.TOP,
      quantity: 1 * quantity,
      width: internalWidth,
      height: module.depth,
      thickness: module.structuralThickness
    }));
  }
  
  // Base/Bottom panel
  // Lower cabinets: base panel is full width (sides sit on top of base)
  // Upper cabinets: bottom panel fits between sides (internal width)
  if (module.type === CABINET_TYPES.LOWER) {
    parts.push(createPart({
      moduleName: module.name,
      partName: PART_TYPES.BASE,
      quantity: 1 * quantity,
      width: module.width,
      height: module.depth,
      thickness: module.structuralThickness
    }));
  } else {
    parts.push(createPart({
      moduleName: module.name,
      partName: PART_TYPES.BOTTOM,
      quantity: 1 * quantity,
      width: internalWidth,
      height: module.depth,
      thickness: module.structuralThickness
    }));
  }
  
  // Back panel (optional)
  if (module.hasBackPanel !== false) {
    const backPart = generateBackPanel(module, boxHeight, internalWidth, internalHeight);
    parts.push(backPart);
  }
  
  // Stretchers
  if (module.hasTopStretcher || module.hasBottomStretcher) {
    const stretcherParts = generateStretchers(module);
    parts.push(...stretcherParts);
  }
  
  // Doors
  if (module.hasDoors) {
    parts.push(...generateDoors(module));
  }
  
  return parts;
}

/**
 * Generate back panel based on configuration
 * 
 * @param {Object} module - Module piece
 * @param {number} boxHeight - Calculated box height
 * @param {number} internalWidth - Internal cabinet width
 * @param {number} internalHeight - Internal cabinet height
 * @returns {Object} - Part object for back panel
 */
function generateBackPanel(module, boxHeight, internalWidth, internalHeight) {
  let width, height;
  
  if (module.backPanelType === BACK_PANEL_TYPES.INSET) {
    // Inset: fits inside the box
    width = internalWidth;
    height = internalHeight;
  } else {
    // External: covers the entire back
    width = module.width;
    height = boxHeight;
  }
  
  return createPart({
    moduleName: module.name,
    partName: PART_TYPES.BACK,
    quantity: 1 * module.quantity,
    width: width,
    height: height,
    thickness: module.backThickness
  });
}

/**
 * Generate stretcher panels (top and/or bottom)
 * Stretchers are horizontal reinforcement panels at front of cabinet
 * They sit inside the box, spanning the internal width between side panels
 * Width: internal cabinet width (spans between side panels)
 * Height: user-configurable stretcher height (vertical dimension)
 * Thickness: determined by structural MDF thickness
 * 
 * @param {Object} module - Module piece
 * @returns {Array} - Array of stretcher parts
 */
function generateStretchers(module) {
  const parts = [];
  const internalWidth = calculateInternalWidth(module);
  const stretcherHeight = module.stretcherHeight || 80;
  
  if (module.hasTopStretcher) {
    parts.push(createPart({
      moduleName: module.name,
      partName: PART_TYPES.STRETCHER_TOP,
      quantity: 1 * module.quantity,
      width: internalWidth,
      height: stretcherHeight,
      thickness: module.structuralThickness
    }));
  }
  
  if (module.hasBottomStretcher) {
    parts.push(createPart({
      moduleName: module.name,
      partName: PART_TYPES.STRETCHER_BOTTOM,
      quantity: 1 * module.quantity,
      width: internalWidth,
      height: stretcherHeight,
      thickness: module.structuralThickness
    }));
  }
  
  return parts;
}

/**
 * Generate door panels
 * Each door has individually configurable width and height
 * Supports flat (slab) and shaker (frame + panel) styles
 * 
 * @param {Object} module - Module piece
 * @returns {Array} - Array of door parts
 */
function generateDoors(module) {
  const parts = [];
  const doors = module.doors || [];
  
  if (doors.length === 0) {
    return parts;
  }
  
  const isShaker = module.doorStyle === 'shaker';
  
  // Group doors by unique dimension combinations to reduce part entries
  const dimensionGroups = new Map();
  
  doors.forEach(door => {
    const width = door.width || 400;
    const height = door.height || 700;
    const key = `${width}_${height}`;
    
    if (!dimensionGroups.has(key)) {
      dimensionGroups.set(key, { width, height, count: 0 });
    }
    dimensionGroups.get(key).count++;
  });
  
  // Generate parts for each dimension group
  let groupIndex = 1;
  for (const [key, group] of dimensionGroups) {
    const { width, height, count } = group;
    const totalDoors = count * module.quantity;
    const suffix = dimensionGroups.size > 1 ? ` (${groupIndex})` : '';
    
    if (isShaker) {
      // Shaker door: stiles + rails + center panel
      const railW = module.shakerRailWidth || DEFAULTS.SHAKER_RAIL_WIDTH;
      const stileW = module.shakerStileWidth || DEFAULTS.SHAKER_STILE_WIDTH;
      const panelThickness = module.shakerPanelThickness || DEFAULTS.SHAKER_PANEL_THICKNESS;
      const tenonDepth = DEFAULTS.SHAKER_TENON_DEPTH;
      
      // Stiles: full door height, stileWidth wide (2 per door)
      parts.push(createPart({
        moduleName: module.name,
        partName: PART_TYPES.DOOR_STILE + suffix,
        quantity: 2 * totalDoors,
        width: stileW,
        height: height,
        thickness: module.structuralThickness
      }));
      
      // Rails: span between stiles, railWidth tall (2 per door)
      const railLength = width - (2 * stileW);
      parts.push(createPart({
        moduleName: module.name,
        partName: PART_TYPES.DOOR_RAIL + suffix,
        quantity: 2 * totalDoors,
        width: railLength,
        height: railW,
        thickness: module.structuralThickness
      }));
      
      // Center panel: fits inside the frame with tenon overlap
      const panelWidth = width - (2 * stileW) + (2 * tenonDepth);
      const panelHeight = height - (2 * railW) + (2 * tenonDepth);
      parts.push(createPart({
        moduleName: module.name,
        partName: PART_TYPES.DOOR_PANEL + suffix,
        quantity: 1 * totalDoors,
        width: panelWidth,
        height: panelHeight,
        thickness: panelThickness
      }));
    } else {
      // Flat door: single slab panel
      parts.push(createPart({
        moduleName: module.name,
        partName: PART_TYPES.DOOR + suffix,
        quantity: totalDoors,
        width: width,
        height: height,
        thickness: module.structuralThickness
      }));
    }
    
    groupIndex++;
  }
  
  return parts;
}

/**
 * Get cabinet dimensions summary for display
 * 
 * @param {Object} module - Module piece
 * @returns {Object} - Dimension summary
 */
export function getCabinetDimensionsSummary(module) {
  return {
    boxHeight: calculateBoxHeight(module),
    internalWidth: calculateInternalWidth(module),
    internalHeight: calculateInternalHeight(module),
    internalDepth: calculateInternalDepth(module)
  };
}

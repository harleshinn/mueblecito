/**
 * Data models for projects, modules, and parts
 */

import { DEFAULTS, CABINET_TYPES, BACK_PANEL_TYPES } from './constants.js';

/**
 * Generate a unique ID
 * @returns {string}
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create a new project with default settings
 * @param {string} name - Project name
 * @returns {Object}
 */
export function createProject(name) {
  return {
    id: generateId(),
    name: name || 'New Project',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      defaultCountertopThickness: DEFAULTS.COUNTERTOP_THICKNESS,
      defaultLegHeight: DEFAULTS.LEG_HEIGHT,
      panelDiscardMargin: DEFAULTS.PANEL_DISCARD_MARGIN,
      kerfWidth: DEFAULTS.KERF_WIDTH,
      drawerSlideClearance: DEFAULTS.DRAWER_SLIDE_CLEARANCE,
      panelPrices: { ...DEFAULTS.PANEL_PRICES }
    },
    modules: []
  };
}

/**
 * Create a new module with default values
 * @param {Object} data - Module data
 * @param {Object} projectSettings - Project settings for defaults
 * @returns {Object}
 */
export function createModule(data, projectSettings = {}) {
  const isLower = data.type === CABINET_TYPES.LOWER;
  
  return {
    id: generateId(),
    name: data.name || 'New Module',
    type: data.type || CABINET_TYPES.LOWER,
    quantity: data.quantity || 1,
    includeInCalculation: data.includeInCalculation ?? true,
    
    // Dimensions
    width: data.width || 600,
    depth: data.depth || 500,
    height: data.height || 850, // Total height
    
    // Lower cabinet specific
    hasCountertop: data.hasCountertop ?? true,
    countertopThickness: data.countertopThickness ?? projectSettings.defaultCountertopThickness ?? DEFAULTS.COUNTERTOP_THICKNESS,
    legHeight: data.legHeight ?? projectSettings.defaultLegHeight ?? DEFAULTS.LEG_HEIGHT,
    
    // Top panel option
    hasTop: data.hasTop ?? true,
    
    // Stretchers
    hasTopStretcher: data.hasTopStretcher ?? false,
    hasBottomStretcher: data.hasBottomStretcher ?? false,
    stretcherHeight: data.stretcherHeight ?? DEFAULTS.STRETCHER_HEIGHT,
    
    // Panel thicknesses
    structuralThickness: data.structuralThickness || DEFAULTS.STRUCTURAL_THICKNESS,
    backThickness: data.backThickness || DEFAULTS.BACK_THICKNESS,
    
    // Back panel configuration
    hasBackPanel: data.hasBackPanel ?? true,
    backPanelType: data.backPanelType || BACK_PANEL_TYPES.INSET,
    
    // Doors - array of individual door configurations
    hasDoors: data.hasDoors ?? false,
    doors: data.doors || [], // Array of { width, height }
    doorGap: data.doorGap ?? 2, // Gap between doors and from edges
    
    // Drawers - array of individual drawer configurations
    hasDrawers: data.hasDrawers || false,
    drawers: data.drawers || [], // Array of { height, depth }
    drawerSlideClearance: data.drawerSlideClearance ?? projectSettings.drawerSlideClearance ?? DEFAULTS.DRAWER_SLIDE_CLEARANCE,
    drawerBottomThickness: data.drawerBottomThickness || DEFAULTS.DRAWER_BOTTOM_THICKNESS,
    drawerSpacing: data.drawerSpacing ?? DEFAULTS.DRAWER_SPACING
  };
}

/**
 * Create a part entry for the parts list
 * @param {Object} data - Part data
 * @returns {Object}
 */
export function createPart(data) {
  return {
    moduleName: data.moduleName,
    partName: data.partName,
    quantity: data.quantity || 1,
    width: data.width,
    height: data.height,
    thickness: data.thickness
  };
}

/**
 * Update project timestamp
 * @param {Object} project 
 * @returns {Object}
 */
export function updateProjectTimestamp(project) {
  return {
    ...project,
    updatedAt: new Date().toISOString()
  };
}

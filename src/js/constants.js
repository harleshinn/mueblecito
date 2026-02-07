/**
 * Application constants and default values
 */

// MDF Panel stock dimensions
export const PANEL_STOCK = {
  WIDTH: 2600,
  HEIGHT: 1830
};

// Supported MDF thicknesses (mm)
export const MDF_THICKNESSES = [18, 5.5, 3];

// Default values
export const DEFAULTS = {
  // Cabinet defaults
  COUNTERTOP_THICKNESS: 0,
  LEG_HEIGHT: 100,
  STRUCTURAL_THICKNESS: 18,
  BACK_THICKNESS: 3,
  // Drawer defaults
  DRAWER_SLIDE_CLEARANCE: 25,
  DRAWER_BOTTOM_THICKNESS: 3,
  DRAWER_HEIGHT: 150,
  DRAWER_BOX_HEIGHT: 120,
  DRAWER_SPACING: 3,
  
  // Stretcher defaults
  STRETCHER_HEIGHT: 80,
  
  // Door defaults
  DOOR_WIDTH: 400,
  DOOR_HEIGHT: 700,
  DOOR_GAP: 2, // Gap between doors for full overlay (mm)
  
  // Panel calculation defaults
  PANEL_DISCARD_MARGIN: 15,
  KERF_WIDTH: 3,
  
  // Pricing defaults (per full panel)
  PANEL_PRICES: {
    18: 0,
    5.5: 0,
    3: 0
  }
};

// Cabinet types
export const CABINET_TYPES = {
  LOWER: 'lower',
  UPPER: 'upper'
};

// Back panel types
export const BACK_PANEL_TYPES = {
  INSET: 'inset',
  EXTERNAL: 'external'
};

// Part types for labeling (translation keys)
export const PART_TYPES = {
  SIDE: 'partType.side',
  TOP: 'partType.top',
  BASE: 'partType.base',
  BOTTOM: 'partType.bottom',
  BACK: 'partType.back',
  DOOR: 'partType.door',
  STRETCHER_TOP: 'partType.stretcherTop',
  STRETCHER_BOTTOM: 'partType.stretcherBottom',
  DRAWER_SIDE: 'partType.drawerSide',
  DRAWER_FRONT: 'partType.drawerFront',
  DRAWER_BACK: 'partType.drawerBack',
  DRAWER_BOTTOM: 'partType.drawerBottom',
  DRAWER_FACE: 'partType.drawerFace'
};

// Local storage keys
export const STORAGE_KEYS = {
  PROJECTS: 'mueblecito_projects'
};

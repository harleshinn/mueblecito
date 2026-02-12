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
  
  // Shaker door defaults
  SHAKER_RAIL_WIDTH: 60,    // Horizontal frame pieces width (mm)
  SHAKER_STILE_WIDTH: 60,   // Vertical frame pieces width (mm)
  SHAKER_PANEL_THICKNESS: 5.5, // Center panel thickness (mm)
  SHAKER_TENON_DEPTH: 10,   // How deep center panel sits into frame groove (mm)
  
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

// Door mounting types
export const DOOR_TYPES = {
  INSET: 'inset',     // Door sits inside the cabinet frame
  OVERLAY: 'overlay'  // Door covers the cabinet frame (full overlay)
};

// Door construction styles
export const DOOR_STYLES = {
  FLAT: 'flat',       // Single slab panel
  SHAKER: 'shaker'   // Frame (stiles + rails) with center panel
};

// Drawer front mounting types (same concept as doors)
export const DRAWER_FRONT_TYPES = {
  INSET: 'inset',     // Drawer face sits inside the cabinet frame
  OVERLAY: 'overlay'  // Drawer face covers the cabinet frame
};

// Drawer front construction styles
export const DRAWER_FRONT_STYLES = {
  FLAT: 'flat',       // Single slab panel
  SHAKER: 'shaker'   // Frame (stiles + rails) with center panel
};

// Part types for labeling (translation keys)
export const PART_TYPES = {
  SIDE: 'partType.side',
  TOP: 'partType.top',
  BASE: 'partType.base',
  BOTTOM: 'partType.bottom',
  BACK: 'partType.back',
  DOOR: 'partType.door',
  DOOR_STILE: 'partType.doorStile',
  DOOR_RAIL: 'partType.doorRail',
  DOOR_PANEL: 'partType.doorPanel',
  STRETCHER_TOP: 'partType.stretcherTop',
  STRETCHER_BOTTOM: 'partType.stretcherBottom',
  DRAWER_SIDE: 'partType.drawerSide',
  DRAWER_FRONT: 'partType.drawerFront',
  DRAWER_BACK: 'partType.drawerBack',
  DRAWER_BOTTOM: 'partType.drawerBottom',
  DRAWER_FACE: 'partType.drawerFace',
  DRAWER_FACE_STILE: 'partType.drawerFaceStile',
  DRAWER_FACE_RAIL: 'partType.drawerFaceRail',
  DRAWER_FACE_PANEL: 'partType.drawerFacePanel'
};

// Local storage keys
export const STORAGE_KEYS = {
  PROJECTS: 'mueblecito_projects'
};

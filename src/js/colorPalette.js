/**
 * Color Palette for 3D Cabinet Rendering
 * Loaded from extracted Sherwin-Williams 2026 Color Catalog (colors.json)
 */

import colorsData from '../data/colors.json';

// Build the SHERWIN_WILLIAMS_COLORS map (name → hex) from JSON data
export const SHERWIN_WILLIAMS_COLORS = Object.fromEntries(
  colorsData.map(c => [`SW ${c.colorNumber} ${c.name}`, c.hex])
);

// Build COLOR_CATEGORIES from colorFamilyNames in the JSON data
export const COLOR_CATEGORIES = (() => {
  const categories = {};
  colorsData.forEach(c => {
    const key = `SW ${c.colorNumber} ${c.name}`;
    (c.colorFamilyNames || []).forEach(family => {
      if (!categories[family]) categories[family] = [];
      if (!categories[family].includes(key)) categories[family].push(key);
    });
  });
  return categories;
})();

// Expose the full color data for advanced lookups (search, filtering, details)
export { colorsData };

// Default color palette for components
export const DEFAULT_COMPONENT_COLORS = {
  cabinet: '#d4a574',    // Wood color
  door: '#93c5fd',       // Light blue
  drawer: '#86efac',     // Light green
  stretcher: '#fcd34d',  // Light orange
  leg: '#c4b5fd',        // Light purple
};

/**
 * Get all colors as a flat array of { name, hex } objects
 */
export function getAllColors() {
  return Object.entries(SHERWIN_WILLIAMS_COLORS).map(([name, hex]) => ({
    name,
    hex
  }));
}

/**
 * Get colors by category
 * @param {string} category - Category name
 * @returns {Array} Array of { name, hex } objects
 */
export function getColorsByCategory(category) {
  const colorNames = COLOR_CATEGORIES[category] || [];
  return colorNames.map(name => ({
    name,
    hex: SHERWIN_WILLIAMS_COLORS[name]
  }));
}

/**
 * Convert hex color to Three.js compatible integer
 * @param {string} hex - Hex color string (e.g., '#ffffff' or 'ffffff')
 * @returns {number} Integer color value
 */
export function hexToInt(hex) {
  const cleanHex = hex.replace('#', '');
  return parseInt(cleanHex, 16);
}

/**
 * Store component colors in localStorage
 * @param {Object} colors - Object with component color mappings
 */
export function saveComponentColors(colors) {
  localStorage.setItem('mueblecito-3d-colors', JSON.stringify(colors));
}

/**
 * Load component colors from localStorage
 * @returns {Object} Component color mappings
 */
export function loadComponentColors() {
  const saved = localStorage.getItem('mueblecito-3d-colors');
  if (saved) {
    try {
      return { ...DEFAULT_COMPONENT_COLORS, ...JSON.parse(saved) };
    } catch {
      return { ...DEFAULT_COMPONENT_COLORS };
    }
  }
  return { ...DEFAULT_COMPONENT_COLORS };
}

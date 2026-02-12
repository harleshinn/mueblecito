/**
 * Module Form UI
 * Handles the module modal form, drawers, and doors
 */

import { CABINET_TYPES, DEFAULTS, DOOR_TYPES } from '../constants.js';
import { getElements } from './elements.js';
import { t } from '../i18n.js';
import { setInnerHTML } from './helpers.js';
import { renderCabinet } from '../cabinetRenderer.js';
import { 
  SHERWIN_WILLIAMS_COLORS, 
  COLOR_CATEGORIES, 
  DEFAULT_COMPONENT_COLORS,
  loadComponentColors,
  saveComponentColors 
} from '../colorPalette.js';

// Store current module for 3D preview re-rendering
let currentPreviewModule = null;
let currentColors = loadComponentColors();

/**
 * Get current color configuration
 */
function getColorConfig() {
  return currentColors;
}

/**
 * Re-render the 3D preview with current settings
 */
function rerenderPreview() {
  if (currentPreviewModule) {
    const container = document.getElementById('module-3d');
    const toggle = document.getElementById('toggle-3d-fill');
    const filled = toggle ? toggle.checked : false;
    renderCabinet(currentPreviewModule, container, { filled, colors: currentColors });
  }
}

/**
 * Build a flat array of all color entries for search
 * Each entry: { name, hex, category }
 */
function buildColorSearchData() {
  const entries = [];
  Object.entries(COLOR_CATEGORIES).forEach(([category, colorNames]) => {
    colorNames.forEach(colorName => {
      const hex = SHERWIN_WILLIAMS_COLORS[colorName];
      if (hex) {
        entries.push({ name: colorName, hex, category });
      }
    });
  });
  // Deduplicate by name (a color may appear in multiple categories)
  const seen = new Set();
  return entries.filter(e => {
    if (seen.has(e.name)) return false;
    seen.add(e.name);
    return true;
  });
}

// Pre-built color search data (built once)
let allColorEntries = null;

function getColorEntries() {
  if (!allColorEntries) {
    allColorEntries = buildColorSearchData();
  }
  return allColorEntries;
}

/**
 * Find a SW color name by its hex value
 */
function findColorNameByHex(hex) {
  const normalizedHex = hex.toLowerCase();
  const entries = getColorEntries();
  const match = entries.find(e => e.hex.toLowerCase() === normalizedHex);
  return match ? match.name : null;
}

/**
 * Update the selected color name label for a component
 */
function updateSelectedColorLabel(component, name, hex) {
  const label = document.getElementById(`color-${component}-selected`);
  if (!label) return;
  
  if (name) {
    label.innerHTML = `<span class="color-swatch-sm" style="background-color:${hex};"></span> ${name}`;
    label.title = `${name} (${hex})`;
  } else {
    label.innerHTML = `<span class="color-swatch-sm" style="background-color:${hex};"></span> ${t('customColor')} (${hex})`;
    label.title = hex;
  }
}

// Track which component the palette modal is selecting for
let paletteTargetComponent = null;

/**
 * Render the color palette swatch grid into the modal body
 * Groups colors by category/family and shows a grid of swatches
 */
function renderPaletteSwatches(filter = '') {
  const body = document.getElementById('color-palette-body');
  const countEl = document.getElementById('color-palette-count');
  if (!body) return;
  
  body.innerHTML = '';
  const query = filter.trim().toLowerCase();
  
  let totalCount = 0;
  
  // Render by category
  Object.entries(COLOR_CATEGORIES).forEach(([category, colorNames]) => {
    const categoryColors = [];
    
    colorNames.forEach(colorName => {
      const hex = SHERWIN_WILLIAMS_COLORS[colorName];
      if (!hex) return;
      
      // Apply search filter
      if (query && !colorName.toLowerCase().includes(query) && !hex.toLowerCase().includes(query) && !category.toLowerCase().includes(query)) {
        return;
      }
      
      categoryColors.push({ name: colorName, hex });
    });
    
    if (categoryColors.length === 0) return;
    
    totalCount += categoryColors.length;
    
    // Category header
    const header = document.createElement('div');
    header.className = 'palette-category-header';
    header.textContent = `${category} (${categoryColors.length})`;
    body.appendChild(header);
    
    // Swatch grid
    const grid = document.createElement('div');
    grid.className = 'palette-swatch-grid';
    
    categoryColors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'palette-swatch';
      swatch.style.backgroundColor = color.hex;
      swatch.title = `${color.name}\n${color.hex}`;
      swatch.dataset.hex = color.hex;
      swatch.dataset.name = color.name;
      
      // Determine text color for contrast
      const c = color.hex.replace('#', '');
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      const isDark = (r * 0.299 + g * 0.587 + b * 0.114) < 140;
      swatch.style.color = isDark ? '#fff' : '#222';
      
      // Show abbreviated label inside swatch
      const shortName = color.name.replace(/^SW \d+ /, '');
      swatch.textContent = shortName;
      
      swatch.addEventListener('click', () => {
        if (!paletteTargetComponent) return;
        const component = paletteTargetComponent;
        
        currentColors[component] = color.hex;
        const colorInput = document.getElementById(`color-${component}`);
        if (colorInput) colorInput.value = color.hex;
        updateSelectedColorLabel(component, color.name, color.hex);
        saveComponentColors(currentColors);
        rerenderPreview();
        closePaletteModal();
      });
      
      grid.appendChild(swatch);
    });
    
    body.appendChild(grid);
  });
  
  if (totalCount === 0) {
    const empty = document.createElement('div');
    empty.className = 'palette-empty';
    empty.textContent = t('noColorsFound');
    body.appendChild(empty);
  }
  
  if (countEl) {
    countEl.textContent = `${totalCount} ${t('colorsShown')}`;
  }
}

/**
 * Open the color palette modal for a specific component
 */
function openPaletteModal(component) {
  paletteTargetComponent = component;
  const modal = document.getElementById('color-palette-modal');
  const forLabel = document.getElementById('color-palette-for');
  const searchInput = document.getElementById('color-palette-search');
  
  if (!modal) return;
  
  // Show which component is being edited
  const componentLabels = {
    cabinet: t('cabinetColor'),
    door: t('doorColor'),
    drawer: t('drawerColor'),
    stretcher: t('stretcherColor'),
    leg: t('legColor')
  };
  if (forLabel) forLabel.textContent = `— ${componentLabels[component] || component}`;
  
  // Clear search and render all
  if (searchInput) {
    searchInput.value = '';
    searchInput.placeholder = t('searchColor');
  }
  
  renderPaletteSwatches();
  modal.classList.remove('hidden');
  
  // Focus the search input
  if (searchInput) searchInput.focus();
}

/**
 * Close the color palette modal
 */
function closePaletteModal() {
  const modal = document.getElementById('color-palette-modal');
  if (modal) modal.classList.add('hidden');
  paletteTargetComponent = null;
}

/**
 * Initialize searchable color pickers for all components
 */
function populateColorPresets() {
  // No-op: palette is rendered on demand
}

/**
 * Initialize color pickers with saved values and browse palette functionality
 */
function initColorPickers() {
  const components = ['cabinet', 'door', 'drawer', 'stretcher', 'leg'];
  
  components.forEach(component => {
    const colorInput = document.getElementById(`color-${component}`);
    
    if (colorInput) {
      colorInput.value = currentColors[component];
      
      colorInput.addEventListener('input', (e) => {
        currentColors[component] = e.target.value;
        const matchedName = findColorNameByHex(e.target.value);
        updateSelectedColorLabel(component, matchedName, e.target.value);
        saveComponentColors(currentColors);
        rerenderPreview();
      });
    }
    
    // Set initial selected color label
    const initialName = findColorNameByHex(currentColors[component]);
    updateSelectedColorLabel(component, initialName, currentColors[component]);
  });
  
  // Browse palette buttons
  document.querySelectorAll('.color-browse-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const component = btn.dataset.component;
      if (component) openPaletteModal(component);
    });
  });
  
  // Palette modal: search input
  const paletteSearch = document.getElementById('color-palette-search');
  if (paletteSearch) {
    let debounceTimer = null;
    paletteSearch.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderPaletteSwatches(paletteSearch.value);
      }, 150);
    });
  }
  
  // Palette modal: close button
  const closeBtn = document.getElementById('btn-close-palette');
  if (closeBtn) {
    closeBtn.addEventListener('click', closePaletteModal);
  }
  
  // Palette modal: backdrop click to close
  const backdrop = document.querySelector('.color-palette-modal__backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closePaletteModal);
  }
}

/**
 * Initialize 3D preview toggle listener
 */
export function init3DPreviewToggle() {
  // Fill toggle
  const toggle = document.getElementById('toggle-3d-fill');
  if (toggle) {
    toggle.addEventListener('change', rerenderPreview);
  }
  
  // Color settings button
  const colorSettingsBtn = document.getElementById('btn-color-settings');
  const colorSettingsPanel = document.getElementById('color-settings-panel');
  
  if (colorSettingsBtn && colorSettingsPanel) {
    colorSettingsBtn.addEventListener('click', () => {
      colorSettingsPanel.classList.toggle('hidden');
    });
  }
  
  // Populate and initialize color pickers
  populateColorPresets();
  initColorPickers();
}

/**
 * Show module modal for adding/editing
 * 
 * @param {Object|null} module - Module to edit, or null for new
 * @param {Object} projectSettings - Project settings for defaults
 */
export function showModuleModal(module = null, projectSettings = {}) {
  const elements = getElements();
  const isEdit = module !== null;
  elements.moduleModalTitle.textContent = isEdit ? t('editModule') : t('addModule');
  
  // Reset form
  elements.moduleForm.reset();
  clearDrawerList();
  clearDoorList();
  
  if (isEdit) {
    elements.moduleId.value = module.id;
    elements.moduleName.value = module.name;
    elements.moduleType.value = module.type;
    elements.moduleQuantity.value = module.quantity;
    elements.moduleWidth.value = module.width;
    elements.moduleDepth.value = module.depth;
    elements.moduleHeight.value = module.height;
    elements.moduleHasCountertop.checked = module.hasCountertop;
    elements.moduleCountertopThickness.value = module.countertopThickness;
    elements.moduleLegHeight.value = module.legHeight;
    elements.moduleHasTop.checked = module.hasTop ?? true;
    elements.moduleHasTopStretcher.checked = module.hasTopStretcher || false;
    elements.moduleHasBottomStretcher.checked = module.hasBottomStretcher || false;
    elements.moduleStretcherHeight.value = module.stretcherHeight ?? DEFAULTS.STRETCHER_HEIGHT;
    elements.moduleStructuralThickness.value = module.structuralThickness;
    elements.moduleBackThickness.value = module.backThickness;
    elements.moduleHasBackPanel.checked = module.hasBackPanel ?? true;
    elements.moduleBackType.value = module.backPanelType;
    elements.moduleHasDoors.checked = module.hasDoors || false;
    elements.moduleDoorType.value = module.doorType || 'overlay';
    elements.moduleDoorStyle.value = module.doorStyle || 'flat';
    elements.moduleShakerRailWidth.value = module.shakerRailWidth ?? DEFAULTS.SHAKER_RAIL_WIDTH;
    elements.moduleShakerStileWidth.value = module.shakerStileWidth ?? DEFAULTS.SHAKER_STILE_WIDTH;
    elements.moduleShakerPanelThickness.value = module.shakerPanelThickness ?? DEFAULTS.SHAKER_PANEL_THICKNESS;
    elements.moduleDoorGap.value = module.doorGap ?? 2;
    elements.moduleHasDrawers.checked = module.hasDrawers;
    elements.moduleDrawerFrontType.value = module.drawerFrontType || 'overlay';
    elements.moduleDrawerFrontStyle.value = module.drawerFrontStyle || 'flat';
    elements.moduleDrawerShakerRailWidth.value = module.drawerShakerRailWidth ?? DEFAULTS.SHAKER_RAIL_WIDTH;
    elements.moduleDrawerShakerStileWidth.value = module.drawerShakerStileWidth ?? DEFAULTS.SHAKER_STILE_WIDTH;
    elements.moduleDrawerShakerPanelThickness.value = module.drawerShakerPanelThickness ?? DEFAULTS.SHAKER_PANEL_THICKNESS;
    elements.moduleDrawerSlideClearance.value = module.drawerSlideClearance ?? DEFAULTS.DRAWER_SLIDE_CLEARANCE;
    elements.moduleDrawerBottomThickness.value = module.drawerBottomThickness || DEFAULTS.DRAWER_BOTTOM_THICKNESS;
    elements.moduleDrawerSpacing.value = module.drawerSpacing ?? DEFAULTS.DRAWER_SPACING;
    
    // Populate door list
    if (module.hasDoors && module.doors && module.doors.length > 0) {
      module.doors.forEach(door => addDoorRow(door.width, door.height));
    }
    
    // Populate drawer list
    if (module.hasDrawers && module.drawers && module.drawers.length > 0) {
      module.drawers.forEach(drawer => addDrawerRow(drawer.height, drawer.depth, drawer.boxHeight));
    }
  } else {
    elements.moduleId.value = '';
    elements.moduleHasCountertop.checked = true;
    elements.moduleCountertopThickness.value = projectSettings.defaultCountertopThickness ?? DEFAULTS.COUNTERTOP_THICKNESS;
    elements.moduleLegHeight.value = projectSettings.defaultLegHeight ?? DEFAULTS.LEG_HEIGHT;
    elements.moduleHasTop.checked = true;
    elements.moduleHasTopStretcher.checked = false;
    elements.moduleHasBottomStretcher.checked = false;
    elements.moduleStretcherHeight.value = DEFAULTS.STRETCHER_HEIGHT;
    elements.moduleHasDoors.checked = false;
    elements.moduleDoorType.value = 'overlay';
    elements.moduleDoorStyle.value = 'flat';
    elements.moduleShakerRailWidth.value = DEFAULTS.SHAKER_RAIL_WIDTH;
    elements.moduleShakerStileWidth.value = DEFAULTS.SHAKER_STILE_WIDTH;
    elements.moduleShakerPanelThickness.value = DEFAULTS.SHAKER_PANEL_THICKNESS;
    elements.moduleDoorGap.value = 2;
    elements.moduleDrawerSlideClearance.value = projectSettings.drawerSlideClearance ?? DEFAULTS.DRAWER_SLIDE_CLEARANCE;
    elements.moduleDrawerSpacing.value = DEFAULTS.DRAWER_SPACING;
    elements.moduleDrawerFrontType.value = 'overlay';
    elements.moduleDrawerFrontStyle.value = 'flat';
    elements.moduleDrawerShakerRailWidth.value = DEFAULTS.SHAKER_RAIL_WIDTH;
    elements.moduleDrawerShakerStileWidth.value = DEFAULTS.SHAKER_STILE_WIDTH;
    elements.moduleDrawerShakerPanelThickness.value = DEFAULTS.SHAKER_PANEL_THICKNESS;
    elements.moduleHasBackPanel.checked = true;
  }
  
  // Update UI based on type
  updateModuleFormForType(elements.moduleType.value);
  updateCountertopOptionsVisibility(elements.moduleHasCountertop.checked);
  updateBackPanelOptionsVisibility(elements.moduleHasBackPanel.checked);
  updateStretcherOptionsVisibility();
  updateDoorOptionsVisibility(elements.moduleHasDoors.checked);
  updateShakerOptionsVisibility();
  updateDrawerOptionsVisibility(elements.moduleHasDrawers.checked);
  updateDrawerShakerOptionsVisibility();
  
  elements.moduleModal.classList.remove('hidden');
  
  // Render 3D preview if editing, after modal is shown
  if (isEdit) {
    currentPreviewModule = module;
    setTimeout(() => {
      const toggle = document.getElementById('toggle-3d-fill');
      const filled = toggle ? toggle.checked : false;
      renderCabinet(module, document.getElementById('module-3d'), { filled, colors: currentColors });
    }, 100); // Small delay to ensure modal is rendered
  } else {
    currentPreviewModule = null;
  }
}

/**
 * Hide module modal
 */
export function hideModuleModal() {
  const elements = getElements();
  elements.moduleModal.classList.add('hidden');
}

/**
 * Update module form based on cabinet type
 * 
 * @param {string} type - Cabinet type
 */
export function updateModuleFormForType(type) {
  const elements = getElements();
  if (type === CABINET_TYPES.LOWER) {
    elements.lowerCabinetOptions.classList.remove('hidden');
  } else {
    elements.lowerCabinetOptions.classList.add('hidden');
  }
}

/**
 * Update countertop options visibility
 * 
 * @param {boolean} hasCountertop - Whether module has countertop
 */
export function updateCountertopOptionsVisibility(hasCountertop) {
  const elements = getElements();
  if (hasCountertop) {
    elements.countertopOptions.classList.remove('hidden');
  } else {
    elements.countertopOptions.classList.add('hidden');
  }
}

/**
 * Update back panel options visibility
 * 
 * @param {boolean} hasBackPanel - Whether module has back panel
 */
export function updateBackPanelOptionsVisibility(hasBackPanel) {
  const elements = getElements();
  if (hasBackPanel) {
    elements.backPanelOptions.classList.remove('hidden');
  } else {
    elements.backPanelOptions.classList.add('hidden');
  }
}

/**
 * Update drawer options visibility
 * 
 * @param {boolean} hasDrawers - Whether module has drawers
 */
export function updateDrawerOptionsVisibility(hasDrawers) {
  const elements = getElements();
  if (hasDrawers) {
    elements.drawerOptions.classList.remove('hidden');
    updateDrawerRemainingHeight();
  } else {
    elements.drawerOptions.classList.add('hidden');
  }
}

/**
 * Calculate available internal height for drawers from form values
 * 
 * @returns {number} - Internal height in mm
 */
function calculateFormInternalHeight() {
  const elements = getElements();
  const type = elements.moduleType.value;
  const height = parseFloat(elements.moduleHeight.value) || 0;
  const structuralThickness = parseFloat(elements.moduleStructuralThickness.value) || DEFAULTS.STRUCTURAL_THICKNESS;
  
  if (type === CABINET_TYPES.UPPER) {
    return height - (structuralThickness * 2);
  }
  
  // Lower cabinet
  const hasCountertop = elements.moduleHasCountertop.checked;
  const countertopThickness = hasCountertop ? (parseFloat(elements.moduleCountertopThickness.value) || 0) : 0;
  const legHeight = parseFloat(elements.moduleLegHeight.value) || DEFAULTS.LEG_HEIGHT;
  const hasTop = elements.moduleHasTop.checked;
  
  const boxHeight = height - countertopThickness - legHeight;
  const topDeduction = hasTop ? structuralThickness : 0;
  
  return boxHeight - structuralThickness - topDeduction;
}

/**
 * Update the remaining height display for drawers
 * Shows how much space is left after accounting for drawer heights and spacing
 */
export function updateDrawerRemainingHeight() {
  const elements = getElements();
  if (!elements.drawerRemainingHeight) return;
  
  const internalHeight = calculateFormInternalHeight();
  const spacing = parseFloat(elements.moduleDrawerSpacing?.value) || DEFAULTS.DRAWER_SPACING;
  
  // Get all drawer heights from the list
  const drawerRows = elements.drawerList.querySelectorAll('.drawer-row');
  let totalDrawerHeight = 0;
  let drawerCount = drawerRows.length;
  
  drawerRows.forEach(row => {
    const height = parseFloat(row.querySelector('.drawer-height').value) || DEFAULTS.DRAWER_HEIGHT;
    totalDrawerHeight += height;
  });
  
  // Add spacing between drawers (n drawers = n+1 spacings: top, between each, bottom)
  const totalSpacing = (drawerCount + 1) * spacing;
  const usedHeight = totalDrawerHeight + totalSpacing;
  const remainingHeight = internalHeight - usedHeight;
  
  // Update display
  if (drawerCount === 0) {
    elements.drawerRemainingHeight.textContent = `${t('availableHeight')}: ${Math.round(internalHeight)} mm`;
    elements.drawerRemainingHeight.className = 'drawer-remaining-height';
  } else if (remainingHeight >= 0) {
    elements.drawerRemainingHeight.textContent = `${t('remainingHeight')}: ${Math.round(remainingHeight)} mm`;
    elements.drawerRemainingHeight.className = 'drawer-remaining-height';
  } else {
    elements.drawerRemainingHeight.textContent = `${t('exceedsHeight')}: ${Math.round(Math.abs(remainingHeight))} mm`;
    elements.drawerRemainingHeight.className = 'drawer-remaining-height drawer-remaining-height--error';
  }
}

/**
 * Update door options visibility
 * 
 * @param {boolean} hasDoors - Whether module has doors
 */
export function updateDoorOptionsVisibility(hasDoors) {
  const elements = getElements();
  if (hasDoors) {
    elements.doorOptions.classList.remove('hidden');
  } else {
    elements.doorOptions.classList.add('hidden');
  }
}

/**
 * Update shaker door options visibility
 * Shows shaker settings only when door style is 'shaker'
 */
export function updateShakerOptionsVisibility() {
  const elements = getElements();
  const isShaker = elements.moduleDoorStyle.value === 'shaker';
  if (isShaker) {
    elements.shakerOptions.classList.remove('hidden');
  } else {
    elements.shakerOptions.classList.add('hidden');
  }
}

/**
 * Update shaker drawer options visibility
 * Shows shaker settings only when drawer front style is 'shaker'
 */
export function updateDrawerShakerOptionsVisibility() {
  const elements = getElements();
  const isShaker = elements.moduleDrawerFrontStyle.value === 'shaker';
  if (isShaker) {
    elements.drawerShakerOptions.classList.remove('hidden');
  } else {
    elements.drawerShakerOptions.classList.add('hidden');
  }
}

/**
 * Update stretcher options visibility
 * Shows the stretcher width field if any stretcher is enabled
 */
export function updateStretcherOptionsVisibility() {
  const elements = getElements();
  const hasAnyStretcher = elements.moduleHasTopStretcher.checked || elements.moduleHasBottomStretcher.checked;
  if (hasAnyStretcher) {
    elements.stretcherOptions.classList.remove('hidden');
  } else {
    elements.stretcherOptions.classList.add('hidden');
  }
}

// ============================================
// DRAWER LIST MANAGEMENT
// ============================================

/**
 * Clear the drawer list
 */
export function clearDrawerList() {
  const elements = getElements();
  elements.drawerList.innerHTML = '';
}

/**
 * Add a drawer row to the drawer list
 * 
 * @param {number|null} height - Drawer face height (optional)
 * @param {number|null} depth - Drawer depth (optional)
 * @param {number|null} boxHeight - Drawer box height (optional)
 */
export function addDrawerRow(height = null, depth = null, boxHeight = null) {
  const elements = getElements();
  const index = elements.drawerList.children.length + 1;
  
  const row = document.createElement('div');
  row.className = 'drawer-row';
  setInnerHTML(row, `
    <span class="drawer-number">${index}</span>
    <div class="drawer-field">
      <label>${t('drawerHeight')}</label>
      <input type="number" class="drawer-height" value="${height || DEFAULTS.DRAWER_HEIGHT}" min="50" step="1">
    </div>
    <div class="drawer-field">
      <label>${t('drawerBoxHeight')}</label>
      <input type="number" class="drawer-box-height" value="${boxHeight || DEFAULTS.DRAWER_BOX_HEIGHT}" min="50" step="1">
    </div>
    <div class="drawer-field">
      <label>${t('drawerDepth')}</label>
      <input type="number" class="drawer-depth" value="${depth || ''}" min="50" step="1" placeholder="${t('auto')}">
    </div>
    <button type="button" class="btn btn-danger btn-small btn-remove-drawer">×</button>
  `);
  
  // Add event listener for height changes to update remaining height
  row.querySelector('.drawer-height').addEventListener('input', updateDrawerRemainingHeight);
  
  // Add remove handler
  row.querySelector('.btn-remove-drawer').addEventListener('click', () => {
    row.remove();
    renumberDrawerRows();
    updateDrawerRemainingHeight();
  });
  
  elements.drawerList.appendChild(row);
  updateDrawerRemainingHeight();
}

/**
 * Renumber drawer rows after removal
 */
function renumberDrawerRows() {
  const elements = getElements();
  const rows = elements.drawerList.querySelectorAll('.drawer-row');
  rows.forEach((row, index) => {
    row.querySelector('.drawer-number').textContent = index + 1;
  });
}

/**
 * Get drawers from the drawer list
 * 
 * @returns {Array} - Array of drawer configurations
 */
export function getDrawersFromList() {
  const elements = getElements();
  const drawers = [];
  const rows = elements.drawerList.querySelectorAll('.drawer-row');
  
  rows.forEach(row => {
    const height = parseFloat(row.querySelector('.drawer-height').value) || DEFAULTS.DRAWER_HEIGHT;
    const boxHeight = parseFloat(row.querySelector('.drawer-box-height').value) || DEFAULTS.DRAWER_BOX_HEIGHT;
    const depthInput = row.querySelector('.drawer-depth').value;
    const depth = depthInput ? parseFloat(depthInput) : null;
    
    drawers.push({ height, boxHeight, depth });
  });
  
  return drawers;
}

// ============================================
// DOOR LIST MANAGEMENT
// ============================================

/**
 * Clear the door list
 */
export function clearDoorList() {
  const elements = getElements();
  elements.doorList.innerHTML = '';
}

/**
 * Calculate the box height for door calculations from form values
 * Mirrors the logic in cabinetCalculations.js
 * 
 * @returns {number} - Box height in mm
 */
function calculateFormBoxHeight() {
  const elements = getElements();
  const type = elements.moduleType.value;
  const height = parseFloat(elements.moduleHeight.value) || 0;
  
  if (type === CABINET_TYPES.UPPER) {
    return height;
  }
  
  // Lower cabinet
  const hasCountertop = elements.moduleHasCountertop.checked;
  const countertopThickness = hasCountertop ? (parseFloat(elements.moduleCountertopThickness.value) || 0) : 0;
  const legHeight = parseFloat(elements.moduleLegHeight.value) || DEFAULTS.LEG_HEIGHT;
  
  return height - countertopThickness - legHeight;
}

/**
 * Calculate recommended door dimensions based on current form values
 * Inset doors formula:
 * - Door height = box height - 2*structural_thickness - 2*gap
 * - Door width = (internal_width - (doorCount + 1) * gap) / doorCount
 * 
 * Overlay (full overlay) doors formula:
 * - Door height = box height (covers entire front)
 * - Door width = (cabinet width - (DOOR_GAP × (doorCount - 1))) / doorCount
 *   (gap only between doors, not on edges)
 * 
 * @param {number} doorCount - Number of doors including the new one
 * @returns {Object} - { width, height }
 */
function calculateDoorDimensions(doorCount) {
  const elements = getElements();
  const cabinetWidth = parseFloat(elements.moduleWidth.value) || 0;
  const boxHeight = calculateFormBoxHeight();
  const structuralThickness = parseFloat(elements.moduleStructuralThickness.value) || DEFAULTS.STRUCTURAL_THICKNESS;
  const doorType = elements.moduleDoorType.value || 'overlay';
  const doorGap = parseFloat(elements.moduleDoorGap.value) || DEFAULTS.DOOR_GAP;
  
  let doorHeight, doorWidth;
  
  if (doorType === 'inset') {
    // Inset: doors fit inside the cabinet opening
    const internalWidth = cabinetWidth - (structuralThickness * 2);
    doorHeight = Math.max(50, boxHeight - (structuralThickness * 2) - (doorGap * 2));
    const totalGaps = (doorCount + 1) * doorGap;
    doorWidth = Math.max(50, Math.round((internalWidth - totalGaps) / doorCount));
  } else {
    // Overlay: doors cover the cabinet frame
    doorHeight = Math.max(50, boxHeight);
    const gapsBetweenDoors = (doorCount - 1) * doorGap;
    doorWidth = Math.max(50, Math.round((cabinetWidth - gapsBetweenDoors) / doorCount));
  }
  
  return { width: doorWidth, height: doorHeight };
}

/**
 * Add a door row to the door list
 * 
 * @param {number|null} width - Door width (optional, auto-calculated if null)
 * @param {number|null} height - Door height (optional, auto-calculated if null)
 */
export function addDoorRow(width = null, height = null) {
  const elements = getElements();
  const index = elements.doorList.children.length + 1;
  
  // Auto-calculate dimensions if not provided
  if (width === null || height === null) {
    const dims = calculateDoorDimensions(index);
    width = width ?? dims.width;
    height = height ?? dims.height;
  }
  
  const row = document.createElement('div');
  row.className = 'door-row';
  setInnerHTML(row, `
    <span class="door-number">${index}</span>
    <div class="door-field">
      <input type="number" class="door-width" value="${width}" min="50" step="1">
    </div>
    <div class="door-field">
      <input type="number" class="door-height" value="${height}" min="50" step="1">
    </div>
    <button type="button" class="btn btn-danger btn-small btn-remove-door">×</button>
  `);
  
  // Add remove handler
  row.querySelector('.btn-remove-door').addEventListener('click', () => {
    row.remove();
    renumberDoorRows();
  });
  
  elements.doorList.appendChild(row);
}

/**
 * Renumber door rows after removal
 */
function renumberDoorRows() {
  const elements = getElements();
  const rows = elements.doorList.querySelectorAll('.door-row');
  rows.forEach((row, index) => {
    row.querySelector('.door-number').textContent = index + 1;
  });
}

/**
 * Get doors from the door list
 * 
 * @returns {Array} - Array of door configurations
 */
export function getDoorsFromList() {
  const elements = getElements();
  const doors = [];
  const rows = elements.doorList.querySelectorAll('.door-row');
  
  rows.forEach(row => {
    const width = parseFloat(row.querySelector('.door-width').value) || DEFAULTS.DOOR_WIDTH;
    const height = parseFloat(row.querySelector('.door-height').value) || DEFAULTS.DOOR_HEIGHT;
    
    doors.push({ width, height });
  });
  
  return doors;
}

// ============================================
// FORM DATA EXTRACTION
// ============================================

/**
 * Get module data from form
 * 
 * @returns {Object} - Module data
 */
export function getModuleFromForm() {
  const elements = getElements();
  const hasDrawers = elements.moduleHasDrawers.checked;
  const hasCountertop = elements.moduleHasCountertop.checked;
  const hasDoors = elements.moduleHasDoors.checked;
  
  return {
    id: elements.moduleId.value || null,
    name: elements.moduleName.value.trim(),
    type: elements.moduleType.value,
    quantity: parseInt(elements.moduleQuantity.value) || 1,
    width: parseFloat(elements.moduleWidth.value) || 0,
    depth: parseFloat(elements.moduleDepth.value) || 0,
    height: parseFloat(elements.moduleHeight.value) || 0,
    hasCountertop: hasCountertop,
    countertopThickness: hasCountertop ? parseFloat(elements.moduleCountertopThickness.value) || DEFAULTS.COUNTERTOP_THICKNESS : 0,
    legHeight: parseFloat(elements.moduleLegHeight.value) || DEFAULTS.LEG_HEIGHT,
    hasTop: elements.moduleHasTop.checked,
    hasTopStretcher: elements.moduleHasTopStretcher.checked,
    hasBottomStretcher: elements.moduleHasBottomStretcher.checked,
    stretcherHeight: parseFloat(elements.moduleStretcherHeight.value) || DEFAULTS.STRETCHER_HEIGHT,
    structuralThickness: parseFloat(elements.moduleStructuralThickness.value) || DEFAULTS.STRUCTURAL_THICKNESS,
    backThickness: parseFloat(elements.moduleBackThickness.value) || DEFAULTS.BACK_THICKNESS,
    hasBackPanel: elements.moduleHasBackPanel.checked,
    backPanelType: elements.moduleBackType.value,
    hasDoors: hasDoors,
    doorType: hasDoors ? elements.moduleDoorType.value : 'overlay',
    doorStyle: hasDoors ? elements.moduleDoorStyle.value : 'flat',
    shakerRailWidth: hasDoors ? parseFloat(elements.moduleShakerRailWidth.value) || DEFAULTS.SHAKER_RAIL_WIDTH : DEFAULTS.SHAKER_RAIL_WIDTH,
    shakerStileWidth: hasDoors ? parseFloat(elements.moduleShakerStileWidth.value) || DEFAULTS.SHAKER_STILE_WIDTH : DEFAULTS.SHAKER_STILE_WIDTH,
    shakerPanelThickness: hasDoors ? parseFloat(elements.moduleShakerPanelThickness.value) || DEFAULTS.SHAKER_PANEL_THICKNESS : DEFAULTS.SHAKER_PANEL_THICKNESS,
    doors: hasDoors ? getDoorsFromList() : [],
    doorGap: hasDoors ? parseFloat(elements.moduleDoorGap.value) || 2 : 2,
    hasDrawers: hasDrawers,
    drawerFrontType: hasDrawers ? elements.moduleDrawerFrontType.value : 'overlay',
    drawerFrontStyle: hasDrawers ? elements.moduleDrawerFrontStyle.value : 'flat',
    drawerShakerRailWidth: hasDrawers ? parseFloat(elements.moduleDrawerShakerRailWidth.value) || DEFAULTS.SHAKER_RAIL_WIDTH : DEFAULTS.SHAKER_RAIL_WIDTH,
    drawerShakerStileWidth: hasDrawers ? parseFloat(elements.moduleDrawerShakerStileWidth.value) || DEFAULTS.SHAKER_STILE_WIDTH : DEFAULTS.SHAKER_STILE_WIDTH,
    drawerShakerPanelThickness: hasDrawers ? parseFloat(elements.moduleDrawerShakerPanelThickness.value) || DEFAULTS.SHAKER_PANEL_THICKNESS : DEFAULTS.SHAKER_PANEL_THICKNESS,
    drawers: hasDrawers ? getDrawersFromList() : [],
    drawerSlideClearance: hasDrawers ? parseFloat(elements.moduleDrawerSlideClearance.value) || DEFAULTS.DRAWER_SLIDE_CLEARANCE : DEFAULTS.DRAWER_SLIDE_CLEARANCE,
    drawerBottomThickness: hasDrawers ? parseFloat(elements.moduleDrawerBottomThickness.value) || DEFAULTS.DRAWER_BOTTOM_THICKNESS : DEFAULTS.DRAWER_BOTTOM_THICKNESS,
    drawerSpacing: hasDrawers ? parseFloat(elements.moduleDrawerSpacing.value) || DEFAULTS.DRAWER_SPACING : DEFAULTS.DRAWER_SPACING
  };
}

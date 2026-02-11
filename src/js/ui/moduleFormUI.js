/**
 * Module Form UI
 * Handles the module modal form, drawers, and doors
 */

import { CABINET_TYPES, DEFAULTS } from '../constants.js';
import { getElements } from './elements.js';
import { t } from '../i18n.js';
import { setInnerHTML } from './helpers.js';
import { renderCabinet } from '../cabinetRenderer.js';

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
    elements.moduleDoorGap.value = module.doorGap ?? 2;
    elements.moduleHasDrawers.checked = module.hasDrawers;
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
    elements.moduleDoorGap.value = 2;
    elements.moduleDrawerSlideClearance.value = projectSettings.drawerSlideClearance ?? DEFAULTS.DRAWER_SLIDE_CLEARANCE;
    elements.moduleDrawerSpacing.value = DEFAULTS.DRAWER_SPACING;
    elements.moduleHasBackPanel.checked = true;
  }
  
  // Update UI based on type
  updateModuleFormForType(elements.moduleType.value);
  updateCountertopOptionsVisibility(elements.moduleHasCountertop.checked);
  updateBackPanelOptionsVisibility(elements.moduleHasBackPanel.checked);
  updateStretcherOptionsVisibility();
  updateDoorOptionsVisibility(elements.moduleHasDoors.checked);
  updateDrawerOptionsVisibility(elements.moduleHasDrawers.checked);
  
  elements.moduleModal.classList.remove('hidden');
  
  // Render 3D preview if editing, after modal is shown
  if (isEdit) {
    setTimeout(() => {
      renderCabinet(module, document.getElementById('module-3d'));
    }, 100); // Small delay to ensure modal is rendered
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
 * Full overlay doors formula:
 * - Door height = box height (cabinet height minus legs and countertop)
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
  
  // Door height = box height (full overlay, covers entire front)
  const doorHeight = Math.max(50, boxHeight);
  
  // Door width = (cabinet width - gaps between doors) / door count
  // Gap only between doors (not on edges for full overlay)
  const gapsBetweenDoors = (doorCount - 1) * DEFAULTS.DOOR_GAP;
  const doorWidth = Math.max(50, Math.round((cabinetWidth - gapsBetweenDoors) / doorCount));
  
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
    doors: hasDoors ? getDoorsFromList() : [],
    doorGap: hasDoors ? parseFloat(elements.moduleDoorGap.value) || 2 : 2,
    hasDrawers: hasDrawers,
    drawers: hasDrawers ? getDrawersFromList() : [],
    drawerSlideClearance: hasDrawers ? parseFloat(elements.moduleDrawerSlideClearance.value) || DEFAULTS.DRAWER_SLIDE_CLEARANCE : DEFAULTS.DRAWER_SLIDE_CLEARANCE,
    drawerBottomThickness: hasDrawers ? parseFloat(elements.moduleDrawerBottomThickness.value) || DEFAULTS.DRAWER_BOTTOM_THICKNESS : DEFAULTS.DRAWER_BOTTOM_THICKNESS,
    drawerSpacing: hasDrawers ? parseFloat(elements.moduleDrawerSpacing.value) || DEFAULTS.DRAWER_SPACING : DEFAULTS.DRAWER_SPACING
  };
}

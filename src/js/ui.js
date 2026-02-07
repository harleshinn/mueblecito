/**
 * UI Manager
 * Handles DOM manipulation and user interface interactions
 */

import { CABINET_TYPES, BACK_PANEL_TYPES, DEFAULTS } from './constants.js';

/**
 * DOM element references
 */
const elements = {
  // Project list
  projectList: null,
  btnNewProject: null,
  
  // Project editor
  projectEditor: null,
  projectTitle: null,
  btnEditProject: null,
  btnBackProjects: null,
  
  // Project settings modal
  projectSettingsModal: null,
  projectSettingsForm: null,
  btnCloseProjectSettings: null,
  
  // Modules
  modulesList: null,
  btnAddModule: null,
  
  // Module modal
  moduleModal: null,
  moduleForm: null,
  moduleModalTitle: null,
  btnCloseModule: null,
  btnCancelModule: null,
  
  // Form fields
  moduleId: null,
  moduleName: null,
  moduleType: null,
  moduleQuantity: null,
  moduleWidth: null,
  moduleDepth: null,
  moduleHeight: null,
  moduleHasCountertop: null,
  countertopOptions: null,
  moduleCountertopThickness: null,
  moduleLegHeight: null,
  moduleStructuralThickness: null,
  moduleBackThickness: null,
  moduleBackType: null,
  moduleHasTop: null,
  moduleHasTopStretcher: null,
  moduleHasBottomStretcher: null,
  stretcherOptions: null,
  moduleStretcherHeight: null,
  moduleHasDoors: null,
  doorOptions: null,
  doorList: null,
  btnAddDoor: null,
  moduleDoorGap: null,
  moduleHasDrawers: null,
  drawerOptions: null,
  drawerList: null,
  btnAddDrawer: null,
  moduleDrawerSlideClearance: null,
  moduleDrawerBottomThickness: null,
  moduleDrawerSpacing: null,
  drawerRemainingHeight: null,
  
  // Lower cabinet options
  lowerCabinetOptions: null,
  
  // Results
  btnGenerate: null,
  resultsContent: null,
  panelSummary: null,
  panelDiagrams: null,
  partsTableBody: null
};

/**
 * Initialize DOM element references
 */
export function initElements() {
  elements.projectList = document.getElementById('project-list');
  elements.btnNewProject = document.getElementById('btn-new-project');
  elements.projectEditor = document.getElementById('project-editor');
  elements.projectTitle = document.getElementById('project-title');
  elements.btnEditProject = document.getElementById('btn-edit-project');
  elements.btnBackProjects = document.getElementById('btn-back-projects');
  elements.projectSettingsModal = document.getElementById('project-settings-modal');
  elements.projectSettingsForm = document.getElementById('project-settings-form');
  elements.btnCloseProjectSettings = document.getElementById('btn-close-project-settings');
  elements.modulesList = document.getElementById('modules-list');
  elements.btnAddModule = document.getElementById('btn-add-module');
  elements.moduleModal = document.getElementById('module-modal');
  elements.moduleForm = document.getElementById('module-form');
  elements.moduleModalTitle = document.getElementById('module-modal-title');
  elements.btnCloseModule = document.getElementById('btn-close-module');
  elements.btnCancelModule = document.getElementById('btn-cancel-module');
  elements.moduleId = document.getElementById('module-id');
  elements.moduleName = document.getElementById('module-name');
  elements.moduleType = document.getElementById('module-type');
  elements.moduleQuantity = document.getElementById('module-quantity');
  elements.moduleWidth = document.getElementById('module-width');
  elements.moduleDepth = document.getElementById('module-depth');
  elements.moduleHeight = document.getElementById('module-height');
  elements.moduleHasCountertop = document.getElementById('module-has-countertop');
  elements.countertopOptions = document.getElementById('countertop-options');
  elements.moduleCountertopThickness = document.getElementById('module-countertop-thickness');
  elements.moduleLegHeight = document.getElementById('module-leg-height');
  elements.moduleStructuralThickness = document.getElementById('module-structural-thickness');
  elements.moduleBackThickness = document.getElementById('module-back-thickness');
  elements.moduleHasBackPanel = document.getElementById('module-has-back-panel');
  elements.backPanelOptions = document.getElementById('back-panel-options');
  elements.moduleBackType = document.getElementById('module-back-type');
  elements.moduleHasTop = document.getElementById('module-has-top');
  elements.moduleHasTopStretcher = document.getElementById('module-has-top-stretcher');
  elements.moduleHasBottomStretcher = document.getElementById('module-has-bottom-stretcher');
  elements.stretcherOptions = document.getElementById('stretcher-options');
  elements.moduleStretcherHeight = document.getElementById('module-stretcher-height');
  elements.moduleHasDoors = document.getElementById('module-has-doors');
  elements.doorOptions = document.getElementById('door-options');
  elements.doorList = document.getElementById('door-list');
  elements.btnAddDoor = document.getElementById('btn-add-door');
  elements.moduleDoorGap = document.getElementById('module-door-gap');
  elements.moduleHasDrawers = document.getElementById('module-has-drawers');
  elements.drawerOptions = document.getElementById('drawer-options');
  elements.drawerList = document.getElementById('drawer-list');
  elements.btnAddDrawer = document.getElementById('btn-add-drawer');
  elements.moduleDrawerSlideClearance = document.getElementById('module-drawer-slide-clearance');
  elements.moduleDrawerBottomThickness = document.getElementById('module-drawer-bottom-thickness');
  elements.moduleDrawerSpacing = document.getElementById('module-drawer-spacing');
  elements.drawerRemainingHeight = document.getElementById('drawer-remaining-height');
  elements.lowerCabinetOptions = document.querySelector('.lower-cabinet-options');
  elements.btnGenerate = document.getElementById('btn-generate');
  elements.resultsContent = document.getElementById('results-content');
  elements.panelSummary = document.getElementById('panel-summary');
  elements.panelDiagrams = document.getElementById('panel-diagrams');
  elements.partsTableBody = document.getElementById('parts-table-body');
  elements.btnExportCsv = document.getElementById('btn-export-csv');
}

/**
 * Get elements object
 */
export function getElements() {
  return elements;
}

/**
 * Render project list
 * 
 * @param {Array} projects - Array of projects
 * @param {Object} handlers - Event handlers { onSelect, onDelete }
 */
export function renderProjectList(projects, handlers) {
  if (projects.length === 0) {
    elements.projectList.innerHTML = `
      <div class="project-list__empty">
        <p>No hay proyectos todavía. Creá tu primer proyecto para comenzar.</p>
      </div>
    `;
    return;
  }
  
  elements.projectList.innerHTML = projects.map(project => {
    const modules = project.modules || project.furniture || [];
    const costInfo = project.costInfo || { totalCost: 0, totalProportionalCost: 0, hasPrice: false };
    
    let costHtml = '';
    if (costInfo.hasPrice) {
      costHtml = `
        <div class="project-card__cost">
          <span class="cost-label">Costo estimado:</span>
          <span class="cost-value">$${costInfo.totalCost.toFixed(2)}</span>
        </div>
      `;
    }
    
    return `
    <div class="project-card" data-id="${project.id}">
      <div class="project-card__header">
        <span class="project-card__name">${escapeHtml(project.name)}</span>
        ${costHtml}
      </div>
      <div class="project-card__info">
        <span>${modules.length} module${modules.length !== 1 ? 's' : ''}</span>
        <span>Updated: ${formatDate(project.updatedAt)}</span>
      </div>
      <div class="project-card__actions">
        <button class="btn btn--primary btn-open-project" data-id="${project.id}">Abrir</button>
        <button class="btn btn--danger btn-delete-project" data-id="${project.id}">Borrar</button>
      </div>
    </div>
  `;
  }).join('');
  
  // Attach event listeners
  elements.projectList.querySelectorAll('.btn-open-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handlers.onSelect(btn.dataset.id);
    });
  });
  
  elements.projectList.querySelectorAll('.btn-delete-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('¿Estás seguro de que deseas borrar este proyecto?')) {
        handlers.onDelete(btn.dataset.id);
      }
    });
  });
  
  elements.projectList.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      handlers.onSelect(card.dataset.id);
    });
  });
}

/**
 * Render modules list
 * 
 * @param {Array} modules - Array of module pieces
 * @param {Object} handlers - Event handlers { onEdit, onDelete }
 */
export function renderModulesList(modules, handlers) {
  if (modules.length === 0) {
    elements.modulesList.innerHTML = `
      <div class="modules__empty">
        <p>No hay módulos todavía. Agrega un módulo para comenzar con tu plan de cortes.</p>
      </div>
    `;
    return;
  }
  
  elements.modulesList.innerHTML = modules.map(item => {
    const isIncluded = item.includeInCalculation !== false;
    const excludedClass = isIncluded ? '' : ' module-card--excluded';
    
    return `
    <div class="module-card${excludedClass}" data-id="${item.id}">
      <div class="module-card__header">
      <span class="module-card__type module-card__type--${item.type}">
          ${item.type === CABINET_TYPES.LOWER ? 'Bajomesada' : 'Alacena'}
        </span>
        <label class="module-card__toggle" title="Include in calculation">
          <input type="checkbox" class="module-include-checkbox" data-id="${item.id}" ${isIncluded ? 'checked' : ''}>
          <span class="module-card__name">${escapeHtml(item.name)}</span>
        </label>
        
      </div>
      <div class="module-card__details">
        <span><strong>Cant:</strong> ${item.quantity}</span>
        <span><strong>Ancho:</strong> ${item.width} mm</span>
        <span><strong>Profundidad:</strong> ${item.depth} mm</span>
        <span><strong>Alto:</strong> ${item.height} mm</span>
        ${item.hasDrawers && item.drawers ? `<span><strong>Cajones:</strong> ${item.drawers.length}</span>` : ''}
        ${item.hasDoors && item.doors ? `<span><strong>Puertas:</strong> ${item.doors.length}</span>` : ''}
      </div>
      <div class="module-card__actions">
        <button class="btn btn--secondary btn-edit-module" data-id="${item.id}">Editar</button>
        <button class="btn btn--danger btn-delete-module" data-id="${item.id}">Borrar</button>
      </div>
    </div>
  `;
  }).join('');
  
  // Attach event listeners
  elements.modulesList.querySelectorAll('.btn-edit-module').forEach(btn => {
    btn.addEventListener('click', () => handlers.onEdit(btn.dataset.id));
  });
  
  elements.modulesList.querySelectorAll('.btn-delete-module').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que deseas borrar este módulo?')) {
        handlers.onDelete(btn.dataset.id);
      }
    });
  });
  
  // Attach include toggle listeners
  elements.modulesList.querySelectorAll('.module-include-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (handlers.onToggleInclude) {
        handlers.onToggleInclude(checkbox.dataset.id, e.target.checked);
      }
    });
  });
}

/**
 * Show project editor, hide project list
 * 
 * @param {Object} project - Project to edit
 */
export function showProjectEditor(project) {
  document.querySelector('.project-section').classList.add('hidden');
  elements.projectEditor.classList.remove('hidden');
  elements.projectTitle.textContent = project.name;
}

/**
 * Show project list, hide project editor
 */
export function showProjectList() {
  document.querySelector('.project-section').classList.remove('hidden');
  elements.projectEditor.classList.add('hidden');
  elements.resultsContent.classList.add('hidden');
}

/**
 * Show project settings modal
 * 
 * @param {Object} project - Project with settings
 */
export function showProjectSettingsModal(project) {
  document.getElementById('project-name').value = project.name;
  document.getElementById('default-countertop-thickness').value = project.settings.defaultCountertopThickness;
  document.getElementById('default-leg-height').value = project.settings.defaultLegHeight;
  document.getElementById('panel-discard-margin').value = project.settings.panelDiscardMargin;
  document.getElementById('kerf-width').value = project.settings.kerfWidth;
  document.getElementById('drawer-slide-clearance').value = project.settings.drawerSlideClearance;
  
  // Panel prices
  const prices = project.settings.panelPrices || {};
  document.getElementById('panel-price-18').value = prices['18'] || 0;
  document.getElementById('panel-price-5.5').value = prices['5.5'] || 0;
  document.getElementById('panel-price-3').value = prices['3'] || 0;
  
  elements.projectSettingsModal.classList.remove('hidden');
}

/**
 * Hide project settings modal
 */
export function hideProjectSettingsModal() {
  elements.projectSettingsModal.classList.add('hidden');
}

/**
 * Get project settings from form
 * 
 * @returns {Object} - Project settings
 */
export function getProjectSettingsFromForm() {
  return {
    name: document.getElementById('project-name').value.trim(),
    defaultCountertopThickness: parseFloat(document.getElementById('default-countertop-thickness').value) || DEFAULTS.COUNTERTOP_THICKNESS,
    defaultLegHeight: parseFloat(document.getElementById('default-leg-height').value) || DEFAULTS.LEG_HEIGHT,
    panelDiscardMargin: parseFloat(document.getElementById('panel-discard-margin').value) || DEFAULTS.PANEL_DISCARD_MARGIN,
    kerfWidth: parseFloat(document.getElementById('kerf-width').value) || DEFAULTS.KERF_WIDTH,
    drawerSlideClearance: parseFloat(document.getElementById('drawer-slide-clearance').value) || DEFAULTS.DRAWER_SLIDE_CLEARANCE,
    panelPrices: {
      '18': parseFloat(document.getElementById('panel-price-18').value) || 0,
      '5.5': parseFloat(document.getElementById('panel-price-5.5').value) || 0,
      '3': parseFloat(document.getElementById('panel-price-3').value) || 0
    }
  };
}

/**
 * Show module modal for adding/editing
 * 
 * @param {Object|null} module - Module to edit, or null for new
 * @param {Object} projectSettings - Project settings for defaults
 */
export function showModuleModal(module = null, projectSettings = {}) {
  const isEdit = module !== null;
  elements.moduleModalTitle.textContent = isEdit ? 'Edit Module' : 'Add Module';
  
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
}

/**
 * Hide module modal
 */
export function hideModuleModal() {
  elements.moduleModal.classList.add('hidden');
}

/**
 * Update module form based on cabinet type
 * 
 * @param {string} type - Cabinet type
 */
export function updateModuleFormForType(type) {
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
    elements.drawerRemainingHeight.textContent = `Disponible: ${Math.round(internalHeight)} mm`;
    elements.drawerRemainingHeight.className = 'drawer-remaining-height';
  } else if (remainingHeight >= 0) {
    elements.drawerRemainingHeight.textContent = `Restante: ${Math.round(remainingHeight)} mm`;
    elements.drawerRemainingHeight.className = 'drawer-remaining-height';
  } else {
    elements.drawerRemainingHeight.textContent = `Excede: ${Math.round(Math.abs(remainingHeight))} mm`;
    elements.drawerRemainingHeight.className = 'drawer-remaining-height drawer-remaining-height--error';
  }
}

/**
 * Update door options visibility
 * 
 * @param {boolean} hasDoors - Whether module has doors
 */
export function updateDoorOptionsVisibility(hasDoors) {
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
  const hasAnyStretcher = elements.moduleHasTopStretcher.checked || elements.moduleHasBottomStretcher.checked;
  if (hasAnyStretcher) {
    elements.stretcherOptions.classList.remove('hidden');
  } else {
    elements.stretcherOptions.classList.add('hidden');
  }
}

/**
 * Clear the drawer list
 */
export function clearDrawerList() {
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
  const index = elements.drawerList.children.length + 1;
  
  const row = document.createElement('div');
  row.className = 'drawer-row';
  row.innerHTML = `
    <span class="drawer-number">${index}</span>
    <div class="drawer-field">
      <label>Frente (mm)</label>
      <input type="number" class="drawer-height" value="${height || DEFAULTS.DRAWER_HEIGHT}" min="50" step="1">
    </div>
    <div class="drawer-field">
      <label>Cajón (mm)</label>
      <input type="number" class="drawer-box-height" value="${boxHeight || DEFAULTS.DRAWER_BOX_HEIGHT}" min="50" step="1">
    </div>
    <div class="drawer-field">
      <label>Prof. (mm)</label>
      <input type="number" class="drawer-depth" value="${depth || ''}" min="50" step="1" placeholder="Auto">
    </div>
    <button type="button" class="btn btn-danger btn-small btn-remove-drawer">×</button>
  `;
  
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

/**
 * Clear the door list
 */
export function clearDoorList() {
  elements.doorList.innerHTML = '';
}

/**
 * Calculate the box height for door calculations from form values
 * Mirrors the logic in cabinetCalculations.js
 * 
 * @returns {number} - Box height in mm
 */
function calculateFormBoxHeight() {
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
  const index = elements.doorList.children.length + 1;
  
  // Auto-calculate dimensions if not provided
  if (width === null || height === null) {
    const dims = calculateDoorDimensions(index);
    width = width ?? dims.width;
    height = height ?? dims.height;
  }
  
  const row = document.createElement('div');
  row.className = 'door-row';
  row.innerHTML = `
    <span class="door-number">${index}</span>
    <div class="door-field">
      <input type="number" class="door-width" value="${width}" min="50" step="1">
    </div>
    <div class="door-field">
      <input type="number" class="door-height" value="${height}" min="50" step="1">
    </div>
    <button type="button" class="btn btn-danger btn-small btn-remove-door">×</button>
  `;
  
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
  const doors = [];
  const rows = elements.doorList.querySelectorAll('.door-row');
  
  rows.forEach(row => {
    const width = parseFloat(row.querySelector('.door-width').value) || DEFAULTS.DOOR_WIDTH;
    const height = parseFloat(row.querySelector('.door-height').value) || DEFAULTS.DOOR_HEIGHT;
    
    doors.push({ width, height });
  });
  
  return doors;
}

/**
 * Get module data from form
 * 
 * @returns {Object} - Module data
 */
export function getModuleFromForm() {
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

/**
 * Format currency value
 * 
 * @param {number} value - Value to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(value) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Render panel summary
 * 
 * @param {Object} panelResults - Panel calculation results
 */
export function renderPanelSummary(panelResults) {
  const { byThickness, totalPanels, totalCost, totalProportionalCost, overallUsagePercent, usableDimensions, stockDimensions } = panelResults;
  
  let html = `
    <div class="panel-summary-card">
      <div class="panel-thickness">Total</div>
      <div class="panel-count">${totalPanels}</div>
      <div class="panel-label">Panels Needed</div>
    </div>
  `;
  
  // Usage efficiency card
  html += `
    <div class="panel-summary-card">
      <div class="panel-thickness">Uso</div>
      <div class="panel-count" style="font-size: 1.25rem;">${overallUsagePercent.toFixed(1)}%</div>
      <div class="panel-label">Optimización</div>
    </div>
  `;
  
  // Per-thickness breakdown with pricing
  for (const [thickness, data] of Object.entries(byThickness)) {
    let usageInfo = `${data.usagePercent.toFixed(0)}% usado`;
    let priceHtml = '';
    
    if (data.pricePerPanel > 0) {
      priceHtml = `
        <div class="panel-pricing">
          <span class="pricing-row">
            <span>Full (${data.panelCount} paneles):</span>
            <span>$${formatCurrency(data.cost)}</span>
          </span>
          <span class="pricing-row pricing-recommended">
            <span>Por uso:</span>
            <span>$${formatCurrency(data.proportionalCost)}</span>
          </span>
        </div>
      `;
    }
    
    html += `
      <div class="panel-summary-card">
        <div class="panel-thickness">${thickness} mm MDF</div>
        <div class="panel-count">${data.panelCount}</div>
        <div class="panel-label">${data.partCount} piezas • ${usageInfo}</div>
        ${priceHtml}
      </div>
    `;
  }
  
  // Grand total pricing (if any prices are set)
  if (totalCost > 0) {
    html += `
      <div class="panel-summary-card pricing-card">
        <div class="panel-thickness">Total General</div>
        <div class="pricing-options">
          <div class="pricing-option">
            <span class="pricing-label">Paneles Completos (${totalPanels}):</span>
            <span class="pricing-value">$${formatCurrency(totalCost)}</span>
          </div>
          <div class="pricing-option pricing-recommended">
            <span class="pricing-label">Por Uso (${overallUsagePercent.toFixed(0)}%):</span>
            <span class="pricing-value">$${formatCurrency(totalProportionalCost)}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  html += `
    <div class="panel-summary-card">
      <div class="panel-thickness">Tamaño de Stock</div>
      <div class="panel-count" style="font-size: 1rem;">${stockDimensions.width} × ${stockDimensions.height}</div>
      <div class="panel-label">Usable: ${usableDimensions.width} × ${usableDimensions.height} mm</div>
    </div>
  `;
  
  elements.panelSummary.innerHTML = html;
}

/**
 * Color palette matching SCSS variables (pastel versions for part backgrounds)
 * Based on: primary (#f472b6), success (#83d1cb), danger (#5bd0d8), secondary (#c4b5fd)
 */
const PART_COLORS = [
  '#fce7f3', // pink (primary tint)
  '#f9a8d4', // pink darker
  '#d1faf8', // teal/mint (success tint)
  '#aadcc5', // mint green
  '#cffafe', // cyan (danger tint)
  '#a5f3fc', // cyan darker
  '#ede9fe', // lavender (secondary tint)
  '#ddd6fe', // purple
  '#fef3c7', // warm yellow (complementary)
  '#fde68a', // yellow darker
  '#fee2e2', // soft red
  '#fecaca', // coral
];

/**
 * Generate a color for a part based on its name
 * Uses a predefined palette matching SCSS variables
 * 
 * @param {string} name - Part name
 * @returns {string} - Hex color string
 */
function getPartColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PART_COLORS.length;
  return PART_COLORS[index];
}

/**
 * Render panel cutting diagrams
 * 
 * @param {Object} panelResults - Panel calculation results
 */
export function renderPanelDiagrams(panelResults) {
  const { byThickness, usableDimensions } = panelResults;
  
  // Scale factor to fit diagrams nicely (target max width ~400px)
  const maxDiagramWidth = 400;
  const scale = maxDiagramWidth / usableDimensions.width;
  const diagramHeight = usableDimensions.height * scale;
  
  let html = '';
  
  for (const [thickness, data] of Object.entries(byThickness)) {
    if (data.placements.length === 0) continue;
    
    // Group placements by panel index
    const panelGroups = {};
    for (const placement of data.placements) {
      const idx = placement.panelIndex ?? 0;
      if (!panelGroups[idx]) {
        panelGroups[idx] = [];
      }
      panelGroups[idx].push(placement);
    }
    
    html += `<h5>${thickness} mm MDF (${data.panelCount} panel${data.panelCount !== 1 ? 's' : ''})</h5>`;
    html += `<div class="panel-thickness-group">`;
    
    for (const [panelIdx, placements] of Object.entries(panelGroups)) {
      html += `
        <div class="panel-diagram-wrapper">
          <div class="panel-diagram-label">Panel ${parseInt(panelIdx) + 1}</div>
          <div class="panel-diagram" style="width: ${maxDiagramWidth}px; height: ${diagramHeight}px;">
      `;
      
      for (const placement of placements) {
        const x = placement.x * scale;
        const y = placement.y * scale;
        const w = placement.placedWidth * scale;
        const h = placement.placedHeight * scale;
        const color = getPartColor(placement.moduleName + placement.partName);
        
        // Create label - show dimensions and name
        const dimLabel = `${placement.placedWidth}×${placement.placedHeight}`;
        const rotatedIcon = placement.rotated ? ' ↻' : '';
        
        html += `
          <div class="panel-part" 
               style="left: ${x}px; top: ${y}px; width: ${w}px; height: ${h}px; background-color: ${color};"
               title="${escapeHtml(placement.moduleName)}: ${escapeHtml(placement.partName)} (${dimLabel})${rotatedIcon}">
            <span class="part-label">${escapeHtml(placement.partName)}</span>
            <span class="part-dims">${dimLabel}</span>
          </div>
        `;
      }
      
      html += `
          </div>
        </div>
      `;
    }
    
    html += `</div>`;
  }
  
  if (html === '') {
    html = '<p class="no-diagrams">No hay partes para mostrar</p>';
  }
  
  elements.panelDiagrams.innerHTML = html;
}

/**
 * Render parts table
 * 
 * @param {Array} parts - Parts list
 */
export function renderPartsTable(parts) {
  if (parts.length === 0) {
    elements.partsTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #64748b;">No hay partes para mostrar</td>
      </tr>
    `;
    return;
  }
  
  elements.partsTableBody.innerHTML = parts.map(part => `
    <tr>
      <td>${escapeHtml(part.moduleName)}</td>
      <td>${escapeHtml(part.partName)}</td>
      <td>${part.quantity}</td>
      <td>${part.width}</td>
      <td>${part.height}</td>
      <td>${part.thickness}</td>
    </tr>
  `).join('');
}

/**
 * Show results section
 */
export function showResults() {
  elements.resultsContent.classList.remove('hidden');
}

/**
 * Export parts list to CSV format for Google Sheets
 * 
 * @param {Array} parts - Parts list
 * @param {string} projectName - Project name for filename
 */
export function exportPartsToCSV(parts, projectName = 'cut-plan') {
  if (!parts || parts.length === 0) {
    alert('No hay partes para exportar. Genera un plan de corte primero.');
    return;
  }
  
  // CSV header
  const headers = ['Módulo', 'Nombre de la Pieza', 'Cantidad', 'Ancho (mm)', 'Alto (mm)', 'Grosor (mm)'];
  
  // Build CSV content
  const rows = parts.map(part => [
    `"${part.moduleName.replace(/"/g, '""')}"`,
    `"${part.partName.replace(/"/g, '""')}"`,
    part.quantity,
    part.width,
    part.height,
    part.thickness
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${projectName.replace(/[^a-z0-9]/gi, '-')}-parts.csv`);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper: Escape HTML to prevent XSS
 * 
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Helper: Format date for display
 * 
 * @param {string} isoDate - ISO date string
 * @returns {string} - Formatted date
 */
function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString();
}

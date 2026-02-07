/**
 * Projects UI
 * Handles project list, project editor, and project settings modal
 */

import { CABINET_TYPES, DEFAULTS } from '../constants.js';
import { getElements } from './elements.js';
import { escapeHtml, formatDate, setInnerHTML } from './helpers.js';
import { t } from '../i18n.js';

/**
 * Render project list
 * 
 * @param {Array} projects - Array of projects
 * @param {Object} handlers - Event handlers { onSelect, onDelete }
 */
export function renderProjectList(projects, handlers) {
  const elements = getElements();
  
  if (projects.length === 0) {
    setInnerHTML(elements.projectList, `
      <div class="project-list__empty">
        <p>${t('noProjects')}</p>
      </div>
    `);
    return;
  }
  
  setInnerHTML(elements.projectList, projects.map(project => {
    const modules = project.modules || project.furniture || [];
    const costInfo = project.costInfo || { totalCost: 0, totalProportionalCost: 0, hasPrice: false };
    
    let costHtml = '';
    if (costInfo.hasPrice) {
      costHtml = `
        <div class="project-card__cost">
          <span class="cost-label">${t('estimatedCost')}:</span>
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
        <span>${modules.length} ${t('modules').toLowerCase()}</span>
        <span>${t('lastModified')}: ${formatDate(project.updatedAt)}</span>
      </div>
      <div class="project-card__actions">
        <button class="btn btn--primary btn-open-project" data-id="${project.id}">${t('edit')}</button>
        <button class="btn btn--danger btn-delete-project" data-id="${project.id}">${t('delete')}</button>
      </div>
    </div>
  `;
  }).join(''));
  
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
      if (confirm(t('deleteConfirm'))) {
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
 * @param {Object} handlers - Event handlers { onEdit, onDelete, onToggleInclude }
 */
export function renderModulesList(modules, handlers) {
  const elements = getElements();
  
  if (modules.length === 0) {
    setInnerHTML(elements.modulesList, `
      <div class="modules__empty">
        <p>${t('noModules')}</p>
      </div>
    `);
    return;
  }
  
  setInnerHTML(elements.modulesList, modules.map(item => {
    const isIncluded = item.includeInCalculation !== false;
    const excludedClass = isIncluded ? '' : ' module-card--excluded';
    
    return `
    <div class="module-card${excludedClass}" data-id="${item.id}">
      <div class="module-card__header">
        <span class="module-card__type module-card__type--${item.type}">
          ${item.type === CABINET_TYPES.LOWER ? t('lowerCabinet') : t('upperCabinet')}
        </span>
        <label class="module-card__toggle" title="${t('includeInCalculation')}">
          <input type="checkbox" class="module-include-checkbox" data-id="${item.id}" ${isIncluded ? 'checked' : ''}>
          <span class="module-card__name">${escapeHtml(item.name)}</span>
        </label>
      </div>
      <div class="module-card__details">
        <span><strong>${t('quantity')}:</strong> ${item.quantity}</span>
        <span><strong>${t('width')}:</strong> ${item.width} mm</span>
        <span><strong>${t('depth')}:</strong> ${item.depth} mm</span>
        <span><strong>${t('height')}:</strong> ${item.height} mm</span>
        ${item.hasDrawers && item.drawers ? `<span><strong>${t('drawers')}:</strong> ${item.drawers.length}</span>` : ''}
        ${item.hasDoors && item.doors ? `<span><strong>${t('doors')}:</strong> ${item.doors.length}</span>` : ''}
      </div>
      <div class="module-card__actions">
        <button class="btn btn--secondary btn-edit-module" data-id="${item.id}">${t('edit')}</button>
        <button class="btn btn--danger btn-delete-module" data-id="${item.id}">${t('delete')}</button>
      </div>
    </div>
  `;
  }).join(''));
  
  // Attach event listeners
  elements.modulesList.querySelectorAll('.btn-edit-module').forEach(btn => {
    btn.addEventListener('click', () => handlers.onEdit(btn.dataset.id));
  });
  
  elements.modulesList.querySelectorAll('.btn-delete-module').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm(t('deleteConfirm'))) {
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
  const elements = getElements();
  document.querySelector('.project-section').classList.add('hidden');
  elements.projectEditor.classList.remove('hidden');
  elements.projectTitle.textContent = project.name;
}

/**
 * Show project list, hide project editor
 */
export function showProjectList() {
  const elements = getElements();
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
  const elements = getElements();
  
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
  const elements = getElements();
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

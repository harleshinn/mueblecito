/**
 * Mueblecito - MDF Furniture Cut Plan Generator
 * Main Application Entry Point
 */

import '../styles/main.scss';

import { createProject, createModule, updateProjectTimestamp } from './models.js';
import { loadProjects, saveProject, deleteProject, getProject } from './storage.js';
import { generateProjectParts } from './partsGenerator.js';
import { calculateProjectPanels } from './panelCalculations.js';
import {
  initElements,
  getElements,
  renderProjectList,
  renderModulesList,
  showProjectEditor,
  showProjectList,
  showProjectSettingsModal,
  hideProjectSettingsModal,
  getProjectSettingsFromForm,
  showModuleModal,
  hideModuleModal,
  updateModuleFormForType,
  updateCountertopOptionsVisibility,
  updateBackPanelOptionsVisibility,
  updateStretcherOptionsVisibility,
  updateDoorOptionsVisibility,
  updateDrawerOptionsVisibility,
  updateDrawerRemainingHeight,
  addDoorRow,
  addDrawerRow,
  getModuleFromForm,
  renderPanelSummary,
  renderPanelDiagrams,
  renderPartsTable,
  showResults,
  exportPartsToCSV
} from './ui.js';

// Application State
let currentProject = null;
let currentParts = null;

/**
 * Initialize the application
 */
function init() {
  // Initialize DOM elements
  initElements();
  
  // Load and render projects
  refreshProjectList();
  
  // Set up event listeners
  setupEventListeners();
  
  console.log('Mueblecito initialized');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  const elements = getElements();
  
  // New project button
  elements.btnNewProject.addEventListener('click', handleNewProject);
  
  // Back to projects
  elements.btnBackProjects.addEventListener('click', handleBackToProjects);
  
  // Edit project settings
  elements.btnEditProject.addEventListener('click', () => {
    if (currentProject) {
      showProjectSettingsModal(currentProject);
    }
  });
  
  // Close project settings modal
  elements.btnCloseProjectSettings.addEventListener('click', hideProjectSettingsModal);
  
  // Project settings form submit
  elements.projectSettingsForm.addEventListener('submit', handleProjectSettingsSave);
  
  // Add module button
  elements.btnAddModule.addEventListener('click', () => {
    if (currentProject) {
      showModuleModal(null, currentProject.settings);
    }
  });
  
  // Close module modal
  elements.btnCloseModule.addEventListener('click', hideModuleModal);
  elements.btnCancelModule.addEventListener('click', hideModuleModal);
  
  // Module form submit
  elements.moduleForm.addEventListener('submit', handleModuleSave);
  
  // Module type change
  elements.moduleType.addEventListener('change', (e) => {
    updateModuleFormForType(e.target.value);
    updateDrawerRemainingHeight();
  });
  
  // Has countertop checkbox
  elements.moduleHasCountertop.addEventListener('change', (e) => {
    updateCountertopOptionsVisibility(e.target.checked);
    updateDrawerRemainingHeight();
  });
  
  // Has back panel checkbox
  elements.moduleHasBackPanel.addEventListener('change', (e) => {
    updateBackPanelOptionsVisibility(e.target.checked);
  });
  
  // Stretcher checkboxes
  elements.moduleHasTopStretcher.addEventListener('change', () => {
    updateStretcherOptionsVisibility();
  });
  elements.moduleHasBottomStretcher.addEventListener('change', () => {
    updateStretcherOptionsVisibility();
  });
  
  // Has doors checkbox
  elements.moduleHasDoors.addEventListener('change', (e) => {
    updateDoorOptionsVisibility(e.target.checked);
  });
  
  // Add door button
  elements.btnAddDoor.addEventListener('click', () => {
    addDoorRow();
  });
  
  // Has drawers checkbox
  elements.moduleHasDrawers.addEventListener('change', (e) => {
    updateDrawerOptionsVisibility(e.target.checked);
  });
  
  // Add drawer button
  elements.btnAddDrawer.addEventListener('click', () => {
    addDrawerRow();
  });
  
  // Fields affecting internal height - update remaining drawer height
  elements.moduleHeight.addEventListener('input', updateDrawerRemainingHeight);
  elements.moduleCountertopThickness.addEventListener('input', updateDrawerRemainingHeight);
  elements.moduleLegHeight.addEventListener('input', updateDrawerRemainingHeight);
  elements.moduleStructuralThickness.addEventListener('change', updateDrawerRemainingHeight);
  elements.moduleHasTop.addEventListener('change', updateDrawerRemainingHeight);
  elements.moduleDrawerSpacing.addEventListener('input', updateDrawerRemainingHeight);
  
  // Generate cut plan
  elements.btnGenerate.addEventListener('click', handleGenerateCutPlan);
  
  // Export to CSV
  elements.btnExportCsv.addEventListener('click', () => {
    if (currentProject && currentParts) {
      exportPartsToCSV(currentParts, currentProject.name);
    } else {
      alert('Generate a cut plan first before exporting.');
    }
  });
}

/**
 * Calculate project cost quickly
 * 
 * @param {Object} project - Project object
 * @returns {Object} - { totalCost, totalProportionalCost, hasPrice }
 */
function calculateProjectCost(project) {
  try {
    const parts = generateProjectParts(project);
    if (parts.length === 0) {
      return { totalCost: 0, totalProportionalCost: 0, hasPrice: false };
    }
    const panelResults = calculateProjectPanels(parts, project.settings);
    return {
      totalCost: panelResults.totalCost,
      totalProportionalCost: panelResults.totalProportionalCost,
      hasPrice: panelResults.totalCost > 0
    };
  } catch (e) {
    return { totalCost: 0, totalProportionalCost: 0, hasPrice: false };
  }
}

/**
 * Refresh project list from storage
 */
function refreshProjectList() {
  const projects = loadProjects();
  
  // Calculate costs for each project
  const projectsWithCosts = projects.map(project => ({
    ...project,
    costInfo: calculateProjectCost(project)
  }));
  
  renderProjectList(projectsWithCosts, {
    onSelect: handleSelectProject,
    onDelete: handleDeleteProject
  });
}

/**
 * Handle new project creation
 */
function handleNewProject() {
  const name = prompt('Enter project name:', 'New Project');
  if (name === null) return; // Cancelled
  
  const project = createProject(name.trim() || 'New Project');
  saveProject(project);
  
  // Open the new project
  handleSelectProject(project.id);
}

/**
 * Handle project selection
 * 
 * @param {string} projectId - Project ID
 */
function handleSelectProject(projectId) {
  const project = getProject(projectId);
  if (!project) {
    alert('Project not found');
    refreshProjectList();
    return;
  }
  
  currentProject = project;
  showProjectEditor(project);
  refreshModulesList();
  
  // Hide results when switching projects
  getElements().resultsContent.classList.add('hidden');
}

/**
 * Handle project deletion
 * 
 * @param {string} projectId - Project ID
 */
function handleDeleteProject(projectId) {
  deleteProject(projectId);
  
  if (currentProject && currentProject.id === projectId) {
    currentProject = null;
    showProjectList();
  }
  
  refreshProjectList();
}

/**
 * Handle back to projects
 */
function handleBackToProjects() {
  currentProject = null;
  showProjectList();
  refreshProjectList();
}

/**
 * Handle project settings save
 * 
 * @param {Event} e - Form submit event
 */
function handleProjectSettingsSave(e) {
  e.preventDefault();
  
  if (!currentProject) return;
  
  const settings = getProjectSettingsFromForm();
  
  currentProject.name = settings.name;
  currentProject.settings = {
    defaultCountertopThickness: settings.defaultCountertopThickness,
    defaultLegHeight: settings.defaultLegHeight,
    panelDiscardMargin: settings.panelDiscardMargin,
    kerfWidth: settings.kerfWidth,
    drawerSlideClearance: settings.drawerSlideClearance,
    panelPrices: settings.panelPrices
  };
  currentProject = updateProjectTimestamp(currentProject);
  
  saveProject(currentProject);
  
  // Update UI
  getElements().projectTitle.textContent = currentProject.name;
  hideProjectSettingsModal();
}

/**
 * Handle module edit
 * 
 * @param {string} moduleId - Module ID
 */
function handleEditModule(moduleId) {
  if (!currentProject) return;
  
  const module = currentProject.modules.find(m => m.id === moduleId);
  if (module) {
    showModuleModal(module, currentProject.settings);
  }
}

/**
 * Handle module deletion
 * 
 * @param {string} moduleId - Module ID
 */
function handleDeleteModule(moduleId) {
  if (!currentProject) return;
  
  currentProject.modules = currentProject.modules.filter(m => m.id !== moduleId);
  currentProject = updateProjectTimestamp(currentProject);
  saveProject(currentProject);
  
  refreshModulesList();
  
  // Hide results as they're now outdated
  getElements().resultsContent.classList.add('hidden');
}

/**
 * Handle module include toggle
 * 
 * @param {string} moduleId - Module ID
 * @param {boolean} include - Whether to include in calculation
 */
function handleToggleInclude(moduleId, include) {
  if (!currentProject) return;
  
  const module = currentProject.modules.find(m => m.id === moduleId);
  if (module) {
    module.includeInCalculation = include;
    currentProject = updateProjectTimestamp(currentProject);
    saveProject(currentProject);
    
    refreshModulesList();
    
    // Hide results as they're now outdated
    getElements().resultsContent.classList.add('hidden');
  }
}

/**
 * Refresh modules list with current handlers
 */
function refreshModulesList() {
  if (!currentProject) return;
  
  renderModulesList(currentProject.modules, {
    onEdit: handleEditModule,
    onDelete: handleDeleteModule,
    onToggleInclude: handleToggleInclude
  });
}

/**
 * Handle module save (add or update)
 * 
 * @param {Event} e - Form submit event
 */
function handleModuleSave(e) {
  e.preventDefault();
  
  if (!currentProject) return;
  
  const formData = getModuleFromForm();
  
  // Validate
  if (!formData.name) {
    alert('Please enter a module name');
    return;
  }
  
  if (formData.width <= 0 || formData.depth <= 0 || formData.height <= 0) {
    alert('Please enter valid dimensions');
    return;
  }
  
  if (formData.id) {
    // Update existing module
    const index = currentProject.modules.findIndex(m => m.id === formData.id);
    if (index >= 0) {
      const module = createModule(formData, currentProject.settings);
      module.id = formData.id; // Keep the same ID
      currentProject.modules[index] = module;
    }
  } else {
    // Add new module
    const module = createModule(formData, currentProject.settings);
    currentProject.modules.push(module);
  }
  
  currentProject = updateProjectTimestamp(currentProject);
  saveProject(currentProject);
  
  refreshModulesList();
  
  hideModuleModal();
  
  // Hide results as they're now outdated
  getElements().resultsContent.classList.add('hidden');
}

/**
 * Handle generate cut plan
 */
function handleGenerateCutPlan() {
  if (!currentProject) return;
  
  if (currentProject.modules.length === 0) {
    alert('Add at least one module to generate a cut plan');
    return;
  }
  
  // Generate parts list
  const parts = generateProjectParts(currentProject);
  currentParts = parts; // Store for export
  
  // Calculate panels needed
  const panelResults = calculateProjectPanels(parts, currentProject.settings);
  
  // Render results
  renderPanelSummary(panelResults);
  renderPanelDiagrams(panelResults);
  renderPartsTable(parts);
  showResults();
  
  console.log('Cut plan generated:', { parts, panelResults });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);

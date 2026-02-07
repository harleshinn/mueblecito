/**
 * DOM Element References
 * Centralized storage for all UI element references
 */

/**
 * DOM element references object
 * Organized by feature area
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
  
  // Form fields - basic
  moduleId: null,
  moduleName: null,
  moduleType: null,
  moduleQuantity: null,
  moduleWidth: null,
  moduleDepth: null,
  moduleHeight: null,
  
  // Form fields - countertop
  moduleHasCountertop: null,
  countertopOptions: null,
  moduleCountertopThickness: null,
  moduleLegHeight: null,
  
  // Form fields - structure
  moduleStructuralThickness: null,
  moduleBackThickness: null,
  moduleHasBackPanel: null,
  backPanelOptions: null,
  moduleBackType: null,
  moduleHasTop: null,
  
  // Form fields - stretchers
  moduleHasTopStretcher: null,
  moduleHasBottomStretcher: null,
  stretcherOptions: null,
  moduleStretcherHeight: null,
  
  // Form fields - doors
  moduleHasDoors: null,
  doorOptions: null,
  doorList: null,
  btnAddDoor: null,
  moduleDoorGap: null,
  
  // Form fields - drawers
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
  partsAccordion: null,
  btnExportCsv: null
};

/**
 * Initialize DOM element references
 * Should be called once when the app starts
 */
export function initElements() {
  // Project list
  elements.projectList = document.getElementById('project-list');
  elements.btnNewProject = document.getElementById('btn-new-project');
  
  // Project editor
  elements.projectEditor = document.getElementById('project-editor');
  elements.projectTitle = document.getElementById('project-title');
  elements.btnEditProject = document.getElementById('btn-edit-project');
  elements.btnBackProjects = document.getElementById('btn-back-projects');
  
  // Project settings modal
  elements.projectSettingsModal = document.getElementById('project-settings-modal');
  elements.projectSettingsForm = document.getElementById('project-settings-form');
  elements.btnCloseProjectSettings = document.getElementById('btn-close-project-settings');
  
  // Modules
  elements.modulesList = document.getElementById('modules-list');
  elements.btnAddModule = document.getElementById('btn-add-module');
  
  // Module modal
  elements.moduleModal = document.getElementById('module-modal');
  elements.moduleForm = document.getElementById('module-form');
  elements.moduleModalTitle = document.getElementById('module-modal-title');
  elements.btnCloseModule = document.getElementById('btn-close-module');
  elements.btnCancelModule = document.getElementById('btn-cancel-module');
  
  // Form fields - basic
  elements.moduleId = document.getElementById('module-id');
  elements.moduleName = document.getElementById('module-name');
  elements.moduleType = document.getElementById('module-type');
  elements.moduleQuantity = document.getElementById('module-quantity');
  elements.moduleWidth = document.getElementById('module-width');
  elements.moduleDepth = document.getElementById('module-depth');
  elements.moduleHeight = document.getElementById('module-height');
  
  // Form fields - countertop
  elements.moduleHasCountertop = document.getElementById('module-has-countertop');
  elements.countertopOptions = document.getElementById('countertop-options');
  elements.moduleCountertopThickness = document.getElementById('module-countertop-thickness');
  elements.moduleLegHeight = document.getElementById('module-leg-height');
  
  // Form fields - structure
  elements.moduleStructuralThickness = document.getElementById('module-structural-thickness');
  elements.moduleBackThickness = document.getElementById('module-back-thickness');
  elements.moduleHasBackPanel = document.getElementById('module-has-back-panel');
  elements.backPanelOptions = document.getElementById('back-panel-options');
  elements.moduleBackType = document.getElementById('module-back-type');
  elements.moduleHasTop = document.getElementById('module-has-top');
  
  // Form fields - stretchers
  elements.moduleHasTopStretcher = document.getElementById('module-has-top-stretcher');
  elements.moduleHasBottomStretcher = document.getElementById('module-has-bottom-stretcher');
  elements.stretcherOptions = document.getElementById('stretcher-options');
  elements.moduleStretcherHeight = document.getElementById('module-stretcher-height');
  
  // Form fields - doors
  elements.moduleHasDoors = document.getElementById('module-has-doors');
  elements.doorOptions = document.getElementById('door-options');
  elements.doorList = document.getElementById('door-list');
  elements.btnAddDoor = document.getElementById('btn-add-door');
  elements.moduleDoorGap = document.getElementById('module-door-gap');
  
  // Form fields - drawers
  elements.moduleHasDrawers = document.getElementById('module-has-drawers');
  elements.drawerOptions = document.getElementById('drawer-options');
  elements.drawerList = document.getElementById('drawer-list');
  elements.btnAddDrawer = document.getElementById('btn-add-drawer');
  elements.moduleDrawerSlideClearance = document.getElementById('module-drawer-slide-clearance');
  elements.moduleDrawerBottomThickness = document.getElementById('module-drawer-bottom-thickness');
  elements.moduleDrawerSpacing = document.getElementById('module-drawer-spacing');
  elements.drawerRemainingHeight = document.getElementById('drawer-remaining-height');
  
  // Lower cabinet options
  elements.lowerCabinetOptions = document.querySelector('.lower-cabinet-options');
  
  // Results
  elements.btnGenerate = document.getElementById('btn-generate');
  elements.resultsContent = document.getElementById('results-content');
  elements.panelSummary = document.getElementById('panel-summary');
  elements.panelDiagrams = document.getElementById('panel-diagrams');
  elements.partsAccordion = document.getElementById('parts-accordion');
  elements.btnExportCsv = document.getElementById('btn-export-csv');
}

/**
 * Get elements object
 * 
 * @returns {Object} - All DOM element references
 */
export function getElements() {
  return elements;
}

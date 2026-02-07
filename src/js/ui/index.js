/**
 * UI Module - Barrel File
 * Re-exports all UI functions for backward compatibility
 */

// Helpers
export { escapeHtml, formatDate, formatCurrency, getPartColor } from './helpers.js';

// Elements
export { initElements, getElements } from './elements.js';

// Projects UI
export {
  renderProjectList,
  renderModulesList,
  showProjectEditor,
  showProjectList,
  showProjectSettingsModal,
  hideProjectSettingsModal,
  getProjectSettingsFromForm
} from './projectsUI.js';

// Module Form UI
export {
  showModuleModal,
  hideModuleModal,
  updateModuleFormForType,
  updateCountertopOptionsVisibility,
  updateBackPanelOptionsVisibility,
  updateDrawerOptionsVisibility,
  updateDrawerRemainingHeight,
  updateDoorOptionsVisibility,
  updateStretcherOptionsVisibility,
  clearDrawerList,
  addDrawerRow,
  getDrawersFromList,
  clearDoorList,
  addDoorRow,
  getDoorsFromList,
  getModuleFromForm
} from './moduleFormUI.js';

// Results UI
export {
  renderPanelSummary,
  renderPanelDiagrams,
  renderPartsTable,
  showResults,
  exportPartsToCSV
} from './resultsUI.js';

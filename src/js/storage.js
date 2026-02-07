/**
 * Storage service for persisting projects to localStorage
 */

import { STORAGE_KEYS } from './constants.js';

/**
 * Save all projects to localStorage
 * 
 * @param {Array} projects - Array of project objects
 */
export function saveProjects(projects) {
  try {
    const json = JSON.stringify(projects);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, json);
  } catch (error) {
    console.error('Error saving projects to localStorage:', error);
    throw new Error('Failed to save projects. Storage may be full.');
  }
}

/**
 * Migrate old project format to new format
 * Converts 'furniture' to 'modules' and 'marbleThickness' to 'countertopThickness'
 * 
 * @param {Object} project - Project to migrate
 * @returns {Object} - Migrated project
 */
function migrateProject(project) {
  // Migrate furniture -> modules
  if (project.furniture && !project.modules) {
    project.modules = project.furniture.map(item => ({
      ...item,
      hasCountertop: item.hasCountertop !== undefined ? item.hasCountertop : true,
      countertopThickness: item.countertopThickness ?? item.marbleThickness ?? 0
    }));
    delete project.furniture;
  }
  
  // Ensure modules array exists
  if (!project.modules) {
    project.modules = [];
  }
  
  // Migrate modules to add hasBackPanel if missing
  project.modules = project.modules.map(m => ({
    ...m,
    hasBackPanel: m.hasBackPanel ?? true
  }));
  
  // Migrate settings
  if (project.settings) {
    if (project.settings.defaultMarbleThickness && !project.settings.defaultCountertopThickness) {
      project.settings.defaultCountertopThickness = project.settings.defaultMarbleThickness;
      delete project.settings.defaultMarbleThickness;
    }
    if (!project.settings.panelPrices) {
      project.settings.panelPrices = { '18': 0, '5.5': 0, '3': 0 };
    }
  }
  
  return project;
}

/**
 * Load all projects from localStorage
 * 
 * @returns {Array} - Array of project objects
 */
export function loadProjects() {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!json) {
      return [];
    }
    const projects = JSON.parse(json);
    return projects.map(migrateProject);
  } catch (error) {
    console.error('Error loading projects from localStorage:', error);
    return [];
  }
}

/**
 * Save a single project (adds or updates)
 * 
 * @param {Object} project - Project to save
 */
export function saveProject(project) {
  const projects = loadProjects();
  const index = projects.findIndex(p => p.id === project.id);
  
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  
  saveProjects(projects);
}

/**
 * Delete a project by ID
 * 
 * @param {string} projectId - Project ID to delete
 */
export function deleteProject(projectId) {
  const projects = loadProjects();
  const filtered = projects.filter(p => p.id !== projectId);
  saveProjects(filtered);
}

/**
 * Get a project by ID
 * 
 * @param {string} projectId - Project ID
 * @returns {Object|null} - Project or null if not found
 */
export function getProject(projectId) {
  const projects = loadProjects();
  return projects.find(p => p.id === projectId) || null;
}

/**
 * Check if localStorage is available
 * 
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Export projects as JSON string (for backup)
 * 
 * @returns {string} - JSON string of all projects
 */
export function exportProjects() {
  const projects = loadProjects();
  return JSON.stringify(projects, null, 2);
}

/**
 * Import projects from JSON string
 * 
 * @param {string} json - JSON string of projects
 * @param {boolean} merge - If true, merge with existing; if false, replace
 */
export function importProjects(json, merge = true) {
  try {
    const imported = JSON.parse(json);
    
    if (!Array.isArray(imported)) {
      throw new Error('Invalid format: expected array of projects');
    }
    
    if (merge) {
      const existing = loadProjects();
      const existingIds = new Set(existing.map(p => p.id));
      const newProjects = imported.filter(p => !existingIds.has(p.id));
      saveProjects([...existing, ...newProjects]);
    } else {
      saveProjects(imported);
    }
    
    return imported.length;
  } catch (error) {
    console.error('Error importing projects:', error);
    throw new Error('Failed to import projects. Invalid JSON format.');
  }
}

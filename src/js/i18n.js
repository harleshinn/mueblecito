/**
 * Internationalization (i18n) Module
 * Provides translations for English and Spanish
 */

/**
 * Translation dictionaries
 */
export const translations = {
  en: {
    // App header
    appTitle: 'Mueblecito',
    appPageTitle: 'Mueblecito - MDF Cut Plan Generator',
    appSubtitle: 'MDF Modular Cabinet Cut Plan Generator',
    
    // Projects section
    projects: 'Projects',
    newProject: '+ New Project',
    enterProjectName: 'Enter project name:',
    defaultProjectName: 'New Project',
    noProjects: 'No projects yet. Click "New Project" to get started.',
    lastModified: 'Last modified',
    deleteConfirm: 'Are you sure you want to delete this project?',
    
    // Project settings
    projectSettings: 'Project Settings',
    closeModal: 'Close',
    projectName: 'Project Name',
    defaultCountertopThickness: 'Default Countertop Thickness (mm)',
    defaultLegHeight: 'Default Leg Height (mm)',
    panelDiscardMargin: 'Panel Discard Margin (mm)',
    kerfWidth: 'Kerf Width (mm)',
    drawerSlideClearance: 'Drawer Slide Clearance per side (mm)',
    panelPrices: 'Panel Prices (per full panel)',
    thickness18mm: '18 mm',
    thickness55mm: '5.5 mm',
    thickness3mm: '3 mm',
    panelMm: 'mm Panel',
    saveSettings: 'Save Settings',
    editSettings: 'Edit Settings',
    backToProjects: '← Back to Projects',
    
    // Modules
    modules: 'Modules',
    addModule: '+ Add Module',
    editModule: 'Edit Module',
    noModules: 'No modules yet. Click "Add Module" to start designing.',
    lowerCabinet: 'Lower Cabinet',
    upperCabinet: 'Upper Cabinet',
    includeInCalculation: 'Include in calculation',
    
    // Module form
    name: 'Name',
    type: 'Type',
    quantity: 'Quantity',
    dimensions: 'Dimensions (mm)',
    width: 'Width',
    depth: 'Depth',
    totalHeight: 'Total Height',
    
    // Lower cabinet options
    lowerCabinetOptions: 'Lower Cabinet Options',
    legHeight: 'Leg Height (mm)',
    hasCountertop: 'Has Countertop',
    countertopThickness: 'Countertop Thickness (mm)',
    
    // Panel thicknesses
    panelThicknesses: 'Panel Thicknesses (mm)',
    structuralPanels: 'Structural Panels',
    backPanel: 'Back Panel',
    
    // Back panel
    hasBackPanel: 'Has Back Panel',
    backPanelPlacement: 'Back Panel Placement',
    inset: 'Inset (inside the box)',
    external: 'External (mounted on back)',
    
    // Box configuration
    boxConfiguration: 'Box Configuration',
    hasTopPanel: 'Has Top Panel',
    
    // Stretchers
    stretchers: 'Stretchers',
    topStretcher: 'Top Stretcher',
    bottomStretcher: 'Bottom Stretcher',
    height: 'Height (mm)',
    
    // Doors
    doors: 'Doors',
    indexLabel: 'No.',
    hasDoors: 'Has Doors',
    doorType: 'Door Mounting',
    doorTypeInset: 'Inset (inside frame)',
    doorTypeOverlay: 'Overlay (over frame)',
    doorGap: 'Door Gap (mm)',
    doorStyle: 'Door Style',
    doorStyleFlat: 'Flat (slab)',
    doorStyleShaker: 'Shaker (frame + panel)',
    shakerRailWidth: 'Rail Width (mm)',
    shakerStileWidth: 'Stile Width (mm)',
    shakerPanelThickness: 'Center Panel',
    shakerOptions: 'Shaker Door Options',
    addDoor: '+ Add Door',
    
    // Drawers
    drawers: 'Drawers',
    hasDrawers: 'Has Drawers',
    drawerFrontType: 'Drawer Mounting',
    drawerFrontTypeInset: 'Inset (inside frame)',
    drawerFrontTypeOverlay: 'Overlay (over frame)',
    drawerFrontStyle: 'Drawer Front Style',
    drawerFrontStyleFlat: 'Flat (slab)',
    drawerFrontStyleShaker: 'Shaker (frame + panel)',
    drawerShakerOptions: 'Shaker Drawer Options',
    drawerShakerRailWidth: 'Rail Width (mm)',
    drawerShakerStileWidth: 'Stile Width (mm)',
    drawerShakerPanelThickness: 'Center Panel',
    slideClearance: 'Slide Clearance (mm)',
    drawerBottom: 'Drawer Bottom',
    verticalSpacing: 'Vertical Spacing (mm)',
    addDrawer: '+ Add Drawer',
    drawerHeight: 'Front Height',
    drawerBoxHeight: 'Box Height',
    drawerDepth: 'Depth',
    remainingHeight: 'Remaining',
    availableHeight: 'Available',
    exceedsHeight: 'Exceeds',
    auto: 'Auto',
    
    // Form actions
    cancel: 'Cancel',
    save: 'Save',
    saveModule: 'Save Module',
    delete: 'Delete',
    edit: 'Edit',
    
    // Results
    cutPlanResults: 'Cut Plan Results',
    generateCutPlan: 'Generate Cut Plan',
    exportToCSV: 'Export to CSV',
    cuttingDiagram: 'Cutting Diagram',
    partsList: 'Parts List',
    
    // Panel summary
    total: 'Total',
    panelsNeeded: 'Panels Needed',
    usage: 'Usage',
    optimization: 'Optimization',
    used: 'used',
    fullPanels: 'Full Panels',
    byUsage: 'By Usage',
    grandTotal: 'Grand Total',
    stockSize: 'Stock Size',
    usable: 'Usable',
    pieces: 'pieces',
    
    // Parts table
    partName: 'Part Name',
    partQty: 'Quantity',
    partWidth: 'Width (mm)',
    partLength: 'Length (mm)',
    partThickness: 'Thickness (mm)',
    noParts: 'No parts to display',
    noDiagrams: 'No parts to display',
    
    // CSV export
    noPartsToExport: 'No parts to export. Generate a cut plan first.',
    module: 'Module',
    
    // Panel labels in diagram
    panel: 'Panel',
    
    // Project card
    estimatedCost: 'Estimated cost',
    
    // Part types
    'partType.side': 'Side Panel',
    'partType.top': 'Top Panel',
    'partType.base': 'Base Panel',
    'partType.bottom': 'Bottom Panel',
    'partType.back': 'Back Panel',
    'partType.door': 'Door',
    'partType.doorStile': 'Door Stile',
    'partType.doorRail': 'Door Rail',
    'partType.doorPanel': 'Door Panel',
    'partType.stretcherTop': 'Top Stretcher',
    'partType.stretcherBottom': 'Bottom Stretcher',
    'partType.drawerSide': 'Drawer Side',
    'partType.drawerFront': 'Drawer Front',
    'partType.drawerBack': 'Drawer Back',
    'partType.drawerBottom': 'Drawer Bottom',
    'partType.drawerFace': 'Drawer Face',
    'partType.drawerFaceStile': 'Drawer Face Stile',
    'partType.drawerFaceRail': 'Drawer Face Rail',
    'partType.drawerFacePanel': 'Drawer Face Panel',
    
    // Footer
    copyright: '© 2026 Mueblecito - Workshop-Realistic MDF Cut Plans',
    
    // 3D Preview
    '3dPreview': '3D Preview',
    fillPanels: 'Fill panels',
    colorSettings: 'Colors',
    customColor: 'Custom',
    searchColor: 'Search color...',
    noColorsFound: 'No colors found',
    browsePalette: 'Browse',
    colorPalette: 'Color Palette',
    colorsShown: 'colors shown',
    cabinetColor: 'Cabinet',
    doorColor: 'Doors',
    drawerColor: 'Drawers',
    stretcherColor: 'Stretchers',
    legColor: 'Legs',
    
    // Language
    language: 'Language',
    english: 'English',
    spanish: 'Spanish',
    selectLanguage: 'Select language',
    languageOptionEn: '🇺🇸 English',
    languageOptionEs: '🇪🇸 Español',
  },
  
  es: {
    // App header
    appTitle: 'Mueblecito',
    appPageTitle: 'Mueblecito - Generador de Plan de Corte MDF',
    appSubtitle: 'Generador de Plan de Corte para MDF Modular',
    
    // Projects section
    projects: 'Proyectos',
    newProject: '+ Nuevo Proyecto',
    enterProjectName: 'Ingresa el nombre del proyecto:',
    defaultProjectName: 'Nuevo Proyecto',
    noProjects: 'No hay proyectos. Haz clic en "Nuevo Proyecto" para comenzar.',
    lastModified: 'Última modificación',
    deleteConfirm: '¿Estás seguro de que deseas eliminar este proyecto?',
    
    // Project settings
    projectSettings: 'Configuración del Proyecto',
    closeModal: 'Cerrar',
    projectName: 'Nombre del Proyecto',
    defaultCountertopThickness: 'Grosor de Mesada por defecto (mm)',
    defaultLegHeight: 'Altura de Patas por defecto (mm)',
    panelDiscardMargin: 'Margen de Descarte del Panel (mm)',
    kerfWidth: 'Ancho de Corte (mm)',
    drawerSlideClearance: 'Holgura de Corredera por lado (mm)',
    panelPrices: 'Precios de Paneles (por panel completo)',
    thickness18mm: '18 mm',
    thickness55mm: '5.5 mm',
    thickness3mm: '3 mm',
    panelMm: 'mm Panel',
    saveSettings: 'Guardar Configuración',
    editSettings: 'Editar Configuración',
    backToProjects: '← Volver a Proyectos',
    
    // Modules
    modules: 'Módulos',
    addModule: '+ Agregar Módulo',
    editModule: 'Editar Módulo',
    noModules: 'No hay módulos. Haz clic en "Agregar Módulo" para comenzar.',
    lowerCabinet: 'Bajomesada',
    upperCabinet: 'Alacena',
    includeInCalculation: 'Incluir en cálculo',
    
    // Module form
    name: 'Nombre',
    type: 'Tipo',
    quantity: 'Cantidad',
    dimensions: 'Dimensiones (mm)',
    width: 'Ancho',
    depth: 'Profundidad',
    totalHeight: 'Altura Total',
    
    // Lower cabinet options
    lowerCabinetOptions: 'Opciones de Bajomesada',
    legHeight: 'Altura de Patas (mm)',
    hasCountertop: 'Tiene Mesada',
    countertopThickness: 'Grosor de Mesada (mm)',
    
    // Panel thicknesses
    panelThicknesses: 'Grosores de Paneles (mm)',
    structuralPanels: 'Paneles Estructurales',
    backPanel: 'Panel Trasero',
    
    // Back panel
    hasBackPanel: 'Tiene Panel Trasero',
    backPanelPlacement: 'Ubicación del Panel Trasero',
    inset: 'Embutido (dentro de la caja)',
    external: 'Externo (montado atrás)',
    
    // Box configuration
    boxConfiguration: 'Configuración de Caja',
    hasTopPanel: 'Tiene Panel Superior',
    
    // Stretchers
    stretchers: 'Travesaños',
    topStretcher: 'Travesaño Superior',
    bottomStretcher: 'Travesaño Inferior',
    height: 'Altura (mm)',
    
    // Doors
    doors: 'Puertas',
    indexLabel: 'N°',
    hasDoors: 'Tiene Puertas',
    doorType: 'Montaje de Puerta',
    doorTypeInset: 'Embutida (dentro del marco)',
    doorTypeOverlay: 'Superpuesta (sobre el marco)',
    doorGap: 'Separación de Puertas (mm)',
    doorStyle: 'Estilo de Puerta',
    doorStyleFlat: 'Lisa (una pieza)',
    doorStyleShaker: 'Shaker (marco + panel)',
    shakerRailWidth: 'Ancho Travesaño (mm)',
    shakerStileWidth: 'Ancho Montante (mm)',
    shakerPanelThickness: 'Panel Central',
    shakerOptions: 'Opciones de Puerta Shaker',
    addDoor: '+ Agregar Puerta',
    
    // Drawers
    drawers: 'Cajones',
    hasDrawers: 'Tiene Cajones',
    drawerFrontType: 'Montaje de Frente',
    drawerFrontTypeInset: 'Embutido (dentro del marco)',
    drawerFrontTypeOverlay: 'Superpuesto (sobre el marco)',
    drawerFrontStyle: 'Estilo del Frente',
    drawerFrontStyleFlat: 'Liso (una pieza)',
    drawerFrontStyleShaker: 'Shaker (marco + panel)',
    drawerShakerOptions: 'Opciones Shaker del Cajón',
    drawerShakerRailWidth: 'Ancho Travesaño (mm)',
    drawerShakerStileWidth: 'Ancho Montante (mm)',
    drawerShakerPanelThickness: 'Panel Central',
    slideClearance: 'Holgura de Corredera (mm)',
    drawerBottom: 'Fondo del Cajón',
    verticalSpacing: 'Separación Vertical (mm)',
    addDrawer: '+ Agregar Cajón',
    drawerHeight: 'Alto Frente',
    drawerBoxHeight: 'Alto Caja',
    drawerDepth: 'Profundidad',
    remainingHeight: 'Restante',
    availableHeight: 'Disponible',
    exceedsHeight: 'Excede',
    auto: 'Auto',
    
    // Form actions
    cancel: 'Cancelar',
    save: 'Guardar',
    saveModule: 'Guardar Módulo',
    delete: 'Eliminar',
    edit: 'Editar',
    
    // Results
    cutPlanResults: 'Resultados del Plan de Corte',
    generateCutPlan: 'Generar Plan de Corte',
    exportToCSV: 'Exportar a CSV',
    cuttingDiagram: 'Diagrama de Corte',
    partsList: 'Despiece',
    
    // Panel summary
    total: 'Total',
    panelsNeeded: 'Paneles Necesarios',
    usage: 'Uso',
    optimization: 'Optimización',
    used: 'usado',
    fullPanels: 'Paneles Completos',
    byUsage: 'Por Uso',
    grandTotal: 'Total General',
    stockSize: 'Tamaño de Stock',
    usable: 'Usable',
    pieces: 'piezas',
    
    // Parts table
    partName: 'Pieza',
    partQty: 'Cant.',
    partWidth: 'Ancho (mm)',
    partLength: 'Largo (mm)',
    partThickness: 'Espesor (mm)',
    noParts: 'No hay partes para mostrar',
    noDiagrams: 'No hay partes para mostrar',
    
    // CSV export
    noPartsToExport: 'No hay partes para exportar. Genera un plan de corte primero.',
    module: 'Módulo',
    
    // Panel labels in diagram
    panel: 'Panel',
    
    // Project card
    estimatedCost: 'Costo estimado',
    
    // Part types
    'partType.side': 'Panel Lateral',
    'partType.top': 'Panel Superior',
    'partType.base': 'Panel Base',
    'partType.bottom': 'Panel Inferior',
    'partType.back': 'Panel Trasero',
    'partType.door': 'Puerta',
    'partType.doorStile': 'Montante de Puerta',
    'partType.doorRail': 'Travesaño de Puerta',
    'partType.doorPanel': 'Panel de Puerta',
    'partType.stretcherTop': 'Travesaño Superior',
    'partType.stretcherBottom': 'Travesaño Inferior',
    'partType.drawerSide': 'Lateral Cajón',
    'partType.drawerFront': 'Frente Cajón',
    'partType.drawerBack': 'Fondo Cajón',
    'partType.drawerBottom': 'Piso Cajón',
    'partType.drawerFace': 'Cara Cajón',
    'partType.drawerFaceStile': 'Montante Cara Cajón',
    'partType.drawerFaceRail': 'Travesaño Cara Cajón',
    'partType.drawerFacePanel': 'Panel Cara Cajón',
    
    // Footer
    copyright: '© 2026 Mueblecito - Planes de Corte MDF Realistas',
    
    // 3D Preview
    '3dPreview': 'Vista 3D',
    fillPanels: 'Rellenar paneles',
    colorSettings: 'Colores',
    customColor: 'Personalizado',
    searchColor: 'Buscar color...',
    noColorsFound: 'No se encontraron colores',
    browsePalette: 'Explorar',
    colorPalette: 'Paleta de Colores',
    colorsShown: 'colores mostrados',
    cabinetColor: 'Gabinete',
    doorColor: 'Puertas',
    drawerColor: 'Cajones',
    stretcherColor: 'Travesaños',
    legColor: 'Patas',
    
    // Language
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español',
    selectLanguage: 'Seleccionar idioma',
    languageOptionEn: '🇺🇸 Inglés',
    languageOptionEs: '🇪🇸 Español',
  }
};

// Current language (default: Spanish for the original app)
let currentLanguage = 'es';

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} - Translated string
 */
export function t(key, params = {}) {
  const dict = translations[currentLanguage] || translations.es;
  let text = dict[key] || translations.es[key] || key;
  
  // Simple interpolation: replace {param} with value
  for (const [param, value] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
  }
  
  return text;
}

/**
 * Get current language
 * @returns {string} - Current language code
 */
export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Set current language
 * @param {string} lang - Language code ('en' or 'es')
 */
export function setLanguage(lang) {
  if (translations[lang]) {
    currentLanguage = lang;
    localStorage.setItem('mueblecito-language', lang);
    return true;
  }
  return false;
}

/**
 * Initialize language from localStorage or browser preference
 */
export function initLanguage() {
  // Check localStorage first
  const saved = localStorage.getItem('mueblecito-language');
  if (saved && translations[saved]) {
    currentLanguage = saved;
    return;
  }
  
  // Check browser language
  const browserLang = navigator.language?.substring(0, 2);
  if (browserLang === 'en') {
    currentLanguage = 'en';
  } else {
    currentLanguage = 'es'; // Default to Spanish
  }
}

/**
 * Get available languages
 * @returns {Array} - Array of {code, name} objects
 */
export function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' }
  ];
}

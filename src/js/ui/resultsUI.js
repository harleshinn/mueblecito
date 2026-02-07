/**
 * Results UI Module
 * Handles panel summary, cutting diagrams, parts accordion, and CSV export
 */
import { getElements } from './elements.js';
import { escapeHtml, formatCurrency, getPartColor, translatePartName, setInnerHTML } from './helpers.js';
import { t } from '../i18n.js';

/**
 * Render panel summary
 * 
 * @param {Object} panelResults - Panel calculation results
 */
export function renderPanelSummary(panelResults) {
  const elements = getElements();
  const { byThickness, totalPanels, totalCost, totalProportionalCost, overallUsagePercent, usableDimensions, stockDimensions } = panelResults;
  
  let html = `
    <div class="panel-summary-card">
      <div class="panel-thickness">${t('total')}</div>
      <div class="panel-count">${totalPanels}</div>
      <div class="panel-label">${t('panelsNeeded')}</div>
    </div>
  `;
  
  // Usage efficiency card
  html += `
    <div class="panel-summary-card">
      <div class="panel-thickness">${t('usage')}</div>
      <div class="panel-count" style="font-size: 1.25rem;">${overallUsagePercent.toFixed(1)}%</div>
      <div class="panel-label">${t('optimization')}</div>
    </div>
  `;
  
  // Per-thickness breakdown with pricing
  for (const [thickness, data] of Object.entries(byThickness)) {
    let usageInfo = `${data.usagePercent.toFixed(0)}% ${t('used')}`;
    let priceHtml = '';
    
    if (data.pricePerPanel > 0) {
      priceHtml = `
        <div class="panel-pricing">
          <span class="pricing-row">
            <span>${t('fullPanels')} (${data.panelCount}):</span>
            <span>$${formatCurrency(data.cost)}</span>
          </span>
          <span class="pricing-row pricing-recommended">
            <span>${t('byUsage')}:</span>
            <span>$${formatCurrency(data.proportionalCost)}</span>
          </span>
        </div>
      `;
    }
    
    html += `
      <div class="panel-summary-card">
        <div class="panel-thickness">${thickness} mm MDF</div>
        <div class="panel-count">${data.panelCount}</div>
        <div class="panel-label">${data.partCount} ${t('pieces')} • ${usageInfo}</div>
        ${priceHtml}
      </div>
    `;
  }
  
  // Grand total pricing (if any prices are set)
  if (totalCost > 0) {
    html += `
      <div class="panel-summary-card pricing-card">
        <div class="panel-thickness">${t('grandTotal')}</div>
        <div class="pricing-options">
          <div class="pricing-option">
            <span class="pricing-label">${t('fullPanels')} (${totalPanels}):</span>
            <span class="pricing-value">$${formatCurrency(totalCost)}</span>
          </div>
          <div class="pricing-option pricing-recommended">
            <span class="pricing-label">${t('byUsage')} (${overallUsagePercent.toFixed(0)}%):</span>
            <span class="pricing-value">$${formatCurrency(totalProportionalCost)}</span>
          </div>
        </div>
      </div>
    `;
  }
  
  html += `
    <div class="panel-summary-card">
      <div class="panel-thickness">${t('stockSize')}</div>
      <div class="panel-count" style="font-size: 1rem;">${stockDimensions.width} × ${stockDimensions.height}</div>
      <div class="panel-label">${t('usable')}: ${usableDimensions.width} × ${usableDimensions.height} mm</div>
    </div>
  `;
  
  setInnerHTML(elements.panelSummary, html);
}

/**
 * Render panel cutting diagrams
 * 
 * @param {Object} panelResults - Panel calculation results
 */
export function renderPanelDiagrams(panelResults) {
  const elements = getElements();
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
          <div class="panel-diagram-label">${t('panel')} ${parseInt(panelIdx) + 1}</div>
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
               title="${escapeHtml(placement.moduleName)}: ${escapeHtml(translatePartName(placement.partName))} (${dimLabel})${rotatedIcon}">
            <span class="part-label">${escapeHtml(translatePartName(placement.partName))}</span>
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
    html = `<p class="no-diagrams">${t('noDiagrams')}</p>`;
  }
  
  setInnerHTML(elements.panelDiagrams, html);
}

/**
 * Render parts table as accordion grouped by module
 * 
 * @param {Array} parts - Parts list
 */
export function renderPartsTable(parts) {
  const elements = getElements();
  
  if (parts.length === 0) {
    setInnerHTML(elements.partsAccordion, `
      <p class="no-parts">${t('noParts')}</p>
    `);
    return;
  }
  
  // Group parts by module
  const groupedParts = {};
  for (const part of parts) {
    if (!groupedParts[part.moduleName]) {
      groupedParts[part.moduleName] = [];
    }
    groupedParts[part.moduleName].push(part);
  }
  
  // Generate accordion HTML
  let html = '';
  let index = 0;
  
  for (const [moduleName, moduleParts] of Object.entries(groupedParts)) {
    const totalParts = moduleParts.reduce((sum, p) => sum + p.quantity, 0);
    const isFirst = index === 0;
    
    html += `
      <div class="accordion-panel ${isFirst ? 'accordion-panel--open' : ''}">
        <button type="button" class="accordion-header" aria-expanded="${isFirst}">
          <span class="accordion-title">${escapeHtml(moduleName)}</span>
          <span class="accordion-badge">${totalParts} ${t('pieces')}</span>
          <span class="accordion-icon"></span>
        </button>
        <div class="accordion-content">
          <table class="parts-table">
            <thead>
              <tr>
                <th>${t('partName')}</th>
                <th>${t('partQty')}</th>
                <th>${t('partWidth')}</th>
                <th>${t('partLength')}</th>
                <th>${t('partThickness')}</th>
              </tr>
            </thead>
            <tbody>
              ${moduleParts.map(part => `
                <tr>
                  <td>${escapeHtml(translatePartName(part.partName))}</td>
                  <td>${part.quantity}</td>
                  <td>${part.width}</td>
                  <td>${part.height}</td>
                  <td>${part.thickness}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    index++;
  }
  
  setInnerHTML(elements.partsAccordion, html);
  
  // Attach accordion toggle handlers
  elements.partsAccordion.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const panel = header.closest('.accordion-panel');
      const isOpen = panel.classList.contains('accordion-panel--open');
      
      // Toggle this panel
      panel.classList.toggle('accordion-panel--open');
      header.setAttribute('aria-expanded', !isOpen);
    });
  });
}

/**
 * Show results section
 */
export function showResults() {
  const elements = getElements();
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
    alert(t('noPartsToExport'));
    return;
  }
  
  // CSV header
  const headers = [t('module'), t('partName'), t('partQty'), t('partWidth'), t('partLength'), t('partThickness')];
  
  // Build CSV content
  const rows = parts.map(part => [
    `"${part.moduleName.replace(/"/g, '""')}"`,
    `"${translatePartName(part.partName).replace(/"/g, '""')}"`,
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

/**
 * UI Helper Functions
 * Shared utilities used across UI modules
 */

import { t } from '../i18n.js';
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string using DOMPurify
 * Allows safe HTML tags but removes scripts and event handlers
 * 
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
export function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                   'table', 'thead', 'tbody', 'tr', 'th', 'td',
                   'button', 'input', 'select', 'option', 'label', 'fieldset', 'legend',
                   'form', 'strong', 'em', 'br', 'a'],
    ALLOWED_ATTR: ['class', 'id', 'data-id', 'data-i18n', 'type', 'value', 'checked', 
                   'min', 'max', 'step', 'placeholder', 'required', 'disabled',
                   'aria-expanded', 'title', 'style', 'for', 'name', 'selected']
  });
}

/**
 * Safely set innerHTML of an element using DOMPurify sanitization
 * 
 * @param {HTMLElement} element - DOM element
 * @param {string} html - HTML string to set
 */
export function setInnerHTML(element, html) {
  element.innerHTML = sanitizeHtml(html);
}

/**
 * Escape HTML to prevent XSS
 * 
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Format date for display
 * 
 * @param {string} isoDate - ISO date string
 * @returns {string} - Formatted date
 */
export function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString();
}

/**
 * Format currency value
 * 
 * @param {number} value - Value to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value) {
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
export function getPartColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PART_COLORS.length;
  return PART_COLORS[index];
}

/**
 * Translate a part name that may contain a translation key and suffix
 * Handles formats like "partType.side" or "partType.drawerSide #1"
 * 
 * @param {string} partName - Part name (translation key with optional suffix)
 * @returns {string} - Translated part name
 */
export function translatePartName(partName) {
  if (!partName) return '';
  
  // Check if this looks like a translation key (starts with "partType.")
  if (partName.startsWith('partType.')) {
    // Check for suffix like " #1"
    const suffixMatch = partName.match(/^(partType\.[a-zA-Z]+)(.*)$/);
    if (suffixMatch) {
      const key = suffixMatch[1];
      const suffix = suffixMatch[2] || '';
      return t(key) + suffix;
    }
  }
  
  return partName;
}

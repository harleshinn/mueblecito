import {
  calculatePanelsForParts,
  getUsablePanelDimensions,
  groupPartsByThickness
} from '../src/js/panelCalculations.js';
import { DEFAULTS, PANEL_STOCK } from '../src/js/constants.js';

describe('panelCalculations', () => {
  test('getUsablePanelDimensions subtracts discard margin', () => {
    const usable = getUsablePanelDimensions(DEFAULTS.PANEL_DISCARD_MARGIN);
    expect(usable.width).toBe(PANEL_STOCK.WIDTH - (DEFAULTS.PANEL_DISCARD_MARGIN * 2));
    expect(usable.height).toBe(PANEL_STOCK.HEIGHT - (DEFAULTS.PANEL_DISCARD_MARGIN * 2));
  });

  test('groupPartsByThickness groups by thickness', () => {
    const parts = [
      { thickness: 18 },
      { thickness: 3 },
      { thickness: 18 }
    ];

    const grouped = groupPartsByThickness(parts);
    expect(grouped[18]).toHaveLength(2);
    expect(grouped[3]).toHaveLength(1);
  });

  test('calculatePanelsForParts fits small parts on one panel', () => {
    const parts = [
      { moduleName: 'A', partName: 'partType.side', quantity: 1, width: 100, height: 100, thickness: 18 },
      { moduleName: 'A', partName: 'partType.top', quantity: 1, width: 120, height: 80, thickness: 18 }
    ];

    const result = calculatePanelsForParts(parts, DEFAULTS.KERF_WIDTH, DEFAULTS.PANEL_DISCARD_MARGIN);
    expect(result.panelCount).toBe(1);
    expect(result.placements.length).toBe(2);
  });
});

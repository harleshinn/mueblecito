import { generateProjectParts, getPartsSummary } from '../src/js/partsGenerator.js';
import { createModule } from '../src/js/models.js';
import { CABINET_TYPES } from '../src/js/constants.js';

describe('partsGenerator', () => {
  test('generateProjectParts skips excluded modules', () => {
    const included = createModule({ name: 'Included', type: CABINET_TYPES.LOWER });
    const excluded = createModule({ name: 'Excluded', type: CABINET_TYPES.LOWER, includeInCalculation: false });

    const parts = generateProjectParts({ modules: [included, excluded] });

    expect(parts.some(part => part.moduleName === 'Included')).toBe(true);
    expect(parts.some(part => part.moduleName === 'Excluded')).toBe(false);
  });

  test('getPartsSummary aggregates counts and area', () => {
    const parts = [
      { quantity: 2, width: 100, height: 200, thickness: 18 },
      { quantity: 1, width: 50, height: 100, thickness: 3 }
    ];

    const summary = getPartsSummary(parts);

    expect(summary.totalParts).toBe(3);
    expect(summary.byThickness[18].count).toBe(2);
    expect(summary.byThickness[3].count).toBe(1);
  });
});

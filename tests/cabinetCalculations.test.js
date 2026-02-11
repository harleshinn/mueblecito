import {
  calculateBoxHeight,
  calculateInternalHeight,
  calculateInternalWidth,
  generateCabinetParts
} from '../src/js/cabinetCalculations.js';
import { BACK_PANEL_TYPES, CABINET_TYPES, PART_TYPES } from '../src/js/constants.js';

const baseModule = {
  name: 'Base',
  quantity: 1,
  width: 600,
  depth: 500,
  height: 850,
  structuralThickness: 18,
  backThickness: 3,
  hasBackPanel: true,
  backPanelType: BACK_PANEL_TYPES.INSET,
  hasTopStretcher: false,
  hasBottomStretcher: false,
  hasDoors: false,
  doors: []
};

function buildLower(overrides = {}) {
  return {
    ...baseModule,
    type: CABINET_TYPES.LOWER,
    hasCountertop: true,
    countertopThickness: 20,
    legHeight: 100,
    hasTop: true,
    ...overrides
  };
}

function buildUpper(overrides = {}) {
  return {
    ...baseModule,
    type: CABINET_TYPES.UPPER,
    height: 700,
    hasTop: true,
    ...overrides
  };
}

function findPart(parts, partName) {
  return parts.find(part => part.partName === partName);
}

describe('cabinetCalculations', () => {
  test('calculateBoxHeight for lower cabinet', () => {
    const module = buildLower();
    expect(calculateBoxHeight(module)).toBe(730);
  });

  test('calculateInternalHeight respects top panel', () => {
    const module = buildLower();
    expect(calculateInternalHeight(module)).toBe(694);

    const noTop = buildLower({ hasTop: false });
    expect(calculateInternalHeight(noTop)).toBe(712);
  });

  test('calculateInternalHeight for upper cabinet', () => {
    const module = buildUpper();
    expect(calculateInternalHeight(module)).toBe(700 - (18 * 2));
  });

  test('generateCabinetParts for lower cabinet', () => {
    const module = buildLower();
    const parts = generateCabinetParts(module);

    expect(parts).toHaveLength(4);
    expect(findPart(parts, PART_TYPES.SIDE).quantity).toBe(2);
    expect(findPart(parts, PART_TYPES.TOP)).toBeDefined();
    expect(findPart(parts, PART_TYPES.BASE)).toBeDefined();
    expect(findPart(parts, PART_TYPES.BACK)).toBeDefined();
  });

  test('generateCabinetParts omits top when disabled', () => {
    const module = buildLower({ hasTop: false });
    const parts = generateCabinetParts(module);

    expect(findPart(parts, PART_TYPES.TOP)).toBeUndefined();
    expect(findPart(parts, PART_TYPES.BASE)).toBeDefined();
  });

  test('generateCabinetParts for upper cabinet uses bottom panel', () => {
    const module = buildUpper();
    const parts = generateCabinetParts(module);

    expect(findPart(parts, PART_TYPES.TOP)).toBeDefined();
    expect(findPart(parts, PART_TYPES.BOTTOM)).toBeDefined();
    expect(findPart(parts, PART_TYPES.BASE)).toBeUndefined();
  });

  test('generateCabinetParts groups doors by size', () => {
    const module = buildLower({
      hasDoors: true,
      doors: [{ width: 300, height: 600 }, { width: 300, height: 600 }]
    });

    const parts = generateCabinetParts(module);
    const doorPart = findPart(parts, PART_TYPES.DOOR);

    expect(doorPart.quantity).toBe(2);
    expect(doorPart.width).toBe(300);
    expect(doorPart.height).toBe(600);
  });

  test('calculateInternalWidth uses structural thickness', () => {
    const module = buildLower();
    expect(calculateInternalWidth(module)).toBe(600 - (18 * 2));
  });
});

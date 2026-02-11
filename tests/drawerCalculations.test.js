import {
  calculateDrawerInternalWidth,
  generateDrawerParts,
  getDrawerDimensionsSummary
} from '../src/js/drawerCalculations.js';
import { CABINET_TYPES, DEFAULTS, PART_TYPES } from '../src/js/constants.js';

const baseModule = {
  name: 'Drawer Module',
  type: CABINET_TYPES.LOWER,
  quantity: 1,
  width: 600,
  depth: 500,
  height: 850,
  structuralThickness: 18,
  drawerSlideClearance: 25,
  drawerBottomThickness: 3,
  hasDrawers: true,
  drawers: []
};

function buildModule(overrides = {}) {
  return {
    ...baseModule,
    ...overrides
  };
}

function findPart(parts, partName) {
  return parts.find(part => part.partName === partName);
}

describe('drawerCalculations', () => {
  test('calculateDrawerInternalWidth accounts for clearance', () => {
    const module = buildModule();
    expect(calculateDrawerInternalWidth(module)).toBe(514);
  });

  test('generateDrawerParts groups identical drawers', () => {
    const module = buildModule({
      drawers: [
        { height: 150, boxHeight: 120, depth: 450 },
        { height: 150, boxHeight: 120, depth: 450 }
      ]
    });

    const parts = generateDrawerParts(module);

    expect(parts).toHaveLength(5);
    expect(findPart(parts, PART_TYPES.DRAWER_SIDE).quantity).toBe(4);
    expect(findPart(parts, PART_TYPES.DRAWER_FRONT).quantity).toBe(2);
    expect(findPart(parts, PART_TYPES.DRAWER_BACK).quantity).toBe(2);
    expect(findPart(parts, PART_TYPES.DRAWER_BOTTOM).quantity).toBe(2);
    expect(findPart(parts, PART_TYPES.DRAWER_FACE).quantity).toBe(2);
  });

  test('getDrawerDimensionsSummary returns null without drawers', () => {
    const module = buildModule({ drawers: [] });
    expect(getDrawerDimensionsSummary(module)).toBeNull();
  });

  test('getDrawerDimensionsSummary returns summary for drawers', () => {
    const module = buildModule({
      drawers: [{ height: DEFAULTS.DRAWER_HEIGHT, boxHeight: DEFAULTS.DRAWER_BOX_HEIGHT, depth: 400 }]
    });

    const summary = getDrawerDimensionsSummary(module);
    expect(summary.count).toBe(1);
    expect(summary.bottomThickness).toBe(3);
  });
});

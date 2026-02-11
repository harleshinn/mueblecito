import { createModule, createProject } from '../src/js/models.js';
import { CABINET_TYPES, DEFAULTS } from '../src/js/constants.js';

describe('models', () => {
  test('createProject applies defaults', () => {
    const project = createProject('Test Project');

    expect(project.name).toBe('Test Project');
    expect(project.settings.panelDiscardMargin).toBe(DEFAULTS.PANEL_DISCARD_MARGIN);
    expect(project.modules).toHaveLength(0);
  });

  test('createModule applies defaults and settings', () => {
    const module = createModule({ type: CABINET_TYPES.LOWER }, { defaultLegHeight: 120 });

    expect(module.type).toBe(CABINET_TYPES.LOWER);
    expect(module.legHeight).toBe(120);
    expect(module.hasTop).toBe(true);
  });
});

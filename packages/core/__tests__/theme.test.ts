import test from 'node:test';
import assert from 'node:assert/strict';

import {
  COLORS,
  DARK_THEME,
  DEFAULT_LAYOUT,
  DEFAULT_RINGS,
  LIGHT_THEME,
  RingConfigSchema,
  computePositions,
  createTheme,
  resolveRings,
  ringFromFlat,
  ringsFromFlat,
  ringsToFlat,
} from '../dist/index.js';
import type { RingConfig, TechradarEntry } from '../dist/index.js';

const legacyRings: RingConfig[] = [{ index: 0, name: 'ADOPT', color: '#ff0000' }];

test('ring colors resolve per theme mode', () => {
  assert.equal(resolveRings(DEFAULT_RINGS, 'light')[0].color, '#5ba300');
  assert.equal(resolveRings(DEFAULT_RINGS, 'dark')[0].color, '#8bd346');
});

test('a single-color ring applies to both modes', () => {
  assert.equal(resolveRings(legacyRings, 'light')[0].color, '#ff0000');
  assert.equal(resolveRings(legacyRings, 'dark')[0].color, '#ff0000');
});

test('flatten/rebuild round-trips without changing shape', () => {
  const flat = ringsToFlat(DEFAULT_RINGS);
  assert.deepEqual(flat[3], {
    index: 3,
    name: 'HOLD',
    color: '#e09b96',
    colorDark: '#f0a9a4',
  });
  assert.deepEqual(ringsFromFlat(flat), DEFAULT_RINGS);
  // A single-color ring must not inflate into a {light, dark} pair.
  assert.deepEqual(ringsFromFlat(ringsToFlat(legacyRings)), legacyRings);
});

test('an absent colorDark collapses to one color', () => {
  assert.deepEqual(ringFromFlat({ index: 0, name: 'A', color: '#abc', colorDark: null }), {
    index: 0,
    name: 'A',
    color: '#abc',
  });
});

test('computePositions takes blip colors from the given theme', () => {
  const entries: TechradarEntry[] = [
    { id: '1', label: 'Active', quadrant: 0, ring: 0, moved: 0, active: true },
    { id: '2', label: 'Retired', quadrant: 0, ring: 0, moved: 0, active: false },
  ];

  const light = computePositions(entries, DEFAULT_RINGS, DEFAULT_LAYOUT, LIGHT_THEME);
  const dark = computePositions(entries, DEFAULT_RINGS, DEFAULT_LAYOUT, DARK_THEME);

  assert.equal(light[0].color, '#5ba300');
  assert.equal(dark[0].color, '#8bd346');
  assert.equal(light[1].color, LIGHT_THEME.inactive);
  assert.equal(dark[1].color, DARK_THEME.inactive);

  // Theming must not disturb blip geometry.
  assert.deepEqual(
    light.map((e) => [e.x, e.y]),
    dark.map((e) => [e.x, e.y])
  );

  // Omitting the theme keeps the pre-theme behavior.
  assert.equal(
    computePositions(entries, DEFAULT_RINGS, DEFAULT_LAYOUT)[0].color,
    '#5ba300'
  );
});

test('createTheme merges overrides and keeps mode authoritative', () => {
  const custom = createTheme('dark', { background: '#000' });
  assert.equal(custom.background, '#000');
  assert.equal(custom.mode, 'dark');
  assert.equal(custom.grid, DARK_THEME.grid);
  assert.equal(createTheme().mode, 'light');
});

test('RingConfigSchema accepts both color forms', () => {
  assert.ok(RingConfigSchema.safeParse({ index: 0, name: 'A', color: '#fff' }).success);
  assert.ok(
    RingConfigSchema.safeParse({
      index: 0,
      name: 'A',
      color: { light: '#fff', dark: '#000' },
    }).success
  );
  assert.ok(
    !RingConfigSchema.safeParse({ index: 0, name: 'A', color: { light: '#fff' } }).success
  );
});

test('the deprecated COLORS export still mirrors the light theme', () => {
  assert.equal(COLORS.background, LIGHT_THEME.background);
  assert.equal(COLORS.grid, LIGHT_THEME.grid);
  assert.equal(COLORS.inactive, LIGHT_THEME.inactive);
});

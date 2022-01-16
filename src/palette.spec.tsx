import { expect } from 'earljs';

import { createPalette, interpolate } from './palette';

describe('palette', () => {
  it('creates a palette with one color', () => {
    const getColor = createPalette({ 0: [0, 1, 0], 1: [0, 1, 0] });

    expect(getColor(0)).toEqual([0, 1, 0]);
    expect(getColor(0.2)).toEqual([0, 1, 0]);
    expect(getColor(1)).toEqual([0, 1, 0]);
  });

  it('creates a gradient between two colors', () => {
    const getColor = createPalette({ 0: [0, 0, 0], 1: [0, 1, 0] });

    expect(getColor(0)).toEqual([0, 0, 0]);
    expect(getColor(0.2)).toEqual([0, 0.2, 0]);
    expect(getColor(0.5)).toEqual([0, 0.5, 0]);
    expect(getColor(1)).toEqual([0, 1, 0]);
  });

  it('creates a gradient between three colors', () => {
    const getColor = createPalette({ 0: [0, 0, 0.1], 0.4: [0, 0, 0.9], 1: [0, 1, 0.3] });

    expect(getColor(0)).toEqual([0, 0, 0.1]);
    expect(getColor(0.2)).toEqual([0, 0, 0.5]);
    expect(getColor(0.4)).toEqual([0, 0, 0.9]);
    // expect(getColor(0.7)).toEqual([0, 0.5, 0.6]);
    expect(getColor(1)).toEqual([0, 1, 0.3]);
  });

  it('interpolate', () => {
    expect(interpolate(0, 0, 1)).toEqual(0);
    expect(interpolate(1, 0, 1)).toEqual(1);
    expect(interpolate(0.5, 0, 1)).toEqual(0.5);
    expect(interpolate(0.5, 0, 0.5)).toEqual(0.25);
    expect(interpolate(0.5, 0.5, 1)).toEqual(0.75);

    expect(interpolate(0.0001, 1, 0)).toEqual(0.9999);
  });
});

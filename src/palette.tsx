type Color = [number, number, number];

export const interpolate = (p: number, v1: number, v2: number) => {
  return (v2 - v1) * p + v1;
};

const interpolateColor = (p: number, [r1, g1, b1]: Color, [r2, g2, b2]: Color) => [
  interpolate(p, r1, r2),
  interpolate(p, g1, g2),
  interpolate(p, b1, b2),
];

export const createPalette = (colors: Record<number, Color>) => {
  const palette = Object.entries(colors)
    .map(([index, color]): [number, Color] => [Number(index), color])
    .sort(([a], [b]) => a - b);

  return (point: number) => {
    let index = 0;

    while (index < palette.length && palette[index][0] < point) {
      index++;
    }

    if (palette[index][0] === point) {
      return palette[index][1];
    }

    const before = palette[index - 1];
    const after = palette[index];

    if (!before || !after) {
      throw new Error('cannot find color');
    }

    const p = (point - before[0]) / Math.abs(after[0] - before[0]);

    return interpolateColor(p, before[1], after[1]);
  };
};

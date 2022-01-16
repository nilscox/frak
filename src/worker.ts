import type { WorkerParams } from './Mandelbrot';

const normalize = (min: number, max: number, value: number) => {
  return (value - min) / (max - min);
};

onmessage = async ({ data: params }: MessageEvent<WorkerParams>) => {
  const { view, zoom, iter } = params;
  const result: Array<{ x: number; y: number; value: number }> = [];

  for (let x = view.x.min; x <= view.x.max; x += view.x.step) {
    postMessage({ type: 'progress', progress: normalize(view.x.min, view.x.max, x) });

    for (let y = view.y.min; y <= view.y.max; y += view.y.step) {
      const cr = x / zoom + params.center.re;
      const ci = y / zoom + params.center.im;

      let zr = 0;
      let zi = 0;

      let n = 0;

      do {
        const t = zr;

        zr = zr * zr - zi * zi + cr;
        zi = 2 * t * zi + ci;
      } while (++n < iter && zr * zr + zi * zi <= 4);

      result.push({ x, y, value: n / iter });
    }
  }

  postMessage({ type: 'result', values: result });
};

import type { WorkerParams } from './Mandelbrot';

const normalize = (min: number, max: number, value: number) => {
  return (value - min) / (max - min);
};

onmessage = async ({ data: params }: MessageEvent<WorkerParams>) => {
  const { view, zoom, iter } = params;
  const result: number[] = [];

  console.time('draw');

  for (let x = 0; x < view.width; x += view.step) {
    // postMessage({ type: 'progress', progress: (x * view.step) / view.width });

    for (let y = 0; y < view.height; y += view.step) {
      const cr = (x - view.width / 2) / zoom + params.center.re;
      const ci = (y - view.height / 2) / zoom + params.center.im;

      let zr = 0;
      let zi = 0;

      // let n = 0;

      // do {
      //   const t = zr;

      //   zr = zr * zr - zi * zi + cr;
      //   zi = 2 * t * zi + ci;
      // } while (++n < iter && zr * zr + zi * zi <= 4);

      let x2 = 0;
      let y2 = 0;
      let w = 0;

      let n = 0;

      while (++n < iter && x2 + y2 <= 4) {
        zr = x2 - y2 + cr;
        zi = w - x2 - y2 + ci;
        x2 = zr * zr;
        y2 = zi * zi;
        w = (zr + zi) * (zr + zi);
      }

      result.push(n / iter);
    }
  }

  console.timeEnd('draw');

  postMessage({ type: 'result', values: new Float32Array(result) });
};

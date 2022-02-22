import { HTMLProps, useEffect, useRef } from 'react';

let worker: Worker | null = null;

export type MandelbrotParams = {
  x: number;
  y: number;
  zoom: number;
  iter: number;
  resolution: number;
};

type Range = {
  min: number;
  max: number;
  step: number;
};

type Complex = {
  re: number;
  im: number;
};

export type WorkerParams = {
  view: {
    width: number;
    height: number;
    step: number;
  };
  center: Complex;
  zoom: number;
  iter: number;
};

function draw(
  canvas: HTMLCanvasElement,
  params: MandelbrotParams,
  getColor: (n: number) => number[],
  onProgress: (progress: number) => void,
  onDrawEnd: () => void,
) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (worker) {
    worker.terminate();
  }

  worker = new Worker('worker.js');

  const view = {
    width: canvas.width,
    height: canvas.height,
    step: params.resolution,
  };

  const center = {
    re: params.x,
    im: params.y,
  };

  const workerParams: WorkerParams = {
    view,
    center,
    zoom: params.zoom,
    iter: params.iter,
  };

  console.time('worker');
  worker.postMessage(workerParams);

  worker.onmessage = (e) => {
    if (e.data.type === 'progress') {
      onProgress(e.data.progress);
      return;
    }

    if (e.data.type !== 'result') {
      return;
    }

    console.timeEnd('worker');
    console.time('render');

    const imageData = ctx.getImageData(0, 0, view.width, view.height);
    const pixels = imageData.data;
    const values: Float32Array = e.data.values;

    for (let x = 0; x < view.width; x += view.step) {
      for (let y = 0; y < view.height; y += view.step) {
        const value = values[x * view.height + y];

        const color = getColor(value);
        const offset = (y * view.width + x) * 4;

        pixels[offset + 0] = color[0];
        pixels[offset + 1] = color[1];
        pixels[offset + 2] = color[2];
        pixels[offset + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    console.timeEnd('render');
    onDrawEnd();
  };
}

type MandelbrotProps = HTMLProps<HTMLCanvasElement> & {
  params: MandelbrotParams;
  getColor: (n: number) => number[];
  onDrawProgress: (progress: number) => void;
  onDrawEnd: () => void;
};

export const Mandelbrot: React.FC<MandelbrotProps> = ({
  params,
  getColor,
  onDrawProgress,
  onDrawEnd,
  ...props
}) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    console.time('total');
    draw(ref.current, params, getColor, onDrawProgress, () => {
      console.timeEnd('total');
      onDrawEnd();
    });
  }, [ref, params, getColor, onDrawProgress, onDrawEnd]);

  return <canvas ref={ref} {...props} />;
};

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
    x: Range;
    y: Range;
  };
  center: Complex;
  zoom: number;
  iter: number;
};

function draw(
  canvas: HTMLCanvasElement,
  params: MandelbrotParams,
  getColor: (n: number) => string,
  onProgress: (progress: number) => void,
  onDrawEnd: () => void,
) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  if (worker) {
    worker.terminate();
  }

  worker = new Worker('worker.js');

  const workerParams: WorkerParams = {
    view: {
      x: {
        min: -canvas.width / 2,
        max: canvas.width / 2,
        step: params.resolution,
      },
      y: {
        min: -canvas.height / 2,
        max: canvas.height / 2,
        step: params.resolution,
      },
    },
    center: {
      re: params.x,
      im: params.y,
    },
    zoom: params.zoom,
    iter: params.iter,
  };

  worker.postMessage(workerParams);

  worker.onmessage = (e) => {
    if (e.data.type === 'progress') {
      onProgress(e.data.progress);
      return;
    }

    if (e.data.type !== 'result') {
      return;
    }

    const values: Array<{ x: number; y: number; value: number }> = e.data.values;

    for (const { x, y, value } of values) {
      ctx.fillStyle = value === 1 ? '#000' : getColor(value);

      ctx.fillRect(
        x - workerParams.view.x.min,
        y - workerParams.view.y.min,
        params.resolution,
        params.resolution,
      );
    }

    onDrawEnd();
  };
}

type MandelbrotProps = HTMLProps<HTMLCanvasElement> & {
  params: MandelbrotParams;
  getColor: (n: number) => string;
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

    draw(ref.current, params, getColor, onDrawProgress, onDrawEnd);
  }, [ref, params, getColor, onDrawProgress, onDrawEnd]);

  return <canvas ref={ref} {...props} />;
};

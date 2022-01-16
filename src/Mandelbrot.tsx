import { useEffect, useState } from 'react';

export type MandelbrotParams = {
  x: number;
  y: number;
  zoom: number;
  iter: number;
  resolution: number;
  palette: (n: number) => string;
};

function draw(canvas: HTMLCanvasElement, params: MandelbrotParams) {
  const { zoom, iter } = params;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  console.time('draw');

  for (let x = 0; x < canvas.width; x += params.resolution) {
    for (let y = 0; y < canvas.height; y += params.resolution) {
      const cr = (x - canvas.width / 2) / zoom + params.x;
      const ci = (y - canvas.height / 2) / zoom + params.y;

      let zr = 0;
      let zi = 0;

      let n = 0;

      do {
        const t = zr;

        zr = zr * zr - zi * zi + cr;
        zi = 2 * t * zi + ci;
      } while (++n < iter && zr * zr + zi * zi <= 4);

      if (n === iter) {
        ctx.fillStyle = '#000000';
      } else {
        ctx.fillStyle = params.palette(n / iter);
      }

      ctx.fillRect(x, y, params.resolution, params.resolution);
    }
  }

  console.timeEnd('draw');
}

type MandelbrotProps = {
  width: number;
  height: number;
  params: MandelbrotParams;
  onKeyDown: (key: string) => void;
  onDrawEnd: () => void;
};

export const Mandelbrot: React.FC<MandelbrotProps> = ({ width, height, params, onKeyDown, onDrawEnd }) => {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef) {
      return;
    }

    const handler = (event: any) => onKeyDown(event.key);

    canvasRef.addEventListener('keydown', handler);

    return () => canvasRef.removeEventListener('keydown', handler);
  }, [canvasRef, onKeyDown, params]);

  useEffect(() => {
    if (!canvasRef) {
      return;
    }

    draw(canvasRef, params);
    onDrawEnd();
  }, [canvasRef, onKeyDown, params, onDrawEnd]);

  return <canvas ref={setCanvasRef} width={width} height={height} tabIndex={0} />;
};

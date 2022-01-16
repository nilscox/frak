import { useCallback, useEffect, useState } from 'react';

import { Mandelbrot, MandelbrotParams } from './Mandelbrot';
import { createPalette } from './palette';

const somePoint = {
  x: -0.6702068252714215,
  y: -0.4580758991502661,
  zoom: 20000000000000000,
  iter: 700,
};

export const App: React.FC = () => {
  const [x, setX] = useState(-0.6);
  const [y, setY] = useState(0);
  const [iter, setIter] = useState(50);
  const [zoom, setZoom] = useState(200);
  const [resolution, setResolution] = useState(1);
  const [colorOffset, setColorOffset] = useState(0);

  useEffect(() => {
    return;
    setX(somePoint.x);
    setY(somePoint.y);
    setZoom(somePoint.zoom);
    setIter(somePoint.iter);
  }, []);

  const palette = createPalette({
    0: [1, 1, 1],
    0.1: [1, 0, 0],
    0.2: [0, 1, 0],
    0.3: [0, 0, 1],
    0.4: [1, 1, 0],
    0.5: [1, 0, 1],
    0.6: [0, 1, 1],
    0.7: [1, 0, 0],
    0.8: [0, 1, 0],
    0.9: [0, 0, 1],
    1: [1, 1, 1],
  });

  const params: MandelbrotParams = {
    x,
    y,
    iter,
    zoom,
    resolution,
    palette: (n) => {
      const [r, g, b] = palette((n + colorOffset) % 1).map((n) => n * 255);
      return `rgb(${r}, ${g}, ${b})`;
    },
  };

  const handleKeyDown = useCallback(
    (key: string) => {
      const handlers: Record<string, () => void> = {
        ArrowUp: () => setY((y) => y - 100 / zoom),
        ArrowDown: () => setY((y) => y + 100 / zoom),
        ArrowLeft: () => setX((x) => x - 100 / zoom),
        ArrowRight: () => setX((x) => x + 100 / zoom),
        ' ': () => setZoom((zoom) => zoom * 1.4),
        z: () => setZoom((zoom) => zoom / 1.4),
        c: () => setColorOffset((c) => c + 0.01),
        Enter: () => setIter((iter) => iter + 10),
      };

      const handler = handlers[key];

      if (handler) {
        handler();
        // setResolution(32);
      }
    },
    [zoom],
  );

  const handleDrawEnd = () => {
    if (resolution === 1) {
      return;
    }

    setResolution(resolution / 2);
  };

  return (
    <>
      <Mandelbrot
        width={window.innerWidth}
        height={window.innerHeight}
        // width={400}
        // height={300}
        params={params}
        onKeyDown={handleKeyDown}
        onDrawEnd={handleDrawEnd}
      />

      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {Array(400)
          .fill(0)
          .map((_, n) => (
            <div key={n} style={{ width: 1, height: 30, background: params.palette(n / 400) }} />
          ))}
      </div>
    </>
  );
};

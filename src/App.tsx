import { KeyboardEventHandler, useCallback, useMemo, useReducer, useState, WheelEventHandler } from 'react';

import { Mandelbrot, MandelbrotParams } from './Mandelbrot';
import { createPalette } from './palette';

type Color = [number, number, number];

const usePalette = (colors: Record<number, Color>) => {
  const palette = useMemo(() => createPalette(colors), [colors]);

  return useCallback(
    (n: number) => {
      const [r, g, b] = palette(n).map((n) => n * 255);
      return `rgb(${r}, ${g}, ${b})`;
    },
    [palette],
  );
};

const useMandelbrotParams = (initialParams: MandelbrotParams) => {
  return useReducer(
    (state: MandelbrotParams, action: Partial<MandelbrotParams>) => ({
      ...state,
      resolution: initialParams.resolution,
      ...action,
    }),
    initialParams,
  );
};

const defaultParams: MandelbrotParams = {
  x: -0.6,
  y: 0,
  iter: 60,
  zoom: 500,
  resolution: 1,
  // resolution: 2 << 2,
};

const somePoint: MandelbrotParams = {
  ...defaultParams,
  x: -0.6702068252714215,
  y: -0.4580758991502661,
  zoom: 20000000000000000,
  iter: 700,
};

const colors: Record<number, Color> = {};

for (let i = 0; i <= 8; ++i) {
  colors[i / 8] = [Math.random(), Math.random(), Math.random()];
}

const palette = [
  ...Array(255)
    .fill(0)
    .map((_, n) => [0, 0, n]),
  ...Array(255)
    .fill(0)
    .map((_, n) => [0, n, 255 - n]),
  ...Array(255)
    .fill(0)
    .map((_, n) => [n, 255 - n, 0]),
];

const black = [0, 0, 0];

const getColor = (n: number) => {
  if (n === 1) {
    return black;
  }

  return [0, 0, n * 255];
  // return palette[~~(n * palette.length)];
};

// const colors: Record<number, Color> = {
//   0: [1, 1, 1],
//   0.1: [1, 0, 0],
//   0.2: [0, 1, 0],
//   0.3: [0, 0, 1],
//   0.4: [1, 1, 0],
//   0.5: [1, 0, 1],
//   0.6: [0, 1, 1],
//   0.7: [1, 0, 0],
//   0.8: [0, 1, 0],
//   0.9: [0, 0, 1],
//   1: [1, 1, 1],
// };

export const App: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [params, setParams] = useMandelbrotParams(defaultParams);
  // const getColor = usePalette(colors);

  const handleKeyDown: KeyboardEventHandler = useCallback(
    (event) => {
      const { x, y, zoom, iter } = params;

      const handlers: Record<string, () => void> = {
        ArrowUp: () => setParams({ y: y - 100 / zoom }),
        ArrowDown: () => setParams({ y: y + 100 / zoom }),
        ArrowLeft: () => setParams({ x: x - 100 / zoom }),
        ArrowRight: () => setParams({ x: x + 100 / zoom }),
        ' ': () => setParams({ zoom: zoom * 1.4 }),
        z: () => setParams({ zoom: zoom / 1.4 }),
        Enter: () => setParams({ iter: iter + 10 }),
      };

      handlers[event.key]?.();
    },
    [params, setParams],
  );

  const handleWheel: WheelEventHandler = useCallback(
    (event) => {
      const { zoom } = params;
      const [x, y] = [event.clientX, event.clientY];

      if (event.deltaY < 0) {
        setParams({ zoom: zoom * 1.1 });
      } else {
        setParams({ zoom: zoom / 1.1 });
      }
    },
    [params, setParams],
  );

  const handleDrawEnd = useCallback(() => {
    const { resolution } = params;

    if (resolution > 1) {
      setParams({ resolution: ~~(resolution / 2) });
    }
  }, [params, setParams]);

  return (
    <>
      <Mandelbrot
        tabIndex={0}
        width={window.innerWidth}
        height={window.innerHeight}
        // width={400}
        // height={300}
        params={params}
        getColor={getColor}
        onDrawProgress={setProgress}
        onDrawEnd={handleDrawEnd}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
      />

      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          color: '#999',
          fontFamily: 'monospace',
          background: '#000000CC',
          padding: '2px 4px',
        }}
      >
        Resolution {params.resolution}, progress: {~~(progress * 100)}%
      </div>

      {/* <div
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
            <div key={n} style={{ width: 1, height: 30, background: getColor(n / 400) }} />
          ))}
      </div>
       */}
    </>
  );
};

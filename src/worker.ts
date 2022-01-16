console.log('worker!');

type Message = {
  x: number;
  y: number;
};

onmessage = async (e: MessageEvent<Message>) => {
  const { x, y } = e.data;

  for (let i = 0; i < 100; ++i) {
    console.log('computing ' + i);
    await new Promise((r) => setTimeout(r, 0));
  }

  console.log('computation terminated');

  postMessage(x + y);
};

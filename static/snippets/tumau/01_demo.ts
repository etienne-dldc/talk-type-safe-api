import { TumauServer, TumauResponse } from 'tumau';

const server = TumauServer.create(() =>
  TumauResponse.withText(`Hello world`)
);

server.listen(3000);

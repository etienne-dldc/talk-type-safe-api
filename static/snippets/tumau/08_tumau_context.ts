import {
  TumauServer,
  TumauResponse,
  RequestConsumer
} from 'tumau';

const server = TumauServer.create(tools => {
  const request = tools.readContext(RequestConsumer);

  return TumauResponse.withText(`Hello from ${request.url}`);
});

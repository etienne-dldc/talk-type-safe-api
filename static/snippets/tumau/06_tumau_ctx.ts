import {
  TumauServer,
  TumauResponse,
  RequestConsumer
} from 'tumau';

const server = TumauServer.create(ctx => {
  const request = ctx.readContext(RequestConsumer);
  return TumauResponse.withText(`Hello from ${request.url}`);
});

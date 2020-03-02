import {
  TumauServer,
  TumauResponse,
  RequestConsumer,
  Middleware
} from 'tumau';

const middleware: Middleware = tools => {
  const request = tools.readContext(RequestConsumer);

  return TumauResponse.withText(`Hello from ${request.url}`);
};

const server = TumauServer.create(middleware);

import {
  Context,
  Middleware,
  TumauResponse,
  TumauServer
} from 'tumau';

const NumContext = Context.create<number>();

const exposeNum: Middleware = tools => {
  const num = Math.floor(Math.random() * 100000);
  return tools.withContext(NumContext.Provider(num)).next();
};
// @hide-before
const generateResponse: Middleware = tools => {
  const num = tools.readContextOrFail(NumContext.Consumer);

  return TumauResponse.withText(`Your number is ${num}`);
};

const main = Middleware.compose(exposeNum, generateResponse);

const server = TumauServer.create(main);

server.listen(3000);

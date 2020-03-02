import { Context, Middleware } from 'tumau';

const NumContext = Context.create<number>();

const exposeNum: Middleware = tools => {
  const num = Math.floor(Math.random() * 100000);
  return tools.withContext(NumContext.Provider(num)).next();
};

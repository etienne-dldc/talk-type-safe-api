import { Middleware, Context } from 'tumau';

export const JsonContext = Context.create<number>();

const JsonMiddleware: Middleware = async ctx => {
  const json = await parseJsonBody();
  return ctx.withContext(JsonContext.Provider(json)).next();
};

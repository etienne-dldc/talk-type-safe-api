import {
  TumauServer,
  TumauResponse,
  RequestConsumer
} from 'tumau';

import { Middleware, Context } from 'tumau';

export const JsonContext = Context.create<number>();

const JsonMiddleware: Middleware = async ctx => {
  const json = await parseJsonBody();
  return ctx.withContext(JsonContext.Provider(json)).next();
};
// @hide-before
const server = TumauServer.create(
  Middleware.compose(JsonMiddleware, ctx => {
    const json = ctx.readContextOrFail(JsonContext.Consumer);
    return TumauResponse.withText(`Hello ${json.toFixed(2)}`);
  })
);

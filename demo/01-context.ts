type Middleware<InCtx, OutCtx> = (ctx: InCtx) => OutCtx;

function compose<C1, C2, C3>(m1: Middleware<C1, C2>, m2: Middleware<C2, C3>): Middleware<C1, C3> {
  return {} as any;
}

type BodyParserCtx = { body: any };

function bodyMiddleware<InCtx>(): Middleware<InCtx, BodyParserCtx & InCtx> {
  return {} as any;
}

type BaseContext = { pathname: string };

type ResponseContext = BaseContext & { message: string };

const middleware: Middleware<BaseContext, ResponseContext> = ctx => {
  return {
    ...ctx,
    message: 'hello'
  };
};

const composed = compose(bodyMiddleware(), middleware);

export {};

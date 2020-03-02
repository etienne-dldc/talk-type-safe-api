export {};
type BaseContext = { pathname: string };
type BodyContext = { body: any };

type Middleware<InCtx, OutCtx> = (ctx: InCtx) => OutCtx;

function compose<C1, C2, C3>(
  m1: Middleware<C1, C2>,
  m2: Middleware<C2, C3>
): Middleware<C1, C3> {
  return {} as any;
}

// @hide-before
const m1: Middleware<
  BaseContext,
  BaseContext & BodyContext
> = {} as any;

const m2: Middleware<
  BaseContext & BodyContext,
  BaseContext & BodyContext
> = {} as any;

const middleware = compose(m1, m2);

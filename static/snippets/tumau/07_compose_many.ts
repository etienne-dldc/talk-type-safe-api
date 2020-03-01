export {};
type TumauBaseContext = { pathname: string };
type BodyParserContext = { body: any };

type Middleware<InCtx, OutCtx> = (ctx: InCtx) => OutCtx;
function compose<C1, C2, C3>(
  m1: Middleware<C1, C2>,
  m2: Middleware<C2, C3>
): Middleware<C1, C3> {
  // ...
}
// @hide-before
const m1: Middleware<
  TumauBaseContext,
  TumauBaseContext & BodyParserContext
> = {} as any;
const m2: Middleware<
  TumauBaseContext & BodyParserContext,
  TumauBaseContext & BodyParserContext
> = {} as any;

const middleware = compose(m1, m2);

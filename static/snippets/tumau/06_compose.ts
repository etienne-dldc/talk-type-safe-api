export {};
type Middleware<InCtx, OutCtx> = (ctx: InCtx) => OutCtx;
// @hide-before
function compose<C1, C2, C3>(
  m1: Middleware<C1, C2>,
  m2: Middleware<C2, C3>
): Middleware<C1, C3> {
  // ...
}

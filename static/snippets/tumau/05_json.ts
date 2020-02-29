type Middleware<InCtx, OutCtx> = (ctx: InCtx) => OutCtx;

export {};
// @hide-before
function createJsonMiddleware<InCtx>(): Middleware<
  InCtx,
  InCtx & { json: any }
> {
  // ...
}

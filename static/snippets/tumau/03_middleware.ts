export {};
// @hide-before
type Middleware<InCtx, OutCtx> = (ctx: InCtx) => OutCtx;

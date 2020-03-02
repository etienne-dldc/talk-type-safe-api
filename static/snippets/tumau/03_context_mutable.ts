export {};
// @hide-before
type Middleware<Ctx> = (ctx: Ctx) => any;

type AppContext = {
  body: any;
};

type AppMiddleware = Middleware<AppContext>;

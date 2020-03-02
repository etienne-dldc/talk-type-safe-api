type BaseContext = {};
type BodyContext = { body: any };
type Middleware<Ctx> = (ctx: Ctx) => any;
type CorsContext = {};

export {};
// @hide-before
type AppContext = BaseContext & BodyContext & CorsContext;

type AppMiddleware = Middleware<AppContext>;

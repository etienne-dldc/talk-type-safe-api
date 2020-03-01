type TumauBaseContext = {};
type BodyParserContext = { body: any };
type Middleware<Ctx> = (ctx: Ctx) => any;
type CorsContext = {};

export {};
// @hide-before
type MyAppContext = TumauBaseContext &
  BodyParserContext &
  CorsContext;

type MyAppMiddleware = Middleware<MyAppContext>;

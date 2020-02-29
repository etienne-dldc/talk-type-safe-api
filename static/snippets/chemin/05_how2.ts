export type CheminParam<N extends string, T> = {
  name: N;
  value: T;
};
// @hide-before
type Params<T> = T extends CheminParam<infer N, infer P>
  ? { [K in N]: P }
  : never;

type Test = Params<CheminParam<'foo', string>>;
// { foo: string; }

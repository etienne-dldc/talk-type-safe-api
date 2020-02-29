export type CheminParam<N extends string, T> = {
  name: N;
  value: T;
};

type Params<T> = T extends CheminParam<infer N, infer P>
  ? { [K in N]: P }
  : never;
// @hide-before
type Chemin<Result> = {
  match: (pathname: string) => false | Result;
};

function createChemin<P0 extends CheminParam<any, any>>(
  p0: P0
): Chemin<Params<P0>> {
  // ...
}

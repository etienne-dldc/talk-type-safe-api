export type CheminParam<N extends string, T> = {
  name: N;
  value: T;
};

type Params<T> = T extends CheminParam<infer N, infer P>
  ? { [K in N]: P }
  : never;

type Chemin<Result> = {
  match: (pathname: string) => false | Result;
};
// @hide-before
// prettier-ignore
function createChemin<P0 extends CheminParam<any, any>>(p0: P0): Chemin<Params<P0>>
// prettier-ignore
function createChemin<P0 extends CheminParam<any, any>, P1 extends CheminParam<any, any>>(p0: P0, p1: P1): Chemin<Params<P0> & Params<P1>>;
// prettier-ignore
function createChemin<P0 extends CheminParam<any, any>, P1 extends CheminParam<any, any>, P2 extends CheminParam<any, any>>(p0: P0, p1: P1, p2: P2): Chemin<Params<P0> & Params<P1> & Params<P2>>;
// prettier-ignore
function createChemin(...params: Array<CheminParam<any, any>>): Chemin<any> {
  // ...
}

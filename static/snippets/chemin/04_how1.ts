export type CheminParam<N extends string, T> = {
  name: N;
  value: T;
};

function stringParam<N extends string>(
  name: N
): CheminParam<N, string> {
  // ...
}

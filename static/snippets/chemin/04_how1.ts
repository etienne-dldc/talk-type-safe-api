export type CheminParam<N extends string, T> = {
  name: N;
  value: T;
};

function string<N extends string>(
  name: N
): CheminParam<N, string> {
  // ...
}

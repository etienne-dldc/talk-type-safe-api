import { Chemin, CheminParam as P } from 'chemin';

const chemin = Chemin.create(
  'post',
  P.string('postId'),
  P.optionalConst('delete')
);

const match = chemin.match(window.location.pathname);

if (match !== false) {
  const invalid = match.params.postID;
  //                           ^^^^^^
  // Property 'postID' does not exist on type
  // '{ postId: string; } & { delete: boolean; }'.
  // Did you mean 'postId'?
}

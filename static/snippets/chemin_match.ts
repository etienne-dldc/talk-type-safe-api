import { Chemin } from 'chemin';

const chemin = Chemin.parse('/admin/post/:postId/delete?');

const match = chemin.match(window.location.pathname);

if (match !== false) {
  const postId = match.params.postID;
}

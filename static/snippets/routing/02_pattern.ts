export {};
// @hide-before
const route = '/user/:userId/comments';

const match = matchRoute(route, pathname);

if (match !== false) {
  const userId = match.params.userId;
}

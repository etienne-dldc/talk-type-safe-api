export {};
// @hide-before
const route = '/user/:userID/comments';

const match = matchRoute<{ userId: string }>(route, pathname);

const userId = match.params.userId;

import { Chemin, CheminParam as P } from 'chemin';

const base = Chemin.create('admin', 'post', P.string('postId'));

const composed = Chemin.create(base, P.optionalConst('delete'));

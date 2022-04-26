import { v as redefine } from './object-set-prototype-of-65a42c5e.js';

var redefineAll = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

export { redefineAll as r };

import { _ as _export, a as anObject, w as wellKnownSymbol, h as hasOwnProperty_1, c as createNonEnumerableProperty } from './object-set-prototype-of-65a42c5e.js';
import { a as asyncIteratorIteration, i as iterate, b as isPure } from './es.string.replace-2c4627bc.js';
import { a as anInstance } from './inherit-if-required-1c9a60b3.js';
import { a as asyncIteratorPrototype } from './function-apply-8ffa8c0a.js';

// https://github.com/tc39/proposal-iterator-helpers

var $forEach = asyncIteratorIteration.forEach;

_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  forEach: function forEach(fn) {
    return $forEach(this, fn);
  }
});

// https://github.com/tc39/proposal-iterator-helpers




_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
  forEach: function forEach(fn) {
    iterate(anObject(this), fn, { IS_ITERATOR: true });
  }
});

// https://github.com/tc39/proposal-iterator-helpers








var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var AsyncIteratorConstructor = function AsyncIterator() {
  anInstance(this, asyncIteratorPrototype);
};

AsyncIteratorConstructor.prototype = asyncIteratorPrototype;

if (!hasOwnProperty_1(asyncIteratorPrototype, TO_STRING_TAG)) {
  createNonEnumerableProperty(asyncIteratorPrototype, TO_STRING_TAG, 'AsyncIterator');
}

if ( !hasOwnProperty_1(asyncIteratorPrototype, 'constructor') || asyncIteratorPrototype.constructor === Object) {
  createNonEnumerableProperty(asyncIteratorPrototype, 'constructor', AsyncIteratorConstructor);
}

_export({ global: true, forced: isPure }, {
  AsyncIterator: AsyncIteratorConstructor
});

// https://github.com/tc39/proposal-iterator-helpers

var $toArray = asyncIteratorIteration.toArray;

_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  toArray: function toArray() {
    return $toArray(this, undefined, []);
  }
});

// https://github.com/tc39/proposal-iterator-helpers




var push = [].push;

_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
  toArray: function toArray() {
    var result = [];
    iterate(anObject(this), push, { that: result, IS_ITERATOR: true });
    return result;
  }
});

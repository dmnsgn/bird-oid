import { a as anObject, b as getBuiltIn, u as internalState, w as wellKnownSymbol, d as aCallable, f as functionCall, e as getMethod, r as objectCreate, c as createNonEnumerableProperty, _ as _export } from './object-set-prototype-of-65a42c5e.js';
import { b as iteratorClose, a as asyncIteratorPrototype, f as functionApply, i as iteratorsCore } from './function-apply-8ffa8c0a.js';
import { r as redefineAll } from './redefine-all-0f62e567.js';

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator, 'throw', error);
  }
};

var Promise = getBuiltIn('Promise');

var ASYNC_ITERATOR_PROXY = 'AsyncIteratorProxy';
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(ASYNC_ITERATOR_PROXY);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

var asyncIteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
  var AsyncIteratorProxy = function AsyncIterator(state) {
    state.type = ASYNC_ITERATOR_PROXY;
    state.next = aCallable(state.iterator.next);
    state.done = false;
    state.ignoreArgument = !IS_ITERATOR;
    setInternalState(this, state);
  };

  AsyncIteratorProxy.prototype = redefineAll(objectCreate(asyncIteratorPrototype), {
    next: function next(arg) {
      var that = this;
      var hasArgument = !!arguments.length;
      return new Promise(function (resolve) {
        var state = getInternalState(that);
        var args = hasArgument ? [state.ignoreArgument ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
        state.ignoreArgument = false;
        resolve(state.done ? { done: true, value: undefined } : anObject(functionCall(nextHandler, state, Promise, args)));
      });
    },
    'return': function (value) {
      var that = this;
      return new Promise(function (resolve, reject) {
        var state = getInternalState(that);
        var iterator = state.iterator;
        state.done = true;
        var $$return = getMethod(iterator, 'return');
        if ($$return === undefined) return resolve({ done: true, value: value });
        Promise.resolve(functionCall($$return, iterator, value)).then(function (result) {
          anObject(result);
          resolve({ done: true, value: value });
        }, reject);
      });
    },
    'throw': function (value) {
      var that = this;
      return new Promise(function (resolve, reject) {
        var state = getInternalState(that);
        var iterator = state.iterator;
        state.done = true;
        var $$throw = getMethod(iterator, 'throw');
        if ($$throw === undefined) return reject(value);
        resolve(functionCall($$throw, iterator, value));
      });
    }
  });

  if (!IS_ITERATOR) {
    createNonEnumerableProperty(AsyncIteratorProxy.prototype, TO_STRING_TAG, 'Generator');
  }

  return AsyncIteratorProxy;
};

// https://github.com/tc39/proposal-iterator-helpers






var AsyncIteratorProxy = asyncIteratorCreateProxy(function (Promise, args) {
  var state = this;
  var mapper = state.mapper;

  return Promise.resolve(anObject(functionApply(state.next, state.iterator, args))).then(function (step) {
    if (anObject(step).done) {
      state.done = true;
      return { done: true, value: undefined };
    }
    return Promise.resolve(mapper(step.value)).then(function (value) {
      return { done: false, value: value };
    });
  });
});

_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  map: function map(mapper) {
    return new AsyncIteratorProxy({
      iterator: anObject(this),
      mapper: aCallable(mapper)
    });
  }
});

var IteratorPrototype = iteratorsCore.IteratorPrototype;

var ITERATOR_PROXY = 'IteratorProxy';
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(ITERATOR_PROXY);

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
  var IteratorProxy = function Iterator(state) {
    state.type = ITERATOR_PROXY;
    state.next = aCallable(state.iterator.next);
    state.done = false;
    state.ignoreArg = !IS_ITERATOR;
    setInternalState$1(this, state);
  };

  IteratorProxy.prototype = redefineAll(objectCreate(IteratorPrototype), {
    next: function next(arg) {
      var state = getInternalState$1(this);
      var args = arguments.length ? [state.ignoreArg ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
      state.ignoreArg = false;
      var result = state.done ? undefined : functionCall(nextHandler, state, args);
      return { done: state.done, value: result };
    },
    'return': function (value) {
      var state = getInternalState$1(this);
      var iterator = state.iterator;
      state.done = true;
      var $$return = getMethod(iterator, 'return');
      return { done: true, value: $$return ? anObject(functionCall($$return, iterator, value)).value : value };
    },
    'throw': function (value) {
      var state = getInternalState$1(this);
      var iterator = state.iterator;
      state.done = true;
      var $$throw = getMethod(iterator, 'throw');
      if ($$throw) return functionCall($$throw, iterator, value);
      throw value;
    }
  });

  if (!IS_ITERATOR) {
    createNonEnumerableProperty(IteratorProxy.prototype, TO_STRING_TAG$1, 'Generator');
  }

  return IteratorProxy;
};

// https://github.com/tc39/proposal-iterator-helpers







var IteratorProxy = iteratorCreateProxy(function (args) {
  var iterator = this.iterator;
  var result = anObject(functionApply(this.next, iterator, args));
  var done = this.done = !!result.done;
  if (!done) return callWithSafeIterationClosing(iterator, this.mapper, result.value);
});

_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
  map: function map(mapper) {
    return new IteratorProxy({
      iterator: anObject(this),
      mapper: aCallable(mapper)
    });
  }
});

export { asyncIteratorCreateProxy as a, callWithSafeIterationClosing as c, iteratorCreateProxy as i };

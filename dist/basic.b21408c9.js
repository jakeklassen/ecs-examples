// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/@jakeklassen/ecs/dist-web/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.entityIdGenerator = entityIdGenerator;
exports.lsb = lsb;
exports.msb = msb;
exports.toggleFunc = toggleFunc;
exports.setFunc = setFunc;
exports.unsetFunc = unsetFunc;
exports.and = and;
exports.or = or;
exports.xor = xor;
exports.BitSet = exports.multiplyDeBruijnBitPosition = exports.BITS_PER_INT = exports.Component = exports.World = exports.System = exports.Entity = void 0;

/**
 * Representation of a unique entity value within the world
 */
class Entity {
  constructor(id) {
    this.id = id;
    this.version = 0;
  }

}
/**
 * Class for all Systems to derive from
 */


exports.Entity = Entity;

class System {} // Matt Krick, matt.krick@gmail.com, MIT License
// each bin holds bits 0 - 30, totaling 31 (sign takes up last bit)


exports.System = System;
const BITS_PER_INT = 31; // used for ffs of a word in O(1) time. LUTs get a bad wrap, they are fast.

exports.BITS_PER_INT = BITS_PER_INT;
const multiplyDeBruijnBitPosition = [0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8, 31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9];
exports.multiplyDeBruijnBitPosition = multiplyDeBruijnBitPosition;

class BitSet {
  /**
   * Create a new bitset. Accepts either the maximum number of bits, or a dehydrated bitset
   * @param {number|string} nBitsOrKey - Number of bits in the set or dehydrated bitset.
   * For speed and space concerns, the initial number of bits cannot be increased.
   * @constructor
   */
  constructor(nBitsOrKey) {
    this.MAX_BIT = 0;
    let wordCount;
    let arrVals;
    let front;
    let leadingZeros;
    let i;

    if (typeof nBitsOrKey === 'number') {
      nBitsOrKey = nBitsOrKey || BITS_PER_INT; // default to 1 word

      wordCount = Math.ceil(nBitsOrKey / BITS_PER_INT);
      this.arr = new Uint32Array(wordCount);
      this.MAX_BIT = nBitsOrKey - 1;
    } else {
      arrVals = JSON.parse('[' + nBitsOrKey + ']');
      this.MAX_BIT = arrVals.pop();
      leadingZeros = arrVals.pop();

      if (leadingZeros > 0) {
        front = [];

        for (i = 0; i < leadingZeros; i++) {
          front[i] = 0;
        }

        for (i = 0; i < arrVals.length; i++) {
          front[leadingZeros + i] = arrVals[i];
        }

        arrVals = front;
      }

      wordCount = Math.ceil((this.MAX_BIT + 1) / BITS_PER_INT);
      this.arr = new Uint32Array(wordCount);
      this.arr.set(arrVals);
    }
  }
  /**
   * Check whether a bit at a specific index is set
   * @param {number} idx the position of a single bit to check
   * @returns {boolean} true if bit is set, else false
   */


  get(idx) {
    const word = this.getWord(idx);
    return word === -1 ? false : (this.arr[word] >> idx % BITS_PER_INT & 1) === 1;
  }
  /**
   * Set a single bit
   * @param {number} idx the position of a single bit to set
   * @returns {boolean} true if set was successful, else false
   */


  set(idx) {
    const word = this.getWord(idx);

    if (word === -1) {
      return false;
    }

    this.arr[word] |= 1 << idx % BITS_PER_INT;
    return true;
  }
  /**
   * Set a range of bits
   * @param {number} from the starting index of the range to set
   * @param {number} to the ending index of the range to set
   * @returns {boolean} true if set was successful, else false
   */


  setRange(from, to) {
    return this.doRange(from, to, setFunc);
  }
  /**
   * Unset a single bit
   * @param {number} idx the position of a single bit to unset
   * @returns {boolean} true if set was successful, else false
   */


  unset(idx) {
    const word = this.getWord(idx);

    if (word === -1) {
      return false;
    }

    this.arr[word] &= ~(1 << idx % BITS_PER_INT);
    return true;
  }
  /**
   * Toggle a single bit
   * @param {number} idx the position of a single bit to toggle
   * @returns {boolean} true if set was successful, else false
   */


  toggle(idx) {
    const word = this.getWord(idx);

    if (word === -1) {
      return false;
    }

    this.arr[word] ^= 1 << idx % BITS_PER_INT;
    return true;
  }
  /**
   * Toggle a range of bits
   * @param {number} from the starting index of the range to toggle
   * @param {number} to the ending index of the range to toggle
   * @returns {boolean} true if set was successful, else false
   */


  toggleRange(from, to) {
    return this.doRange(from, to, toggleFunc);
  }
  /**
   *
   * Clear an entire bitset
   * @returns {boolean} true
   */


  clear() {
    for (let i = 0; i < this.arr.length; i++) {
      this.arr[i] = 0;
    }

    return true;
  }
  /**
   * Clone a bitset
   * @returns {BitSet} an copy (by value) of the calling bitset
   */


  clone() {
    return new BitSet(this.dehydrate());
  }
  /**
   *
   * Turn the bitset into a comma separated string that skips leading & trailing 0 words.
   * Ends with the number of leading 0s and MAX_BIT.
   * Useful if you need the bitset to be an object key (eg dynamic programming).
   * Can rehydrate by passing the result into the constructor
   * @returns {string} representation of the bitset
   */


  dehydrate() {
    let i;
    let lastUsedWord = 0;
    let s;
    let leadingZeros = 0;

    for (i = 0; i < this.arr.length; i++) {
      if (this.arr[i] !== 0) {
        break;
      }

      leadingZeros++;
    }

    for (i = this.arr.length - 1; i >= leadingZeros; i--) {
      if (this.arr[i] !== 0) {
        lastUsedWord = i;
        break;
      }
    }

    s = '';

    for (i = leadingZeros; i <= lastUsedWord; i++) {
      s += this.arr[i] + ',';
    }

    s += leadingZeros + ',' + this.MAX_BIT; // leading 0s, stop numbers

    return s;
  }
  /**
   *
   * Perform a bitwise AND on 2 bitsets or 1 bitset and 1 index.
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet | Number} bsOrIdx a bitset or single index to check (useful for LP, DP problems)
   * @returns {BitSet} a new bitset that is the bitwise AND of the two
   */


  and(bsOrIdx) {
    return this.op(bsOrIdx, and);
  }
  /**
   *
   * Perform a bitwise OR on 2 bitsets or 1 bitset and 1 index.
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet | Number} bsOrIdx a bitset or single index to check (useful for LP, DP problems)
   * @returns {BitSet} a new bitset that is the bitwise OR of the two
   */


  or(bsOrIdx) {
    return this.op(bsOrIdx, or);
  }
  /**
   *
   * Perform a bitwise XOR on 2 bitsets or 1 bitset and 1 index.
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet | Number} bsOrIdx a bitset or single index to check (useful for LP, DP problems)
   * @returns {BitSet} a new bitset that is the bitwise XOR of the two
   */


  xor(bsOrIdx) {
    return this.op(bsOrIdx, xor);
  }
  /**
   * Run a custom function on every set bit. Faster than iterating over the entire bitset with a `get()`
   * Source code includes a nice pattern to follow if you need to break the for-loop early
   * @param {Function} func the function to pass the next set bit to
   */
  // tslint:disable-next-line: ban-types


  forEach(func) {
    for (let i = this.ffs(); i !== -1; i = this.nextSetBit(i + 1)) {
      func(i);
    }
  }
  /**
   * Circular shift bitset by an offset
   * @param {Number} number of positions that the bitset that will be shifted to the right.
   * Using a negative number will result in a left shift.
   * @returns {Bitset} a new bitset that is rotated by the offset
   */


  circularShift(offset) {
    offset = -offset;
    const S = this; // source BitSet (this)

    const MASK_SIGN = 0x7fffffff;
    const BITS = S.MAX_BIT + 1;
    const WORDS = S.arr.length;
    const BITS_LAST_WORD = BITS_PER_INT - (WORDS * BITS_PER_INT - BITS);
    const T = new BitSet(BITS); // target BitSet (the shifted bitset)

    let t = 0; // (s)ource and (t)arget word indices

    let j = 0; // current bit indices for source (i) and target (j) words

    let z = 0; // bit index for entire sequence.

    offset = (BITS + offset % BITS) % BITS; // positive, within length

    let s = ~~(offset / BITS_PER_INT) % WORDS;
    let i = offset % BITS_PER_INT;

    while (z < BITS) {
      const sourceWordLength = s === WORDS - 1 ? BITS_LAST_WORD : BITS_PER_INT;
      let bits = S.arr[s];

      if (i > 0) {
        bits = bits >>> i;
      }

      if (j > 0) {
        bits = bits << j;
      }

      T.arr[t] = T.arr[t] | bits;
      const bitsAdded = Math.min(BITS_PER_INT - j, sourceWordLength - i);
      z += bitsAdded;
      j += bitsAdded;

      if (j >= BITS_PER_INT) {
        T.arr[t] = T.arr[t] & MASK_SIGN;
        j = 0;
        t++;
      }

      i += bitsAdded;

      if (i >= sourceWordLength) {
        i = 0;
        s++;
      }

      if (s >= WORDS) {
        s -= WORDS;
      }
    }

    T.arr[WORDS - 1] = T.arr[WORDS - 1] & MASK_SIGN >>> BITS_PER_INT - BITS_LAST_WORD;
    return T;
  }
  /**
   * Get the cardinality (count of set bits) for the entire bitset
   * @returns {number} cardinality
   */


  getCardinality() {
    let setCount = 0;

    for (let i = this.arr.length - 1; i >= 0; i--) {
      let j = this.arr[i];
      j = j - (j >> 1 & 0x55555555);
      j = (j & 0x33333333) + (j >> 2 & 0x33333333);
      setCount += (j + (j >> 4) & 0x0f0f0f0f) * 0x01010101 >> 24;
    }

    return setCount;
  }
  /**
   * Get the indices of all set bits. Useful for debugging, uses `forEach` internally
   * @returns {Array} Indices of all set bits
   */


  getIndices() {
    const indices = [];
    this.forEach(i => {
      indices.push(i);
    });
    return indices;
  }
  /**
   * Checks if one bitset is subset of another. Same thing can be done using _and_ operation and equality check,
   * but then new BitSet would be created, and if one is only interested in yes/no information it would be a waste
   * of memory and additional GC strain.
   * @param {BitSet} bs a bitset to check
   * @returns {Boolean} `true` if provided bitset is a subset of this bitset, `false` otherwise
   */


  isSubsetOf(bs) {
    const arr1 = this.arr;
    const arr2 = bs.arr;
    const len = arr1.length;

    for (let i = 0; i < len; i++) {
      if ((arr1[i] & arr2[i]) !== arr1[i]) {
        return false;
      }
    }

    return true;
  }
  /**
   * Quickly determine if a bitset is empty
   * @returns {boolean} true if the entire bitset is empty, else false
   */


  isEmpty() {
    let i;
    let arr;
    arr = this.arr;

    for (i = 0; i < arr.length; i++) {
      if (arr[i]) {
        return false;
      }
    }

    return true;
  }
  /**
   *
   * Quickly determine if both bitsets are equal (faster than checking if the XOR of the two is === 0).
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet} bs
   * @returns {boolean} true if the entire bitset is empty, else false
   */


  isEqual(bs) {
    let i;

    for (i = 0; i < this.arr.length; i++) {
      if (this.arr[i] !== bs.arr[i]) {
        return false;
      }
    }

    return true;
  }
  /**
   * Get a string representation of the entire bitset, including leading 0s (useful for debugging)
   * @returns {string} a base 2 representation of the entire bitset
   */


  toString() {
    let i;
    let str;
    let fullString = '';

    for (i = this.arr.length - 1; i >= 0; i--) {
      str = this.arr[i].toString(2);
      fullString += ('0000000000000000000000000000000' + str).slice(-BITS_PER_INT);
    }

    return fullString;
  }
  /**
   * Find first set bit (useful for processing queues, breadth-first tree searches, etc.)
   * @param {number} startWord the word to start with (only used internally by nextSetBit)
   * @returns {number} the index of the first set bit in the bitset, or -1 if not found
   */


  ffs(startWord = 0) {
    let setVal;
    let i;
    let fs = -1;

    for (i = startWord; i < this.arr.length; i++) {
      setVal = this.arr[i];

      if (setVal === 0) {
        continue;
      }

      fs = lsb(setVal) + i * BITS_PER_INT;
      break;
    }

    return fs <= this.MAX_BIT ? fs : -1;
  }
  /**
   * Find first zero (unset bit)
   * @param {number} startWord the word to start with (only used internally by nextUnsetBit)
   * @returns {number} the index of the first unset bit in the bitset, or -1 if not found
   */


  ffz(startWord) {
    let i;
    let setVal;
    let fz = -1;
    startWord = startWord || 0;

    for (i = startWord; i < this.arr.length; i++) {
      setVal = this.arr[i];

      if (setVal === 0x7fffffff) {
        continue;
      }

      setVal ^= 0x7fffffff;
      fz = lsb(setVal) + i * BITS_PER_INT;
      break;
    }

    return fz <= this.MAX_BIT ? fz : -1;
  }
  /**
   *
   * Find last set bit
   * @param {number} startWord the word to start with (only used internally by previousSetBit)
   * @returns {number} the index of the last set bit in the bitset, or -1 if not found
   */


  fls(startWord = this.arr.length - 1) {
    let i;
    let setVal;
    let ls = -1;

    for (i = startWord; i >= 0; i--) {
      setVal = this.arr[i];

      if (setVal === 0) {
        continue;
      }

      ls = msb(setVal) + i * BITS_PER_INT;
      break;
    }

    return ls;
  }
  /**
   *
   * Find last zero (unset bit)
   * @param {number} startWord the word to start with (only used internally by previousUnsetBit)
   * @returns {number} the index of the last unset bit in the bitset, or -1 if not found
   */


  flz(startWord) {
    let i;
    let setVal;
    let ls = -1;

    if (startWord === undefined) {
      startWord = this.arr.length - 1;
    }

    for (i = startWord; i >= 0; i--) {
      setVal = this.arr[i];

      if (i === this.arr.length - 1) {
        const wordIdx = this.MAX_BIT % BITS_PER_INT;
        const unusedBitCount = BITS_PER_INT - wordIdx - 1;
        setVal |= (1 << unusedBitCount) - 1 << wordIdx + 1;
      }

      if (setVal === 0x7fffffff) {
        continue;
      }

      setVal ^= 0x7fffffff;
      ls = msb(setVal) + i * BITS_PER_INT;
      break;
    }

    return ls;
  }
  /**
   * Find first set bit, starting at a given index
   * @param {number} idx the starting index for the next set bit
   * @returns {number} the index of the next set bit >= idx, or -1 if not found
   */


  nextSetBit(idx) {
    const startWord = this.getWord(idx);

    if (startWord === -1) {
      return -1;
    }

    const wordIdx = idx % BITS_PER_INT;
    const len = BITS_PER_INT - wordIdx;
    const mask = (1 << len) - 1 << wordIdx;
    const reducedWord = this.arr[startWord] & mask;

    if (reducedWord > 0) {
      return lsb(reducedWord) + startWord * BITS_PER_INT;
    }

    return this.ffs(startWord + 1);
  }
  /**
   * Find first unset bit, starting at a given index
   * @param {number} idx the starting index for the next unset bit
   * @returns {number} the index of the next unset bit >= idx, or -1 if not found
   */


  nextUnsetBit(idx) {
    const startWord = this.getWord(idx);

    if (startWord === -1) {
      return -1;
    }

    const mask = (1 << idx % BITS_PER_INT) - 1;
    const reducedWord = this.arr[startWord] | mask;

    if (reducedWord === 0x7fffffff) {
      return this.ffz(startWord + 1);
    }

    return lsb(0x7fffffff ^ reducedWord) + startWord * BITS_PER_INT;
  }
  /**
   * Find last set bit, up to a given index
   * @param {number} idx the starting index for the next unset bit (going in reverse)
   * @returns {number} the index of the next unset bit <= idx, or -1 if not found
   */


  previousSetBit(idx) {
    const startWord = this.getWord(idx);

    if (startWord === -1) {
      return -1;
    }

    const mask = 0x7fffffff >>> BITS_PER_INT - idx % BITS_PER_INT - 1;
    const reducedWord = this.arr[startWord] & mask;

    if (reducedWord > 0) {
      return msb(reducedWord) + startWord * BITS_PER_INT;
    }

    return this.fls(startWord - 1);
  }
  /**
   * Find last unset bit, up to a given index
   * @param {number} idx the starting index for the next unset bit (going in reverse)
   * @returns {number} the index of the next unset bit <= idx, or -1 if not found
   */


  previousUnsetBit(idx) {
    const startWord = this.getWord(idx);

    if (startWord === -1) {
      return -1;
    }

    const wordIdx = idx % BITS_PER_INT;
    const mask = (1 << BITS_PER_INT - wordIdx - 1) - 1 << wordIdx + 1;
    const reducedWord = this.arr[startWord] | mask;

    if (reducedWord === 0x7fffffff) {
      return this.flz(startWord - 1);
    }

    return msb(0x7fffffff ^ reducedWord) + startWord * BITS_PER_INT;
  }
  /**
   *
   * @param {number} idx position of bit in bitset
   * @returns {number} the word where the index is located, or -1 if out of range
   * @private
   */


  getWord(idx) {
    return idx < 0 || idx > this.MAX_BIT ? -1 : ~~(idx / BITS_PER_INT);
  }
  /**
   * Shared function for setting, unsetting, or toggling a range of bits
   * @param {number} from the starting index of the range to set
   * @param {number} to the ending index of the range to set
   * @param {Function} func function to run (set, unset, or toggle)
   * @returns {boolean} true if set was successful, else false
   * @private
   */
  // tslint:disable-next-line: ban-types


  doRange(from, to, func) {
    let i;
    let curStart;
    let curEnd;
    let len;

    if (to < from) {
      to ^= from;
      from ^= to;
      to ^= from;
    }

    const startWord = this.getWord(from);
    const endWord = this.getWord(to);

    if (startWord === -1 || endWord === -1) {
      return false;
    }

    for (i = startWord; i <= endWord; i++) {
      curStart = i === startWord ? from % BITS_PER_INT : 0;
      curEnd = i === endWord ? to % BITS_PER_INT : BITS_PER_INT - 1;
      len = curEnd - curStart + 1;
      this.arr[i] = func(this.arr[i], len, curStart);
    }

    return true;
  }
  /**
   * Both bitsets must have the same number of words, no length check is performed to prevent and overflow.
   * @param {BitSet | Number} bsOrIdx a bitset or single index to check (useful for LP, DP problems)
   * @param {Function} func the operation to perform (and, or, xor)
   * @returns {BitSet} a new bitset that is the bitwise operation of the two
   * @private
   */
  // tslint:disable-next-line: ban-types


  op(bsOrIdx, func) {
    let i;
    let arr1;
    let arr2;
    let len;
    let newBS;
    let word;
    arr1 = this.arr;

    if (typeof bsOrIdx === 'number') {
      word = this.getWord(bsOrIdx);
      newBS = this.clone();

      if (word !== -1) {
        newBS.arr[word] = func(arr1[word], 1 << bsOrIdx % BITS_PER_INT);
      }
    } else {
      arr2 = bsOrIdx.arr;
      len = arr1.length;
      newBS = new BitSet(this.MAX_BIT + 1);

      for (i = 0; i < len; i++) {
        newBS.arr[i] = func(arr1[i], arr2[i]);
      }
    }

    return newBS;
  }

}
/**
 *
 * Returns the least signifcant bit, or 0 if none set, so a prior check to see if the word > 0 is required
 * @param {number} word the current array
 * @returns {number} the index of the least significant bit in the current array
 */


exports.BitSet = BitSet;

function lsb(word) {
  return multiplyDeBruijnBitPosition[(word & -word) * 0x077cb531 >>> 27];
}
/**
 * Returns the least signifcant bit, or 0 if none set, so a prior check to see if the word > 0 is required
 * @param word the current array
 * @returns {number} the index of the most significant bit in the current array
 */


function msb(word) {
  word |= word >> 1;
  word |= word >> 2;
  word |= word >> 4;
  word |= word >> 8;
  word |= word >> 16;
  word = (word >> 1) + 1;
  return multiplyDeBruijnBitPosition[word * 0x077cb531 >>> 27];
}

function toggleFunc(word, len, curStart) {
  const mask = (1 << len) - 1 << curStart;
  return word ^ mask;
}

function setFunc(word, len, curStart) {
  const mask = (1 << len) - 1 << curStart;
  return word | mask;
}

function unsetFunc(word, len, curStart) {
  const mask = 0x7fffffff ^ (1 << len) - 1 << curStart;
  return word & mask;
}

function and(word1, word2) {
  return word1 & word2;
}

function or(word1, word2) {
  return word1 | word2;
}

function xor(word1, word2) {
  return word1 ^ word2;
}

class ComponentMap {
  constructor() {
    this.bitmask = new BitSet(0);
    this.map = new Map();
  }

  get(ctor) {
    const component = this.map.get(ctor);
    return component != null ? component : undefined;
  }

  set(...components) {
    let mask = new BitSet(0);

    for (const component of components) {
      if (this.map.has(component.constructor) === false) {
        mask = mask.or(component.constructor.bitmask);
      }

      this.map.set(component.constructor, component);
    }

    this.bitmask = this.bitmask.or(mask);
  }

  remove(...componentCtors) {
    let mask = new BitSet(0);

    for (const componentCtor of componentCtors) {
      if (this.map.has(componentCtor)) {
        mask = mask.or(componentCtor.bitmask);
      }

      this.map.delete(componentCtor);
    }

    this.bitmask = this.bitmask.xor(mask);
  }

  clear() {
    this.map.clear();
    this.bitmask.clear();
  }

  keys() {
    return this.map.keys();
  }

  has(componentCtor) {
    return this.map.has(componentCtor);
  }

  get size() {
    return this.map.size;
  }

}

function* entityIdGenerator() {
  let id = 0;

  while (true) {
    ++id;
    yield id;
  }
}
/**
 * Container for Systems and Entities
 */


class World {
  /**
   * Create a new World instance
   * @param idGenerator Unique entity id generator
   */
  constructor(idGenerator = entityIdGenerator()) {
    this.idGenerator = idGenerator;
    this.systems = [];
    this.systemsToRemove = [];
    this.systemsToAdd = [];
    this.entities = new Map();
    this.deletedEntities = new Set();
    this.componentEntities = new Map();
  }
  /**
   * Update all world systems
   * @param dt Delta time
   */


  update(dt) {
    this.updateSystems(dt);
  }

  createEntity() {
    if (this.deletedEntities.size > 0) {
      const entity = this.deletedEntities.values().next().value;
      this.deletedEntities.delete(entity);
      return entity;
    }

    const entity = new Entity(this.idGenerator.next().value);
    this.entities.set(entity, new ComponentMap());
    return entity;
  }
  /**
   * Delete an entity from the world. Entities can be recycled so do not rely
   * on the deleted entity reference after deleting it.
   * @param entity Entity to delete
   */


  deleteEntity(entity) {
    if (this.deletedEntities.has(entity)) {
      return false;
    }

    if (this.entities.has(entity)) {
      const componentMap = this.entities.get(entity);

      for (const ctor of componentMap.keys()) {
        this.componentEntities.get(ctor).delete(entity);
      }

      componentMap.clear();
      this.deletedEntities.add(entity);
      return true;
    }

    return false;
  }

  findEntity(...componentCtors) {
    if (componentCtors.length === 0) {
      return undefined;
    }

    const hasAllComponents = componentCtors.every(ctor => this.componentEntities.has(ctor));

    if (hasAllComponents === false) {
      return undefined;
    }

    const componentSets = componentCtors.map(ctor => this.componentEntities.get(ctor));
    const smallestComponentSet = componentSets.reduce((smallest, set) => {
      if (smallest == null) {
        smallest = set;
      } else if (set.size < smallest.size) {
        smallest = set;
      }

      return smallest;
    });
    const otherComponentSets = componentSets.filter(set => set !== smallestComponentSet);

    for (const entity of smallestComponentSet.values()) {
      const hasAll = otherComponentSets.every(set => set.has(entity));

      if (hasAll === true) {
        return entity;
      }
    }
  }

  addEntityComponents(entity, ...components) {
    if (this.deletedEntities.has(entity)) {
      throw new Error('Entity has been deleted');
    }

    const entityComponents = this.entities.get(entity);

    if (entityComponents != null) {
      entityComponents.set(...components);

      for (const componentCtor of entityComponents.keys()) {
        if (this.componentEntities.has(componentCtor)) {
          this.componentEntities.get(componentCtor).add(entity);
        } else {
          this.componentEntities.set(componentCtor, new Set([entity]));
        }
      }
    }

    return this;
  }

  getEntityComponents(entity) {
    if (this.deletedEntities.has(entity)) {
      return undefined;
    }

    return this.entities.get(entity);
  }

  removeEntityComponents(entity, ...components) {
    if (this.deletedEntities.has(entity)) {
      throw new Error('Entity has been deleted');
    }

    const entityComponents = this.entities.get(entity);

    if (entityComponents != null) {
      entityComponents.remove(...components.map(component => component.constructor));
      components.forEach(component => {
        const ctor = component.constructor;

        if (this.componentEntities.has(ctor)) {
          this.componentEntities.get(ctor).delete(entity);
        }
      });
    }

    return this;
  }
  /**
   * Register a system for addition. Systems are executed linearly in the order added.
   * @param system System
   */


  addSystem(system) {
    this.systemsToAdd.push(system);
  }
  /**
   * Register a system for removal.
   * @param system System
   */


  removeSystem(system) {
    this.systemsToRemove.push(system);
  }

  updateSystems(dt) {
    if (this.systemsToRemove.length > 0) {
      this.systems = this.systems.filter(existing => this.systemsToRemove.includes(existing));
      this.systemsToRemove = [];
    }

    if (this.systemsToAdd.length > 0) {
      this.systemsToAdd.forEach(newSystem => {
        if (this.systems.includes(newSystem) === false) {
          this.systems.push(newSystem);
        }
      });
      this.systemsToAdd = [];
    }

    for (const system of this.systems) {
      system.update(this, dt);
    }
  }

  view(...componentCtors) {
    const entities = new Map();

    if (componentCtors.length === 0) {
      return entities;
    }

    const componentSets = componentCtors.map(ctor => {
      if (this.componentEntities.has(ctor) === false) {
        throw new Error(`Component ${ctor.name} not found`);
      }

      return this.componentEntities.get(ctor);
    });
    const smallestComponentSet = componentSets.reduce((smallest, set) => {
      if (smallest == null) {
        smallest = set;
      } else if (set.size < smallest.size) {
        smallest = set;
      }

      return smallest;
    });
    const otherComponentSets = componentSets.filter(set => set !== smallestComponentSet);

    for (const entity of smallestComponentSet) {
      const hasAll = otherComponentSets.every(set => set.has(entity));

      if (hasAll === true) {
        entities.set(entity, this.getEntityComponents(entity));
      }
    }

    return entities;
  }

}

exports.World = World;

function* bitmaskGenerator() {
  let n = 1;

  while (true) {
    const mask = new BitSet(n);
    mask.set(n - 1);
    ++n;
    yield mask;
  }
}

class Component {
  constructor() {
    // tslint:disable-next-line: variable-name
    this.__component = true;
  }

  static get bitmask() {
    if (this._bitmask == null) {
      this._bitmask = this._bitmaskGenerator.next().value;
    }

    return this._bitmask;
  }

}

exports.Component = Component;
Component._bitmaskGenerator = bitmaskGenerator();
},{}],"node_modules/mainloop.js/build/mainloop.min.js":[function(require,module,exports) {
var define;
/**
 * mainloop.js 1.0.3-20170529
 *
 * @author Isaac Sukin (http://www.isaacsukin.com/)
 * @license MIT
 */

!function(a){function b(a){if(x=q(b),!(a<e+l)){for(d+=a-e,e=a,t(a,d),a>i+h&&(f=g*j*1e3/(a-i)+(1-g)*f,i=a,j=0),j++,k=0;d>=c;)if(u(c),d-=c,++k>=240){o=!0;break}v(d/c),w(f,o),o=!1}}var c=1e3/60,d=0,e=0,f=60,g=.9,h=1e3,i=0,j=0,k=0,l=0,m=!1,n=!1,o=!1,p="object"==typeof window?window:a,q=p.requestAnimationFrame||function(){var a=Date.now(),b,d;return function(e){return b=Date.now(),d=Math.max(0,c-(b-a)),a=b+d,setTimeout(function(){e(b+d)},d)}}(),r=p.cancelAnimationFrame||clearTimeout,s=function(){},t=s,u=s,v=s,w=s,x;a.MainLoop={getSimulationTimestep:function(){return c},setSimulationTimestep:function(a){return c=a,this},getFPS:function(){return f},getMaxAllowedFPS:function(){return 1e3/l},setMaxAllowedFPS:function(a){return"undefined"==typeof a&&(a=1/0),0===a?this.stop():l=1e3/a,this},resetFrameDelta:function(){var a=d;return d=0,a},setBegin:function(a){return t=a||t,this},setUpdate:function(a){return u=a||u,this},setDraw:function(a){return v=a||v,this},setEnd:function(a){return w=a||w,this},start:function(){return n||(n=!0,x=q(function(a){v(1),m=!0,e=a,i=a,j=0,x=q(b)})),this},stop:function(){return m=!1,n=!1,r(x),this},isRunning:function(){return m}},"function"==typeof define&&define.amd?define(a.MainLoop):"object"==typeof module&&null!==module&&"object"==typeof module.exports&&(module.exports=a.MainLoop)}(this);

},{}],"shared/components/color.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Color = void 0;

var _ecs = require("@jakeklassen/ecs");

class Color extends _ecs.Component {
  constructor(color) {
    super();
    this.color = color;
  }

}

exports.Color = Color;
},{"@jakeklassen/ecs":"node_modules/@jakeklassen/ecs/dist-web/index.js"}],"shared/components/rectangle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rectangle = void 0;

var _ecs = require("@jakeklassen/ecs");

class Rectangle extends _ecs.Component {
  constructor(x, y, width, height) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

}

exports.Rectangle = Rectangle;
},{"@jakeklassen/ecs":"node_modules/@jakeklassen/ecs/dist-web/index.js"}],"shared/vector2.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector2 = void 0;

var _ecs = require("@jakeklassen/ecs");

class Vector2 extends _ecs.Component {
  constructor(x = 0, y = 0) {
    super();
    this.x = 0;
    this.y = 0;
    this.x = x;
    this.y = y;
  }

  static zero() {
    return new Vector2(0, 0);
  }

}

exports.Vector2 = Vector2;
},{"@jakeklassen/ecs":"node_modules/@jakeklassen/ecs/dist-web/index.js"}],"shared/components/transform.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Transform = void 0;

var _ecs = require("@jakeklassen/ecs");

var _vector = require("../vector2");

class Transform extends _ecs.Component {
  constructor(position = _vector.Vector2.zero()) {
    super();
    this.position = _vector.Vector2.zero();
    this.position = position;
  }

}

exports.Transform = Transform;
},{"@jakeklassen/ecs":"node_modules/@jakeklassen/ecs/dist-web/index.js","../vector2":"shared/vector2.ts"}],"shared/components/velocity.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Velocity = void 0;

var _ecs = require("@jakeklassen/ecs");

class Velocity extends _ecs.Component {
  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
  }

  flipX() {
    this.x *= -1;
  }

  flipY() {
    this.y *= -1;
  }

}

exports.Velocity = Velocity;
},{"@jakeklassen/ecs":"node_modules/@jakeklassen/ecs/dist-web/index.js"}],"shared/components/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _color = require("./color");

Object.keys(_color).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _color[key];
    }
  });
});

var _rectangle = require("./rectangle");

Object.keys(_rectangle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _rectangle[key];
    }
  });
});

var _transform = require("./transform");

Object.keys(_transform).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _transform[key];
    }
  });
});

var _velocity = require("./velocity");

Object.keys(_velocity).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _velocity[key];
    }
  });
});
},{"./color":"shared/components/color.ts","./rectangle":"shared/components/rectangle.ts","./transform":"shared/components/transform.ts","./velocity":"shared/components/velocity.ts"}],"basic/components/ball-tag.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BallTag = void 0;

var _ecs = require("@jakeklassen/ecs");

class BallTag extends _ecs.Component {}

exports.BallTag = BallTag;
},{"@jakeklassen/ecs":"node_modules/@jakeklassen/ecs/dist-web/index.js"}],"basic/basic.ts":[function(require,module,exports) {
"use strict";

var _ecs = require("@jakeklassen/ecs");

var mainloop = _interopRequireWildcard(require("mainloop.js"));

var _components = require("../shared/components");

var _vector = require("../shared/vector2");

var _ballTag = require("./components/ball-tag");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// tslint:disable: max-classes-per-file
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

if (ctx == null) {
  throw new Error('failed to obtain canvas 2d context');
}

const world = new _ecs.World();
const ball = world.createEntity();
world.addEntityComponents(ball, new _ballTag.BallTag(), new _components.Transform(new _vector.Vector2(10, 10)), new _components.Velocity(100, 200), new _components.Rectangle(10, 10, 12, 12), new _components.Color('red'));

class BallMovementSystem extends _ecs.System {
  constructor(viewport) {
    super();
    this.viewport = viewport;
  }

  update(world, dt) {
    const ball = world.findEntity(_ballTag.BallTag);

    if (ball == null) {
      throw new Error('Entity with BallTag not found');
    }

    const components = world.getEntityComponents(ball);
    const rectangle = components.get(_components.Rectangle);
    const transform = components.get(_components.Transform);
    const velocity = components.get(_components.Velocity);
    transform.position.x += velocity.x * dt;
    transform.position.y += velocity.y * dt;

    if (transform.position.x + rectangle.width > this.viewport.width) {
      transform.position.x = this.viewport.width - rectangle.width;
      velocity.flipX();
    } else if (transform.position.x < 0) {
      transform.position.x = 0;
      velocity.flipX();
    }

    if (transform.position.y + rectangle.height > this.viewport.height) {
      transform.position.y = this.viewport.height - rectangle.height;
      velocity.flipY();
    } else if (transform.position.y < 0) {
      transform.position.y = 0;
      velocity.flipY();
    }
  }

}

class RenderingSystem extends _ecs.System {
  constructor(context) {
    super();
    this.context = context;
  }

  update(world) {
    this.context.clearRect(0, 0, 640, 480);

    for (const [entity, components] of world.view(_components.Rectangle, _components.Color, _components.Transform)) {
      const {
        color
      } = components.get(_components.Color);
      const {
        width,
        height
      } = components.get(_components.Rectangle);
      const transform = components.get(_components.Transform);
      this.context.fillStyle = color;
      this.context.fillRect(transform.position.x, transform.position.y, width, height);
    }
  }

}

world.addSystem(new BallMovementSystem(new _components.Rectangle(0, 0, canvas.width, canvas.height)));
world.addSystem(new RenderingSystem(ctx));
mainloop.setUpdate(dt => {
  world.updateSystems(dt / 1000);
}).start();
},{"@jakeklassen/ecs":"node_modules/@jakeklassen/ecs/dist-web/index.js","mainloop.js":"node_modules/mainloop.js/build/mainloop.min.js","../shared/components":"shared/components/index.ts","../shared/vector2":"shared/vector2.ts","./components/ball-tag":"basic/components/ball-tag.ts"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "46631" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","basic/basic.ts"], null)
//# sourceMappingURL=/basic.b21408c9.js.map
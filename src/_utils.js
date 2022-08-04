export function appendBits(val, len, bb) {
  if (len < 0 || len > 31 || val >>> len != 0) throw new RangeError('Value out of range');
  for (let i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1);
}

export function getBit(x, i) {
  return ((x >>> i) & 1) != 0;
}

export function assert(cond) {
  if (!cond) throw new Error('Assertion error');
}

export function isEmpty(input, options) {
  options = { isEmpty: [], isNotEmpty: [], ...options };

  if (options.isEmpty?.includes?.(input)) return true;
  if (options.isNotEmpty?.includes?.(input)) return false;
  if ([undefined, null].includes(input)) return true;

  if (input?.constructor?.name === 'Array') return !input.length;
  if (input?.constructor?.name === 'Number') return Number.isNaN(input);
  if (input?.constructor?.name === 'Object') return !Object.keys(input).length;
  if (input?.constructor?.name === 'String') return !input.trim().length;

  return false;
}

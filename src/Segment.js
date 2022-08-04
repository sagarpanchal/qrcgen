import { Mode } from './Mode';
import { appendBits } from './_utils';

export class Segment {
  static NUMERIC_REGEX = /^[0-9]*$/;
  static ALPHANUMERIC_REGEX = /^[A-Z0-9 $%*+./:-]*$/;
  static ALPHANUMERIC_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

  static Mode = Mode;

  constructor(mode, numChars, bitData) {
    this.mode = mode;
    this.numChars = numChars;
    this.bitData = bitData;
    if (numChars < 0) throw new RangeError('Invalid argument');
    this.bitData = bitData.slice();
  }

  static makeBytes(data) {
    const bb = [];
    for (const b of data) appendBits(b, 8, bb);
    return new Segment(Segment.Mode.BYTE, data.length, bb);
  }

  static makeNumeric(digits) {
    if (!Segment.isNumeric(digits)) throw new RangeError('String contains non-numeric characters');
    const bb = [];

    for (let i = 0; i < digits.length; ) {
      const n = Math.min(digits.length - i, 3);
      appendBits(parseInt(digits.substr(i, n), 10), n * 3 + 1, bb);
      i += n;
    }
    return new Segment(Segment.Mode.NUMERIC, digits.length, bb);
  }

  static makeAlphanumeric(text) {
    if (!Segment.isAlphanumeric(text))
      throw new RangeError('String contains unencodable characters in alphanumeric mode');
    const bb = [];
    let i;

    for (i = 0; i + 2 <= text.length; i += 2) {
      let temp = Segment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)) * 45;
      temp += Segment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i + 1));
      appendBits(temp, 11, bb);
    }
    if (i < text.length) appendBits(Segment.ALPHANUMERIC_CHARSET.indexOf(text.charAt(i)), 6, bb);
    return new Segment(Segment.Mode.ALPHANUMERIC, text.length, bb);
  }

  static makeSegments(text) {
    if (text == '') return [];
    else if (Segment.isNumeric(text)) return [Segment.makeNumeric(text)];
    else if (Segment.isAlphanumeric(text)) return [Segment.makeAlphanumeric(text)];
    else return [Segment.makeBytes(Segment.toUtf8ByteArray(text))];
  }

  static makeEci(assignVal) {
    const bb = [];
    if (assignVal < 0) throw new RangeError('ECI assignment value out of range');
    else if (assignVal < 1 << 7) appendBits(assignVal, 8, bb);
    else if (assignVal < 1 << 14) {
      appendBits(0b10, 2, bb);
      appendBits(assignVal, 14, bb);
    } else if (assignVal < 1000000) {
      appendBits(0b110, 3, bb);
      appendBits(assignVal, 21, bb);
    } else throw new RangeError('ECI assignment value out of range');
    return new Segment(Segment.Mode.ECI, 0, bb);
  }

  static isNumeric(text) {
    return Segment.NUMERIC_REGEX.test(text);
  }

  static isAlphanumeric(text) {
    return Segment.ALPHANUMERIC_REGEX.test(text);
  }

  getData() {
    return this.bitData.slice();
  }

  static getTotalBits(segs, version) {
    let result = 0;

    for (const seg of segs) {
      const ccbits = seg.mode.numCharCountBits(version);
      if (seg.numChars >= 1 << ccbits) return Infinity;
      result += 4 + ccbits + seg.bitData.length;
    }
    return result;
  }

  static toUtf8ByteArray(str) {
    str = encodeURI(str);
    const result = [];

    for (let i = 0; i < str.length; i++) {
      if (str.charAt(i) != '%') result.push(str.charCodeAt(i));
      else {
        result.push(parseInt(str.substr(i + 1, 2), 16));
        i += 2;
      }
    }
    return result;
  }
}

export class Mode {
  constructor(modeBits, numBitsCharCount) {
    this.modeBits = modeBits;
    this.numBitsCharCount = numBitsCharCount;
  }

  numCharCountBits(ver) {
    return this.numBitsCharCount[Math.floor((ver + 7) / 17)];
  }

  static NUMERIC = new Mode(0x1, [10, 12, 14]);
  static ALPHANUMERIC = new Mode(0x2, [9, 11, 13]);
  static BYTE = new Mode(0x4, [8, 16, 16]);
  static KANJI = new Mode(0x8, [8, 10, 12]);
  static ECI = new Mode(0x7, [0, 0, 0]);
}

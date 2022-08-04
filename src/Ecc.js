export class Ecc {
  constructor(ordinal, formatBits) {
    this.ordinal = ordinal;
    this.formatBits = formatBits;
  }

  static LOW = new Ecc(0, 1);
  static MEDIUM = new Ecc(1, 0);
  static QUARTILE = new Ecc(2, 3);
  static HIGH = new Ecc(3, 2);
}

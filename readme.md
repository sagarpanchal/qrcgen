# QR Code Generator

## Example

```JavaScript
const qrCode = QrCode.encodeText(
  `https://github.com/sagarpanchal/qrcgen`,
  QrCode.Ecc.HIGH
);

const svg = Code.toSVGString(...args);
document.body.innerHTML = svg
```

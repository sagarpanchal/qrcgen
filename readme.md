# QR Code Generator

## Example

- JavaScript

```JavaScript
const text = `https://github.com/sagarpanchal/qrcgen`
const qrCode = QrCode.encodeText(text, QrCode.Ecc.HIGH)
const svgString = Code.toSVGString()
document.body.innerHTML = svgString
```

- React

```JSX
import React from "react"

function QrCodeView(props) {
  const { text = '' } = props
  const containerRef = React.useRef(null)

  const svgString = React.useMemo(() => {
    return QrCode.encodeText(text, QrCode.Ecc.HIGH).toSVGString();
  }. [text])

  React.useLayoutEffect(() => {
    const container = containerRef.current
    if (container) {
      container.innerHTML = svgString
    }
  })

  return (
    <div className="qr-code" ref={containerRef} />
  )
}

<QrCodeView text={`https://github.com/sagarpanchal/qrcgen`} />
```

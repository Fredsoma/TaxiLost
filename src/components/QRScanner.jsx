import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

/**
 * Props:
 *   onScanSuccess: (decodedText: string) => void
 */
export default function QRScanner({ onScanSuccess }) {
  const scannerRef = useRef(null);

  useEffect(() => {
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      config,
      false
    );

    scanner.render(
      (decodedText, decodedResult) => {
        if (onScanSuccess) onScanSuccess(decodedText);
      },
      (errorMessage) => {
        // ignore scan errors
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear QR scanner", error);
      });
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" style={{ width: "100%" }} />;
}

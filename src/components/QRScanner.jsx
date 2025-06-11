import React, { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ onScan }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText, decodedResult) => {
        onScan(decodedText);
        
        scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
      },
      (errorMessage) => {
       
      }
    );

    return () => {
     
      if (scannerRef.current) {
        scannerRef.current.clear().catch((e) => console.error("Failed to clear scanner", e));
      }
    };
  }, [onScan]);

  return <div id="qr-reader" style={{ width: "100%", marginTop: "10px" }}></div>;
};

export default QRScanner;

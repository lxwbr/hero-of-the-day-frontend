"use client"
import { useEffect } from "react"

// Global flag to indicate MSW readiness
declare global {
  interface Window {
    __MSW_READY__?: boolean;
  }
}

export default function MSWInit() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("MSW: Starting in development mode");
      
      // Import and start MSW worker
      import("../mocks/browser")
        .then(({ worker }) => {
          console.log("MSW: Worker imported successfully", worker);
          console.log("MSW: Starting worker...");
          return worker.start({
            onUnhandledRequest: 'bypass',
            quiet: false,
          });
        })
        .then(() => {
          console.log("MSW: Worker started successfully");
          window.__MSW_READY__ = true;
        })
        .catch((error) => {
          console.error("MSW: Failed to start worker:", error);
        });
    } else {
      console.log("MSW: Not in development mode, skipping");
      window.__MSW_READY__ = true; // In production, assume ready
    }
  }, [])
  
  return null
} 
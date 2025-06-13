"use client"
import { useEffect } from "react"

// Extend Window interface to include our custom property
declare global {
  interface Window {
    __MSW_WORKER_STARTED__?: boolean;
  }
}

export default function MSWInit() {
  useEffect(() => {
    console.log("MSWInit: Component mounted, NODE_ENV:", process.env.NODE_ENV);
    
    if (process.env.NODE_ENV === "development") {
      console.log("MSWInit: In development mode, starting MSW...");
      
      // Check if worker is already started
      if (window.__MSW_WORKER_STARTED__) {
        console.log("MSWInit: Worker already started, skipping...");
        return;
      }

      // Import and start worker
      import("../mocks/browser")
        .then(({ worker }) => {
          console.log("MSWInit: Successfully imported worker, starting...");
          return worker.start({
            onUnhandledRequest: 'bypass',
            quiet: false, // Show MSW logs
          });
        })
        .then(() => {
          console.log("MSWInit: Worker started successfully!");
          window.__MSW_WORKER_STARTED__ = true;
        })
        .catch((error) => {
          console.error("MSWInit: Failed to start worker:", error);
        });
    } else {
      console.log("MSWInit: Not in development mode, skipping MSW");
    }
  }, [])
  
  return null
} 
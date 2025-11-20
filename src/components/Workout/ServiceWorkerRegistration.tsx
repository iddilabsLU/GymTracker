"use client";

/**
 * SERVICE WORKER REGISTRATION
 *
 * Registers the service worker for offline functionality.
 * This component should be included in the app layout.
 */

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "[Service Worker] Registration successful:",
            registration.scope
          );

          // Check for updates periodically
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker available
                  console.log("[Service Worker] New version available");

                  // Optionally show a notification to the user
                  if (
                    window.confirm(
                      "A new version of the app is available. Reload to update?"
                    )
                  ) {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[Service Worker] Registration failed:", error);
        });

      // Handle controller change (when new service worker takes over)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("[Service Worker] Controller changed");
      });
    }
  }, []);

  return null; // This component doesn't render anything
}

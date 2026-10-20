"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/registerSW";

export function LayoutClient() {
  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker();
  }, []);
  
  return null;
}

// Service Worker for Smart Learning Games PWA
const CACHE_NAME = "smart-learning-games-v1";
const ASSETS_CACHE = "assets-cache-v1";
const DATA_CACHE = "data-cache-v1";

// Files to cache for offline use
const urlsToCache = [
  "/",
  "/manifest.json",
  "/globals.css",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
];

// Asset files to cache
const assetFiles = [
  "/icons/apple-touch-icon.png",
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching app shell");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("App shell cached successfully");
      })
      .catch((error) => {
        console.error("Failed to cache app shell:", error);
      })
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== ASSETS_CACHE && cacheName !== DATA_CACHE) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch handler for caching strategies
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }
  
  // Cache API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      caches
        .open(DATA_CACHE)
        .then((cache) => {
          return fetch(event.request)
            .then((response) => {
              // Clone and cache the response
              const responseClone = response.clone();
              cache.put(event.request, responseClone);
              return response;
            })
            .catch(() => {
              // Return cached response if available
              return cache.match(event.request);
            });
        })
    );
    return;
  }
  
  // Cache asset files with cache-first strategy
  if (assetFiles.some((file) => url.pathname.endsWith(file))) {
    event.respondWith(
      caches
        .open(ASSETS_CACHE)
        .then((cache) => {
          return cache.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(event.request).then((response) => {
              const responseClone = response.clone();
              cache.put(event.request, responseClone);
              return response;
            });
          });
        })
    );
    return;
  }
  
  // Cache app shell with stale-while-revalidate strategy
  event.respondWith(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          // Return cached response immediately
          const fetchPromise = fetch(event.request).then((response) => {
            // Update cache with fresh response
            const responseClone = response.clone();
            cache.put(event.request, responseClone);
            return response;
          });
          
          return cachedResponse || fetchPromise;
        });
      })
  );
});

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-progress") {
    event.waitUntil(syncProgressData());
  }
});

async function syncProgressData() {
  // This would sync offline progress data when connection is restored
  console.log("Syncing offline progress data");
  
  // In a real implementation, you would:
  // 1. Open IndexedDB
  // 2. Get queued progress data
  // 3. Send to server
  // 4. Remove from queue on success
  
  // For now, just log
  const queue = await getQueue();
  if (queue.length > 0) {
    console.log(`Found ${queue.length} items to sync`);
    // Simulate sync
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await clearQueue();
    console.log("Sync completed");
  }
}

// Helper functions for IndexedDB queue
async function getQueue(): Promise<any[]> {
  return new Promise((resolve) => {
    const request = indexedDB.open("SmartLearningQueue", 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("queue", "readonly");
      const store = transaction.objectStore("queue");
      const getAll = store.getAll();
      getAll.onsuccess = () => resolve(getAll.result);
      getAll.onerror = () => resolve([]);
    };
    request.onerror = () => resolve([]);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore("queue", { keyPath: "id" });
    };
  });
}

async function clearQueue(): Promise<void> {
  return new Promise((resolve) => {
    const request = indexedDB.open("SmartLearningQueue", 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("queue", "readwrite");
      const store = transaction.objectStore("queue");
      const clear = store.clear();
      clear.onsuccess = () => resolve();
      clear.onerror = () => resolve();
    };
    request.onerror = () => resolve();
  });
}

// Push notification handler
self.addEventListener("push", (event) => {
  const data = event.data?.json();
  const title = data?.title || "Smart Learning Games";
  const options = {
    body: data?.body || "You have new updates!",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge.png",
    data: data?.url ? { url: data.url } : {},
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  
  if (event.notification.data?.url) {
    clients.openWindow(event.notification.data.url);
  } else {
    clients.openWindow("/");
  }
});

// Periodic sync (if supported)
if ("periodicSync" in self.registration) {
  self.registration.periodicSync.register("sync-progress", {
    minInterval: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Message handler from client
self.addEventListener("message", (event) => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
  
  if (event.data.action === "syncNow") {
    self.registration.sync.register("sync-progress");
  }
});

// Handle offline/online events
let isOnline = true;

self.addEventListener("online", () => {
  isOnline = true;
  console.log("Back online, triggering sync");
  self.registration.sync.register("sync-progress");
});

self.addEventListener("offline", () => {
  isOnline = false;
  console.log("Offline mode activated");
});

// Cache API for dynamic content
class SmartLearningCache {
  static async get(key: string) {
    const cache = await caches.open(DATA_CACHE);
    const response = await cache.match(key);
    return response ? await response.json() : null;
  }
  
  static async set(key: string, data: any) {
    const cache = await caches.open(DATA_CACHE);
    const response = new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
    await cache.put(key, response);
  }
  
  static async delete(key: string) {
    const cache = await caches.open(DATA_CACHE);
    await cache.delete(key);
  }
  
  static async clear() {
    const cache = await caches.open(DATA_CACHE);
    const keys = await cache.keys();
    await Promise.all(keys.map((key) => cache.delete(key)));
  }
}

// Make available to clients
self.SmartLearningCache = SmartLearningCache;

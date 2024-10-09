// service-worker.js
const CACHE_NAME = 'africalend-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/script/main.js',
  '/images/logo.png',
  // Ajoutez ici toutes les ressources nécessaires pour le fonctionnement hors ligne
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a stream and can only be consumed once
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Background Sync
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-calendar') {
    event.waitUntil(syncCalendar());
  }
});

async function syncCalendar() {
  // Implémentez ici la logique pour synchroniser le calendrier
  // Par exemple, envoyer des changements locaux au serveur
  const unsyncedChanges = await getUnsyncedChanges();
  if (unsyncedChanges.length > 0) {
    try {
      await sendChangesToServer(unsyncedChanges);
      await markChangesSynced(unsyncedChanges);
    } catch (error) {
      console.error('Failed to sync changes:', error);
    }
  }
}

// Periodic Sync
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'update-calendar') {
    event.waitUntil(updateCalendar());
  }
});

async function updateCalendar() {
  // Implémentez ici la logique pour mettre à jour périodiquement le calendrier
  try {
    const response = await fetch('/api/calendar/updates');
    if (response.ok) {
      const updates = await response.json();
      await applyUpdatesToLocalStorage(updates);
      console.log('Calendar updated successfully');
    }
  } catch (error) {
    console.error('Failed to update calendar:', error);
  }
}

// Push Notifications
self.addEventListener('push', function(event) {
  const options = {
    body: event.data.text() || 'Nouvelle mise à jour du calendrier disponible !',
    icon: 'images/icon.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Africalend', options)
  );
});

// Helper functions (you need to implement these)
async function getUnsyncedChanges() {
  // Retrieve unsynced changes from IndexedDB or other local storage
}

async function sendChangesToServer(changes) {
  // Send changes to your server
}

async function markChangesSynced(changes) {
  // Mark changes as synced in local storage
}

async function applyUpdatesToLocalStorage(updates) {
  // Apply updates to local storage (IndexedDB or other)
}

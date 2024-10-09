// service-worker.js
const CACHE_NAME = 'africalend-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/script/main.js',
  '/images/logo.png'
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
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
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
  console.log('Synchronisation du calendrier en arrière-plan');
}

// Periodic Sync
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'update-calendar') {
    event.waitUntil(updateCalendar());
  }
});

async function updateCalendar() {
  // Implémentez ici la logique pour mettre à jour périodiquement le calendrier
  console.log('Mise à jour périodique du calendrier');
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

// ══════════════════════════════════════════════════
// SERVICE WORKER — NBA Playoffs 2026
// ══════════════════════════════════════════════════

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

// Réception d'un push
self.addEventListener('push', e => {
  if (!e.data) return;

  let payload;
  try { payload = e.data.json(); }
  catch { payload = { title: 'NBA Playoffs', body: e.data.text() }; }

  const options = {
    body:    payload.body    || '',
    icon:    payload.icon    || '/icon-192.png',
    badge:   payload.badge   || '/icon-192.png',
    tag:     payload.tag     || 'nba-notif',
    data:    payload.data    || {},
    vibrate: [200, 100, 200],
    requireInteraction: payload.requireInteraction || false,
  };

  e.waitUntil(self.registration.showNotification(payload.title || 'NBA Playoffs', options));
});

// Clic sur la notif → ouvre/focus l'app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow('/');
    })
  );
});

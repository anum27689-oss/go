
let prayerTimeouts = [];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'SCHEDULE_PRAYERS') {
    clearScheduledPrayers();
    
    const prayers = event.data.payload.prayers;
    const translations = event.data.payload.translations;

    prayers.forEach(prayer => {
      const prayerTime = new Date(prayer.date);
      const now = new Date();

      if (prayerTime > now) {
        const timeout = prayerTime.getTime() - now.getTime();
        const timeoutId = setTimeout(() => {
          self.registration.showNotification(translations.title, {
            body: prayer.name,
            icon: '/icon.png',
            vibrate: [200, 100, 200],
            tag: prayer.name,
          });
        }, timeout);
        prayerTimeouts.push(timeoutId);
      }
    });
  } else if (event.data.type === 'CANCEL_PRAYERS') {
    clearScheduledPrayers();
  }
});

function clearScheduledPrayers() {
  prayerTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  prayerTimeouts = [];
}

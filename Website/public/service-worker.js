// public/service-worker.js

self.addEventListener('push', function (event) {
    const options = {
        title: event.data.json().title,
        body: event.data.json().body,
        icon: event.data.json().icon,
        vibrate: event.data.json().vibrate,
        data: event.data.json().data,
        actions: event.data.json().actions
    };

    event.waitUntil(
        self.registration.showNotification('Civilator Notification', options)
    );
});
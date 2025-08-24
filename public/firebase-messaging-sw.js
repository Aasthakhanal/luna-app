/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyCjO3YfudxrI1ad9RNwHFOrEgZ_0NYbBA8",
  authDomain: "luna-d0be0.firebaseapp.com",
  projectId: "luna-d0be0",
  storageBucket: "luna-d0be0.firebasestorage.app",
  messagingSenderId: "777487521208",
  appId: "1:777487521208:web:c4a00c057ec81a54daab4d",
  measurementId: "G-MJYPDXY7GD",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title || "Luna";
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/luna-logo.png", // Use Luna logo as default
    badge: "/luna-logo.png", // Small icon in notification badge
    image: payload.notification.image, // Large image if provided
    tag: "luna-notification", // Group notifications
    requireInteraction: false, // Auto-dismiss after timeout
    actions: [
      {
        action: "open",
        title: "Open App",
        icon: "/luna-logo.png",
      },
    ],
    data: {
      url: payload.notification.click_action || "/",
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  // Handle action button clicks
  if (event.action === "open") {
    // Open the app
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  } else {
    // Default click behavior - open the app
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  }
});

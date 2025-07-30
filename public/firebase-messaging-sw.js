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
  apiKey: "AIzaSyAaALSHGuxKsenO46tRpy3cbzyXYDOIxFQ",
  authDomain: "luna-app-8cd03.firebaseapp.com",
  projectId: "luna-app-8cd03",
  storageBucket: "luna-app-8cd03.firebasestorage.app",
  messagingSenderId: "652121547326",
  appId: "1:652121547326:web:3ce0bbb9e9887db308676f",
  measurementId: "G-SM4FG2SQE8",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  // Customize notification here
  const notificationTitle = "payload.notification.title";
  const notificationOptions = {
    body: "payload.notification.body",
    icon: "payload.notification.image",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

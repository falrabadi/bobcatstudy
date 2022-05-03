// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyA5wFfs4vKbKj0_TkNu-s3MRoUqaxiifnQ",
    authDomain: "bobcatstudy-56325.firebaseapp.com",
    projectId: "bobcatstudy-56325",
    storageBucket: "bobcatstudy-56325.appspot.com",
    messagingSenderId: "448574606606",
    appId: "1:448574606606:web:bb6e1f522033cc0c729b5f",
    databaseURL:
      "https://console.firebase.google.com/u/1/project/bobcatstudy-56325/firestore/data/~2F",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
 // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
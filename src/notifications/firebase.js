// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCjO3YfudxrI1ad9RNwHFOrEgZ_0NYbBA8",
  authDomain: "luna-d0be0.firebaseapp.com",
  projectId: "luna-d0be0",
  storageBucket: "luna-d0be0.firebasestorage.app",
  messagingSenderId: "777487521208",
  appId: "1:777487521208:web:c4a00c057ec81a54daab4d",
  measurementId: "G-MJYPDXY7GD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  var fmc_token;
  if (permission === "granted") {
    fmc_token = await getToken(messaging, {
      vapidKey:
        "BDW9L3lhevWtfqEp2lyqTwhP9NpFNcExyGPuYsK1Bmd2ifnaGdI1SltvsedMXgv_y-qwA_7_sV_CrvdciQe2Okw",
    });
  }
  return fmc_token;
};

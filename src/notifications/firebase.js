// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaALSHGuxKsenO46tRpy3cbzyXYDOIxFQ",
  authDomain: "luna-app-8cd03.firebaseapp.com",
  projectId: "luna-app-8cd03",
  storageBucket: "luna-app-8cd03.firebasestorage.app",
  messagingSenderId: "652121547326",
  appId: "1:652121547326:web:3ce0bbb9e9887db308676f",
  measurementId: "G-SM4FG2SQE8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey:
        "BLPd6-ZYoJnfZkc5PMTqcDdqTEQwzwC6KVpTqyiRKdO2z80XwffSNRJeEispy_ntff2MAA5FAXeM6n6hcPG9Ui4",
    });
    console.log(token, "token");
  }
};

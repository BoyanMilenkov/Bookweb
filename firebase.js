import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDSVB_m--vKWpFjpa1PSyZoF7slhTdGN08",
  authDomain: "bookweb-99ef4.firebaseapp.com",
  projectId: "bookweb-99ef4",
  storageBucket: "bookweb-99ef4.appspot.com",
  messagingSenderId: "415676602525",
  appId: "1:415676602525:web:5ed67a9357cc9e3b88dc74",
  measurementId: "G-VDFL9E4XYJ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDSVB_m--vKWpFjpa1PSyZoF7slhTdGN08",
    authDomain: "bookweb-99ef4.firebaseapp.com",
    databaseURL: "https://bookweb-99ef4-default-rtdb.firebaseio.com",
    projectId: "bookweb-99ef4",
    storageBucket: "bookweb-99ef4.appspot.com",
    messagingSenderId: "415676602525",
    appId: "1:415676602525:web:5ed67a9357cc9e3b88dc74",
    measurementId: "G-VDFL9E4XYJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const adminRef = collection(db, 'admin');
        const q = query(adminRef, where('email', '==', email), where('password', '==', password));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.size > 0) {
            // Admin login successful
            console.log('Admin login successful');
            window.location.href = 'admin_page.html'; // Redirect to admin_page.html
        } else {
            // Admin login failed
            console.log('Invalid email or password');
            // Handle failed login
        }
    } catch (error) {
        console.error('Error logging in:', error);
        // Handle error
    }
});

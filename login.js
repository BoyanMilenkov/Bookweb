import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const auth = getAuth();

// Function to update links based on authentication status
function updateLinksOnAuth(user) {
    const registerButton = document.getElementById('register');
    const loginButton = document.getElementById('login');
    const profileButton = document.getElementById('profile');
    const createPostButton = document.getElementById('create-post');

    if (registerButton && loginButton && profileButton && createPostButton) {
        if (user) {
            // User is logged in
            registerButton.style.display = 'none';
            loginButton.style.display = 'none';
            profileButton.style.display = 'block';
            createPostButton.style.display = 'none';
        } else {
            // User is not logged in
            registerButton.style.display = 'block';
            loginButton.style.display = 'block';
            profileButton.style.display = 'none';
            createPostButton.style.display = 'none';
        }
    }
}

// Call the function to check auth status on page load and whenever authentication state changes
auth.onAuthStateChanged(function (user) {
    updateLinksOnAuth(user);
});

// Event listener for the login form
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        updateLinksOnAuth(user);

        window.location.href = 'start.html'; // Redirect to start.html after successful login
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/user-not-found') {
            alert('No account with this email exists.');
        } else if (errorCode === 'auth/wrong-password') {
            alert('Incorrect password.');
        } else {
            alert(errorMessage);
        }
    }
});

// Event listener for the return to home button
document.getElementById('returnHomeButton').addEventListener('click', () => {
    window.location.href = 'start.html';
});
// Event listener for the admin button
document.getElementById('adminButton').addEventListener('click', () => {
    window.location.href = 'admin_login.html';
});

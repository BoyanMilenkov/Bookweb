import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const auth = getAuth();

document.getElementById('returnHomeButton').addEventListener('click', () => {
    window.location.href = 'start.html';
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear any existing alerts
    clearAlerts();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const errors = [];

    // Check if password meets minimum length requirement
    if (password.length < 6) {
        errors.push('Password must be at least 6 characters long.');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address.');
    }

    try {
        // Check if name is available
        const nameAvailable = await isNameAvailable(name);
        if (!nameAvailable) {
            errors.push('Name is already taken. Please choose another one.');
        }

        // Check if email is available
        const emailAvailable = await isEmailAvailable(email);
        if (!emailAvailable) {
            errors.push('Email is already in use. Please choose another one.');
        }

        if (errors.length === 0) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user data in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                email: email,
            });

            window.location.href = "start.html";
        } else {
            displayAlerts(errors);
        }
    } catch (error) {
        console.error("Error during registration:", error.message);
        alert("Error creating user or saving data to the database.");
    }
});

// Function to check if name is available
async function isNameAvailable(name) {
    // Get a reference to the users collection
    const usersRef = collection(db, 'users');

    try {
        // Query the users collection for the provided name
        const querySnapshot = await getDocs(query(usersRef, where('name', '==', name)));

        // If no documents are returned, it means the name is available
        return querySnapshot.empty;
    } catch (error) {
        console.error("Error checking name availability:", error);
        return false;
    }
}

// Function to check if email is available
async function isEmailAvailable(email) {
    // Get a reference to the users collection
    const usersRef = collection(db, 'users');

    try {
        // Query the users collection for the provided email
        const querySnapshot = await getDocs(query(usersRef, where('email', '==', email)));

        // If no documents are returned, it means the email is available
        return querySnapshot.empty;
    } catch (error) {
        console.error("Error checking email availability:", error);
        return false;
    }
}

// Function to display alert messages
function displayAlerts(messages) {
    const alertContainer = document.getElementById('alert-container');
    messages.forEach(message => {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert';
        alertDiv.textContent = message;
        alertContainer.appendChild(alertDiv);
    });
}

// Function to clear all alerts
function clearAlerts() {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = '';
}

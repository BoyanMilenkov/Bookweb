// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Initialize Firebase with your configuration
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
const firestore = getFirestore(app);
const auth = getAuth(app);

// Function to pre-fill form fields with existing post details
async function prefillForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');

    try {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(firestore, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const postData = userData.posts[postId];
                document.getElementById('review').value = postData.review;
                document.getElementById('genre').value = postData.genre;
            } else {
                console.log("User document not found.");
            }
        } else {
            console.log("User not signed in.");
        }
    } catch (error) {
        console.error("Error prefilling form: ", error);
    }
}

// Function to submit the edited post
async function submitEditedPost(event) {
    event.preventDefault();

    // Get form values
    const review = document.getElementById('review').value;
    const genre = document.getElementById('genre').value;

    try {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(firestore, "users", user.uid);
            const urlParams = new URLSearchParams(window.location.search);
            const postId = urlParams.get('postId');
            await updateDoc(userDocRef, {
                [`posts.${postId}.review`]: review,
                [`posts.${postId}.genre`]: genre
            }, { merge: true });
            alert("Post edited successfully!");
            window.location.href = 'start.html'; // Redirect to start page after successful edit
        } else {
            alert("User not signed in.");
        }
    } catch (error) {
        console.error("Error editing post: ", error);
        alert("Error editing post. Please try again later.");
    }
}

// Event listener for form submission
document.getElementById('editPostForm').addEventListener('submit', submitEditedPost);

// Pre-fill form when the page loads
window.addEventListener('DOMContentLoaded', prefillForm);
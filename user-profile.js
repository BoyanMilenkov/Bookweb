// Firebase imports and initialization code...
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userId = window.location.search.substring(1).split('=')[1]; // Extract user ID from URL query parameter
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                document.getElementById('name').textContent = userData.name;
                document.getElementById('bio').textContent = userData.bio || "No bio available.";
                
                // Display the profile picture
                const profilePicture = userData.photoURL || 'default-profile-picture.jpg'; // Default picture if not available
                document.getElementById('profilePicture').src = profilePicture;
                
                fetchUserPosts(userId); // Fetch user posts
                fetchUserBooks(userId); // Fetch user books
            } else {
                console.log("User document not found");
            }
        } catch (error) {
            console.error("Error retrieving user data:", error.message);
        }
    } else {
        console.log("User is not logged in, redirecting to login page");
        window.location.href = "login.html";
    }
});

async function fetchUserBooks(userId) {
    const userRef = doc(db, 'users', userId);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const userBooks = userData.books;
            const userBooksContainer = document.getElementById('userBooks');
            userBooksContainer.innerHTML = ''; // Clear previous books

            if (userBooks && userBooks.length > 0) {
                userBooks.forEach(book => {
                    const bookHTML = `
                        <div class="book">
                            <h3>${book.title}</h3>
                            <p>Rating: ${book.rating !== null ? book.rating : 'Not rated'}</p>
                        </div>
                    `;
                    userBooksContainer.insertAdjacentHTML('beforeend', bookHTML);
                });
            } else {
                console.log("User has no books.");
            }
        } else {
            console.log("User document not found.");
        }
    } catch (error) {
        console.error("Error fetching user books:", error.message);
    }
}

async function fetchUserPosts(userId) {
    const userRef = doc(db, 'users', userId);
    try {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const userPosts = userData.posts;
            const userPostsContainer = document.getElementById('userPostsContainer');
            userPostsContainer.innerHTML = ''; // Clear previous posts

            if (userPosts) {
                for (const postId in userPosts) {
                    if (Object.hasOwnProperty.call(userPosts, postId)) {
                        const postData = userPosts[postId];
                        const postHTML = `
                            <div class="post">
                                <h2>${postId}</h2>
                                <p><strong>Author:</strong> ${postData.author}</p>
                                <p><strong>Genre:</strong> ${postData.genre}</p>
                                <p><strong>Review:</strong> ${postData.review}</p>
                            </div>
                        `;
                        userPostsContainer.insertAdjacentHTML('beforeend', postHTML);
                    }
                }
            } else {
                console.log("User has no posts.");
            }
        } else {
            console.log("User document not found.");
        }
    } catch (error) {
        console.error("Error fetching user posts:", error.message);
    }
}

// Redirect to user profile page if the logged-in user clicks their own name
document.getElementById('name').addEventListener('click', () => {
    const user = auth.currentUser;
    if (user) {
        const userId = window.location.search.substring(1).split('=')[1];
        if (userId === user.uid) {
            window.location.href = "profile.html";
        }
    }
});

document.getElementById('returnHomeButton').addEventListener('click', () => {
    window.location.href = "start.html";
});

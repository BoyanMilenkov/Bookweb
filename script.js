import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
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

// Initialize Firebase
initializeApp(firebaseConfig);

// Function to update links based on user authentication status
function updateLinksOnAuth() {
  // Get elements
  const registerButton = document.getElementById("register");
  const loginButton = document.getElementById("login");
  const profileButton = document.getElementById("profile");
  const createPostButton = document.getElementById("create-post");
  const addBookButton = document.getElementById("add-book");
  const myBookListButton = document.getElementById("my-book-list");
  const friendListButton = document.getElementById("friend-list"); // Correct ID
  const genresButton = document.getElementById("genres");

  // Get current user
  const user = getAuth().currentUser;

  // Update links based on authentication status
  if (user) {
    registerButton.style.display = "none";
    loginButton.style.display = "none";
    profileButton.style.display = "block";
    createPostButton.style.display = "block";
    addBookButton.style.display = "block";
    myBookListButton.style.display = "block";
    friendListButton.style.display = "block"; // Show friend list button
    genresButton.style.display = "block";
  } else {
    registerButton.style.display = "block";
    loginButton.style.display = "block";
    profileButton.style.display = "none";
    createPostButton.style.display = "none";
    addBookButton.style.display = "none";
    myBookListButton.style.display = "none";
    friendListButton.style.display = "none"; // Hide friend list button
    genresButton.style.display = "none";
  }
}

// Function to fetch posts from Firestore
async function fetchPosts() {
  const firestore = getFirestore();
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = ""; // Clear previous posts

  // Query Firestore for posts
  const querySnapshot = await getDocs(collection(firestore, "users"));
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    const posts = userData.posts;

    // Display posts for each user
    for (const postId in posts) {
      if (Object.hasOwnProperty.call(posts, postId)) {
        const post = posts[postId];
        const postHTML = `
          <div class="post">
            <h3>Posted by: <a class="username-link" href="user-profile.html?userId=${doc.id}">${userData.name}</a></h3>
            <h2>${postId}</h2>
            <p><strong>Author:</strong> ${post.author}</p>
            <p><strong>Genre:</strong> ${post.genre}</p>
            <p><strong>Review:</strong> ${post.review}</p>
          </div>
        `;
        postsContainer.insertAdjacentHTML("beforeend", postHTML);
      }
    }
  });

  // Redirect to user profile page if the logged-in user clicks their own name
  document.querySelectorAll(".username-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default link behavior
      const user = getAuth().currentUser;
      if (user) {
        const userId = event.target.getAttribute("href").split("=")[1];
        if (userId === user.uid) {
          window.location.href = "profile.html";
        } else {
          window.location.href = event.target.getAttribute("href"); // Redirect to user-profile.html for other users
        }
      }
    });
  });
}

// Function to apply filter based on genre selection
function applyFilter(genre) {
  const posts = document.querySelectorAll(".post");

  // Show or hide posts based on genre
  posts.forEach((post) => {
    const postGenre = post.querySelector("p:nth-child(4)").textContent.split(":")[1].trim().toLowerCase();
    if (genre === "" || postGenre === genre) {
      post.style.display = "block";
    } else {
      post.style.display = "none";
    }
  });
}

// Check authentication status when DOM is loaded
updateLinksOnAuth();

// Update links when auth state changes
getAuth().onAuthStateChanged(function (user) {
  updateLinksOnAuth();
  if (user) {
    fetchPosts();
  } else {
    console.error("User not authenticated.");
    // Handle user not authenticated, e.g., redirect to login page
  }
});
window.applyFilter = applyFilter;
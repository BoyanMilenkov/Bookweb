import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { updateHeader } from "./header.js";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSVB_m--vKWpFjpa1PSyZoF7slhTdGN08",
  authDomain: "bookweb-99ef4.firebaseapp.com",
  databaseURL: "https://bookweb-99ef4-default-rtdb.firebaseio.com",
  projectId: "bookweb-99ef4",
  storageBucket: "bookweb-99ef4.appspot.com",
  messagingSenderId: "415676602525",
  appId: "1:415676602525:web:5ed67a9357cc9e3b88dc74",
  measurementId: "G-VDFL9E4XYJ",
};

// Initialize Firebase
initializeApp(firebaseConfig);

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
            <h2>${postId} - ${post.genre}</h2>
            <p><strong>Author:</strong> ${post.author}</p>
            <div class="posted-by-container">
              <p><strong>Posted By:</strong> <a class="username-link" href="user-profile.html?userId=${doc.id}">${userData.name}</a></p>
            </div>
            <div class="review-container">
              <p><strong>Review:</strong></p>
              <div class="review">
                <p>${post.review}</p>
              </div>
              <button class="read-more">Read More</button>
              <button class="read-less" style="display: none;">Read Less</button>
            </div>
          </div>
        `;
        postsContainer.insertAdjacentHTML("beforeend", postHTML);
      }
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

// Function to apply filter based on genre selection
function applyFilter(genre) {
  const posts = document.querySelectorAll(".post");

  // Show or hide posts based on genre
  posts.forEach((post) => {
    const postGenre = post
      .querySelector("h2")
      .textContent.split("-")[1]
      .trim()
      .toLowerCase();
    if (genre === "" || postGenre === genre) {
      post.style.display = "block";
    } else {
      post.style.display = "none";
    }
  });
}

// Function to add "Read More" and "Read Less" functionality to each post
// Function to add "Read More" and "Read Less" functionality to each post
function addReadMoreAndLessFunctionality() {
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    const reviewContainer = post.querySelector(".review");
    const reviewText = reviewContainer.textContent.trim();
    const reviewWords = reviewText.split(" ");

    if (reviewWords.length > 30) {
      const shortText = reviewWords.slice(0, 30).join(" ");
      const remainingText = reviewWords.slice(30).join(" ");
      reviewContainer.innerHTML =
        shortText +
        `<span class="more-text" style="display: none;"> ${remainingText}</span>`;
      const readMoreBtn = post.querySelector(".read-more");
      const readLessBtn = post.querySelector(".read-less");

      readMoreBtn.style.display = "inline";
      readMoreBtn.addEventListener("click", function () {
        const moreText = post.querySelector(".more-text");
        moreText.style.display = "inline";
        readMoreBtn.style.display = "none";
        readLessBtn.style.display = "inline";
      });

      readLessBtn.addEventListener("click", function () {
        const moreText = post.querySelector(".more-text");
        moreText.style.display = "none";
        readMoreBtn.style.display = "inline";
        readLessBtn.style.display = "none";
      });
    }
  });
}

// Check authentication status when DOM is loaded
getAuth().onAuthStateChanged(function (user) {
  const headerContainer = document.getElementById("headerContainer");
  headerContainer.innerHTML = updateHeader(user);
  if (user) {
    fetchPosts();
  } else {
    console.error("User not authenticated.");
    // Handle user not authenticated, e.g., redirect to login page
  }
});

window.applyFilter = applyFilter;

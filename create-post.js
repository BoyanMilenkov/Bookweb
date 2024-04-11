// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Initialize Firebase with your configuration
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
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

// Function to validate genre
async function validateGenre(genre) {
  try {
    const validCollections = [
      "Adventure",
      "Dystopian",
      "Fantasy",
      "Historical",
      "Horror",
      "Memoir and Biography",
      "Romance",
      "ScienceFiction",
      "Thriller"
    ];

    // Check if the selected genre matches any of the collections
    return validCollections.includes(genre);
  } catch (error) {
    console.error("Error validating genre:", error);
    return false;
  }
}

// Function to check if the book exists in the correct genre collection
async function bookInCorrectGenre(title, genre) {
  try {
    const genreCollectionRef = collection(firestore, genre);
    const q = query(genreCollectionRef, where("title", "==", title));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking book in correct genre:", error);
    return false;
  }
}

// Function to submit the post
async function submitPost(event) {
  event.preventDefault();

  // Get form values
  const author = document.getElementById("author").value.trim();
  const title = document.getElementById("title").value.trim();
  const review = document.getElementById("review").value.trim();
  const genre = document.getElementById("genre").value.trim();

  // Check if author and title are provided
  if (!author || !title) {
    alert("Please provide both author and title!");
    return;
  }

  // Validate genre
  if (!(await validateGenre(genre))) {
    alert("Please select a valid genre!");
    return;
  }

  // Check if the book exists in the correct genre
  if (!(await bookInCorrectGenre(title, genre))) {
    alert("The book doesn't exist in our database!");
    return;
  }

  try {
    const user = auth.currentUser;
    if (user) {
      // Get the reference to the user's document
      const userDocRef = doc(firestore, `users/${user.uid}`);

      // Check if the post with the same title already exists
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      const posts = userData ? userData.posts || {} : {};

      if (posts.hasOwnProperty(title)) {
        alert("A post with the same title already exists!");
        return;
      }

      // Add the new post
      await setDoc(
        userDocRef,
        {
          posts: {
            ...posts,
            [title]: {
              author: author,
              genre: genre,
              review: review,
            },
          },
        },
        { merge: true }
      );

      alert("Post added successfully!");
      window.location.href = "start.html"; // Redirect to start page after successful submission
    } else {
      alert("User not signed in.");
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error adding document. Please try again later.");
  }
}

// Event listener for form submission
document
  .getElementById("postForm")
  .addEventListener("submit", submitPost);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { updateHeader } from "./header.js"; // Import the updateHeader function

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
const db = getFirestore(app);
const auth = getAuth();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is authenticated, proceed with book submission functionality
    const addBookForm = document.getElementById("addBookForm");

    // Function to submit the book to Firestore
    async function submitBook(event) {
      event.preventDefault();

      // Get form values
      const author = document.getElementById("author").value;
      const title = document.getElementById("title").value;
      const genre = document.getElementById("genre").value;
      const description = document.getElementById("description").value;

      // Define a mapping of genres to collection names
      const genreToCollection = {
        /* Your genre to collection mapping */
      };

      // Check if the selected genre has a corresponding collection
      if (genreToCollection.hasOwnProperty(genre)) {
        try {
          // Add a new document with a generated ID to the corresponding collection
          await addDoc(collection(db, genreToCollection[genre]), {
            author: author,
            title: title,
            genre: genre,
            description: description,
          });

          alert("Book added successfully!");
          // Optionally, redirect the user to another page or perform other actions
        } catch (error) {
          console.error("Error adding document: ", error);
          alert("Error adding document. Please try again later.");
        }
      } else {
        // Display an error message if the selected genre does not have a corresponding collection
        alert("No collection found for the selected genre.");
      }
    }

    // Add event listener for form submission
    addBookForm.addEventListener("submit", submitBook);

    // Redirect user to home page on button click
  } else {
    // If the user is not authenticated, redirect to the sign-in page
    window.location.href = "register.html";
  }
});

// Update the header dynamically
document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("headerContainer");
  // Call updateHeader function to update the header
  onAuthStateChanged(auth, (user) => {
    headerContainer.innerHTML = updateHeader(user);
  });
});

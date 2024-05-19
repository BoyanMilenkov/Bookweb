import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
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

const genreToCollection = {
  Thriller: "Thriller",
  "Science Fiction": "ScienceFiction",
  Adventure: "Adventure",
  Fantasy: "Fantasy",
  Horror: "Horror",
  "Memoir and Biography": "MemoirAndBiography",
  Historical: "Historical",
  Romance: "Romance",
  Dystopian: "Dystopia",
};

function capitalizeGenre(genre) {
  // Capitalize the first letter and make the rest lowercase
  return genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
}

async function bookExistsInAnyGenre(author, title) {
  for (const collectionName of Object.values(genreToCollection)) {
    const q = query(
      collection(db, collectionName),
      where("author", "==", author),
      where("title", "==", title)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return true;
    }
  }
  return false;
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is authenticated, proceed with book submission functionality
    const addBookForm = document.getElementById("addBookForm");

    if (!addBookForm) {
      console.error("addBookForm element not found.");
      return;
    }

    // Function to submit the book to Firestore
    async function submitBook(event) {
      event.preventDefault();

      // Get form values
      const author = document.getElementById("author").value;
      const title = document.getElementById("title").value;
      let genre = document.getElementById("genre").value;
      const description = document.getElementById("description").value;

      console.log(
        "Form values - Author:",
        author,
        "Title:",
        title,
        "Genre:",
        genre,
        "Description:",
        description
      ); // Debugging statement

      // Normalize the genre input
      genre = capitalizeGenre(genre);

      console.log("Normalized genre:", genre); // Debugging statement

      // Check if the book already exists in any genre
      const exists = await bookExistsInAnyGenre(author, title);
      if (exists) {
        alert("This book already exists in the collection.");
        return;
      }

      // Check if the selected genre has a corresponding collection
      if (genreToCollection.hasOwnProperty(genre)) {
        try {
          // Add a new document with a generated ID to the corresponding collection
          const docRef = await addDoc(
            collection(db, genreToCollection[genre]),
            {
              author: author,
              title: title,
              genre: genre,
              description: description,
            }
          );
          console.log("Document written with ID: ", docRef.id); // Debugging statement

          alert("Book added successfully!");
        } catch (error) {
          console.error("Error adding document: ", error);
          alert("Error adding document. Please try again later.");
        }
      } else {
        // Display an error message if the selected genre does not have a corresponding collection
        console.log("Available genres:", Object.keys(genreToCollection)); // Debugging statement
        alert("No collection found for the selected genre.");
      }
    }

    // Add event listener for form submission
    addBookForm.addEventListener("submit", submitBook);
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

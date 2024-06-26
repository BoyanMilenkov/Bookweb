import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { updateHeader } from "./header.js"; // Import the updateHeader function from header.js

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
initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore();
const auth = getAuth();

// Function to fetch and display horror books
async function displayHorrorBooks() {
  const booksContainer = document.getElementById("books-container");

  // Clear previous content
  booksContainer.innerHTML = "";

  try {
    // Reference to the "Horror" collection in Firestore
    const horrorCollection = collection(db, "Horror");

    // Get all documents in the "Horror" collection
    const querySnapshot = await getDocs(horrorCollection);

    querySnapshot.forEach((doc) => {
      const bookData = doc.data();
      const bookElement = createBookElement(bookData);
      booksContainer.appendChild(bookElement);
    });
  } catch (error) {
    console.error("Error getting horror books: ", error);
  }
}

// Function to create HTML element for a book
function createBookElement(bookData) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("book");
  bookElement.innerHTML = `
        <h3>${bookData.title}</h3>
        <p>Author: ${bookData.author}</p>
        <p>Description: ${bookData.description}</p>
        <button class="addBookButton">Add</button>
    `;

  // Check if the book is already in the user's collection
  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef)
      .then((userDocSnapshot) => {
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (
            userData.books &&
            userData.books.some((userBook) => userBook.title === bookData.title)
          ) {
            // Book already exists in user's collection, disable the button
            const addButton = bookElement.querySelector(".addBookButton");
            addButton.disabled = true;
            addButton.textContent = "Added";
          } else {
            // Book doesn't exist in user's collection, add event listener to button
            bookElement
              .querySelector(".addBookButton")
              .addEventListener("click", () => {
                addBookToFirestore(bookData);
              });
          }
        }
      })
      .catch((error) => {
        console.error("Error checking user's book collection:", error);
      });
  }

  return bookElement;
}

// Function to add a book to the user's collection in Firestore
async function addBookToFirestore(bookData) {
  const user = auth.currentUser;
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        books: arrayUnion(bookData),
      });
      console.log("Book added to Firestore!");
    } catch (error) {
      console.error("Error adding book to Firestore:", error);
    }
  } else {
    console.log("User is not logged in");
  }
}

// Function to filter books based on search query
function filterBooks(query) {
  const books = document.querySelectorAll(".book");
  books.forEach((book) => {
    const title = book.querySelector("h3").textContent.toLowerCase();
    if (title.includes(query.toLowerCase())) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}

// Event listener for the search input field
document.getElementById("searchInput").addEventListener("input", (event) => {
  const searchQuery = event.target.value.trim();
  filterBooks(searchQuery);
});

// Call the function to display horror books when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  // Display horror books
  await displayHorrorBooks();

  // Check if user is logged in and update header accordingly
  onAuthStateChanged(auth, (user) => {
    const headerContainer = document.getElementById("headerContainer");
    headerContainer.innerHTML = updateHeader(user); // Update header content based on user authentication status
  });
});

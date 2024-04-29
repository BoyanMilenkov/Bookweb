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
import { updateHeader } from "./header.js"; // Import updateHeader function

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

const db = getFirestore();
const auth = getAuth();

async function displayDystopianBooks() {
  const booksContainer = document.getElementById("books-container");
  booksContainer.innerHTML = "";

  try {
    const dystopianCollection = collection(db, "Dystopian");
    const querySnapshot = await getDocs(dystopianCollection);

    querySnapshot.forEach((doc) => {
      const bookData = doc.data();
      const bookElement = createBookElement(bookData);
      booksContainer.appendChild(bookElement);
    });
  } catch (error) {
    console.error("Error getting dystopian books: ", error);
  }
}

function createBookElement(bookData) {
  const bookElement = document.createElement("div");
  bookElement.classList.add("book");
  bookElement.innerHTML = `
        <h3>${bookData.title}</h3>
        <p>Author: ${bookData.author}</p>
        <p>Description: ${bookData.description}</p>
        <button class="addBookButton">Add</button>
    `;

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
            const addButton = bookElement.querySelector(".addBookButton");
            addButton.disabled = true;
            addButton.textContent = "Added";
          } else {
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

document.getElementById("searchInput").addEventListener("input", (event) => {
  const searchQuery = event.target.value.trim();
  filterBooks(searchQuery);
});

/*document.getElementById("returnHomeButton").addEventListener("click", () => {
  window.location.href = "start.html";
});*/

document.addEventListener("DOMContentLoaded", async () => {
  await displayDystopianBooks();

  onAuthStateChanged(auth, (user) => {
    const headerContainer = document.getElementById("headerContainer");
    headerContainer.innerHTML = updateHeader(user);
  });
});

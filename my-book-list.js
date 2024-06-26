import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { updateHeader } from "./header.js"; // Import the updateHeader function from header.js

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

// Function to authenticate users
function authenticateUser() {
  const user = auth.currentUser;
  if (!user) {
    console.log("User is not logged in");
    window.location.href = "login.html"; // Redirect to login page
  }
}

// Function to display the book information in the list
async function displayBookInfo() {
  const bookListContainer = document.getElementById("my-book-list-container");
  const user = auth.currentUser;
  if (user) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData.books && userData.books.length > 0) {
          userData.books.forEach(async (bookData) => {
            const bookElement = document.createElement("div");
            bookElement.classList.add("book");
            const description = bookData.description.split(" ");
            const descriptionDisplay =
              description.length > 20
                ? `${description
                    .slice(0, 20)
                    .join(" ")} ... <span class="read-more">Read more</span>`
                : bookData.description;
            bookElement.innerHTML = `
                            <h3>${bookData.title}</h3>
                            <p>Author: ${bookData.author}</p>
                            <p>Description: ${descriptionDisplay}</p>
                            <p>Rating: <span class="ratingDisplay">${
                              bookData.rating !== null
                                ? bookData.rating
                                : "Not rated"
                            }</span></p>
                            <button class="rateButton">Rate</button>
                            <input type="number" class="newRatingInput" placeholder="Enter new rating (1-5)" style="display: none;">
                            <button class="submitRatingButton" style="display: none;">Submit Rating</button>
                        `;
            bookListContainer.appendChild(bookElement);

            // Add event listener for rate button
            const rateButton = bookElement.querySelector(".rateButton");
            const newRatingInput = bookElement.querySelector(".newRatingInput");
            const submitRatingButton = bookElement.querySelector(
              ".submitRatingButton"
            );
            rateButton.addEventListener("click", () => {
              rateButton.style.display = "none";
              newRatingInput.style.display = "inline-block";
              submitRatingButton.style.display = "inline-block";
            });

            // Add event listener for submit rating button
            submitRatingButton.addEventListener("click", async () => {
              const newRating = parseInt(newRatingInput.value);
              if (!isNaN(newRating) && newRating >= 1 && newRating <= 5) {
                try {
                  const updatedBooks = userData.books.map((book) => {
                    if (
                      book.title === bookData.title &&
                      book.author === bookData.author
                    ) {
                      return { ...book, rating: newRating };
                    }
                    return book;
                  });
                  await updateDoc(userDocRef, { books: updatedBooks });
                  const ratingDisplay =
                    bookElement.querySelector(".ratingDisplay");
                  ratingDisplay.textContent = newRating;
                  newRatingInput.style.display = "none";
                  submitRatingButton.style.display = "none";
                  rateButton.style.display = "inline-block";
                } catch (error) {
                  console.error("Error updating rating:", error);
                }
              } else {
                alert("Please enter a valid rating between 1 and 5.");
              }
            });

            // Add event listener for "Read more" option
            const readMoreButton = bookElement.querySelector(".read-more");
            if (readMoreButton) {
              readMoreButton.addEventListener("click", () => {
                const descriptionDisplay = description.join(" ");
                bookElement.querySelector(
                  "p:nth-child(3)"
                ).innerHTML = `Description: ${descriptionDisplay}`;
              });
            }
          });
        } else {
          bookListContainer.innerHTML = "<p>No books added yet.</p>";
        }
      } else {
        console.log("User document not found");
      }
    } catch (error) {
      console.error("Error retrieving user's book data:", error);
    }
  } else {
    console.log("User is not logged in");
  }
}

// Function to filter and display books based on search query
function filterBooks(searchQuery) {
  const books = document.querySelectorAll(".book");
  books.forEach((book) => {
    const title = book.querySelector("h3").textContent.toLowerCase();
    const author = book
      .querySelector("p:nth-of-type(2)")
      .textContent.toLowerCase();
    if (title.includes(searchQuery) || author.includes(searchQuery)) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
}

// Check for authentication state change
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is logged in");
    // Call the function to display book info if the user is logged in
    displayBookInfo();
    // Update header content based on user authentication status
    const headerContainer = document.getElementById("headerContainer");
    headerContainer.innerHTML = updateHeader(user);
  }
});

// Event listener for search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const searchQuery = searchInput.value.toLowerCase();
  filterBooks(searchQuery);
});

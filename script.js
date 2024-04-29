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

function insertHeader() {
  const headerContainer = document.getElementById("headerContainer");
  headerContainer.innerHTML = updateHeader();
}

function onStart() {
  insertHeader();
}

onStart();

async function fetchFantasyBooks() {
  const firestore = getFirestore();
  const fantasyBooksContainer = document.querySelector(".fantasyBook");
  fantasyBooksContainer.innerHTML = ""; // Clear previous books

  // Query Firestore for fantasy books
  const querySnapshot = await getDocs(collection(firestore, "Fantasy"));

  let count = 0; // Counter to keep track of the number of books added

  querySnapshot.forEach((doc) => {
    if (count < 2) {
      // Only add two books
      const bookData = doc.data();
      const bookHTML = `
        <div class="book">
          <h3>${bookData.title}</h3>
          <p><strong>Author:</strong> ${bookData.author}</p>
          <p><strong>Genre:</strong> ${bookData.genre}</p>
          <p class="description">${bookData.description}</p>
          <button class="read-less" style="display: none;">Read Less</button>
        </div>
      `;
      fantasyBooksContainer.insertAdjacentHTML("beforeend", bookHTML);
      count++; // Increment the counter after adding a book
    } else {
      return; // Stop iterating once two books are added
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

async function fetchScienceFictionBooks() {
  const firestore = getFirestore();
  const scienceFictionBooksContainer = document.querySelector(
    ".scienceFictionBook"
  );
  scienceFictionBooksContainer.innerHTML = ""; // Clear previous books

  // Query Firestore for science fiction books
  const querySnapshot = await getDocs(collection(firestore, "ScienceFiction"));

  let count = 0; // Counter to keep track of the number of books added

  querySnapshot.forEach((doc) => {
    if (count < 2) {
      // Only add two books
      const bookData = doc.data();
      const bookHTML = `
        <div class="book">
          <h3>${bookData.title}</h3>
          <p><strong>Author:</strong> ${bookData.author}</p>
          <p><strong>Genre:</strong> ${bookData.genre}</p>
          <p class="description">${bookData.description}</p>
          <button class="read-less" style="display: none;">Read Less</button>
        </div>
      `;
      scienceFictionBooksContainer.insertAdjacentHTML("beforeend", bookHTML);
      count++; // Increment the counter after adding a book
    } else {
      return; // Stop iterating once two books are added
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

async function fetchRomanceBooks() {
  const firestore = getFirestore();
  const romanceBooksContainer = document.querySelector(".romanceBook");
  romanceBooksContainer.innerHTML = ""; // Clear previous books

  // Query Firestore for romance books
  const querySnapshot = await getDocs(collection(firestore, "Romance"));

  let count = 0; // Counter to keep track of the number of books added

  querySnapshot.forEach((doc) => {
    if (count < 2) {
      // Only add two books
      const bookData = doc.data();
      const bookHTML = `
        <div class="book">
          <h3>${bookData.title}</h3>
          <p><strong>Author:</strong> ${bookData.author}</p>
          <p><strong>Genre:</strong> ${bookData.genre}</p>
          <p class="description">${bookData.description}</p>
          <button class="read-less" style="display: none;">Read Less</button>
        </div>
      `;
      romanceBooksContainer.insertAdjacentHTML("beforeend", bookHTML);
      count++; // Increment the counter after adding a book
    } else {
      return; // Stop iterating once two books are added
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

async function fetchHorrorBooks() {
  const firestore = getFirestore();
  const horrorBooksContainer = document.querySelector(".horrorBook");
  horrorBooksContainer.innerHTML = ""; // Clear previous books

  // Query Firestore for horror books
  const querySnapshot = await getDocs(collection(firestore, "Horror"));

  let count = 0; // Counter to keep track of the number of books added

  querySnapshot.forEach((doc) => {
    if (count < 2) {
      // Only add two books
      const bookData = doc.data();
      const bookHTML = `
        <div class="book">
          <h3>${bookData.title}</h3>
          <p><strong>Author:</strong> ${bookData.author}</p>
          <p><strong>Genre:</strong> ${bookData.genre}</p>
          <p class="description">${bookData.description}</p>
          <button class="read-less" style="display: none;">Read Less</button>
        </div>
      `;
      horrorBooksContainer.insertAdjacentHTML("beforeend", bookHTML);
      count++; // Increment the counter after adding a book
    } else {
      return; // Stop iterating once two books are added
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

async function fetchThrillerBooks() {
  const firestore = getFirestore();
  const thrillerBooksContainer = document.querySelector(".thrillerBook");
  thrillerBooksContainer.innerHTML = ""; // Clear previous books

  // Query Firestore for thriller books
  const querySnapshot = await getDocs(collection(firestore, "Thriller"));

  let count = 0; // Counter to keep track of the number of books added

  querySnapshot.forEach((doc) => {
    if (count < 2) {
      // Only add two books
      const bookData = doc.data();
      const bookHTML = `
        <div class="book">
          <h3>${bookData.title}</h3>
          <p><strong>Author:</strong> ${bookData.author}</p>
          <p><strong>Genre:</strong> ${bookData.genre}</p>
          <p class="description">${bookData.description}</p>
          <button class="read-less" style="display: none;">Read Less</button>
        </div>
      `;
      thrillerBooksContainer.insertAdjacentHTML("beforeend", bookHTML);
      count++; // Increment the counter after adding a book
    } else {
      return; // Stop iterating once two books are added
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

async function fetchAdventureBooks() {
  const firestore = getFirestore();
  const adventureBooksContainer = document.querySelector(".adventureBook");
  adventureBooksContainer.innerHTML = ""; // Clear previous books

  // Query Firestore for adventure books
  const querySnapshot = await getDocs(collection(firestore, "Adventure"));

  let count = 0; // Counter to keep track of the number of books added

  querySnapshot.forEach((doc) => {
    if (count < 2) {
      // Only add two books
      const bookData = doc.data();
      const bookHTML = `
        <div class="book">
          <h3>${bookData.title}</h3>
          <p><strong>Author:</strong> ${bookData.author}</p>
          <p><strong>Genre:</strong> ${bookData.genre}</p>
          <p class="description">${bookData.description}</p>
          <button class="read-less" style="display: none;">Read Less</button>
        </div>
      `;
      adventureBooksContainer.insertAdjacentHTML("beforeend", bookHTML);
      count++; // Increment the counter after adding a book
    } else {
      return; // Stop iterating once two books are added
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

async function fetchDystopianBooks() {
  const firestore = getFirestore();
  const dystopianBooksContainer = document.querySelector(".dystopianBook");
  dystopianBooksContainer.innerHTML = ""; // Clear previous books

  // Query Firestore for dystopian books
  const querySnapshot = await getDocs(collection(firestore, "Dystopian"));

  let count = 0; // Counter to keep track of the number of books added

  querySnapshot.forEach((doc) => {
    if (count < 2) {
      // Only add two books
      const bookData = doc.data();
      const bookHTML = `
        <div class="book">
          <h3>${bookData.title}</h3>
          <p><strong>Author:</strong> ${bookData.author}</p>
          <p><strong>Genre:</strong> ${bookData.genre}</p>
          <p class="description">${bookData.description}</p>
          <button class="read-less" style="display: none;">Read Less</button>
        </div>
      `;
      dystopianBooksContainer.insertAdjacentHTML("beforeend", bookHTML);
      count++; // Increment the counter after adding a book
    } else {
      return; // Stop iterating once two books are added
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

async function fetchHistoricalBooks() {
  const firestore = getFirestore();
  const historicalBooksContainer = document.querySelector(".historicalBook");
  historicalBooksContainer.innerHTML = ""; // Clear previous books

  // Query Firestore for historical books
  const querySnapshot = await getDocs(collection(firestore, "Historical"));

  let count = 0; // Counter to keep track of the number of books added

  querySnapshot.forEach((doc) => {
    if (count < 2) {
      // Only add two books
      const bookData = doc.data();
      const bookHTML = `
        <div class="book">
          <h3>${bookData.title}</h3>
          <p><strong>Author:</strong> ${bookData.author}</p>
          <p><strong>Genre:</strong> ${bookData.genre}</p>
          <p class="description">${bookData.description}</p>
          <button class="read-less" style="display: none;">Read Less</button>
        </div>
      `;
      historicalBooksContainer.insertAdjacentHTML("beforeend", bookHTML);
      count++; // Increment the counter after adding a book
    } else {
      return; // Stop iterating once two books are added
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

async function fetchMemoirAndBiographyBooks() {
  const firestore = getFirestore();
  const memoirAndBiographyBooksContainer = document.querySelector(
    ".memoirAndBiographyBook"
  );
  memoirAndBiographyBooksContainer.innerHTML = ""; // Clear previous books

  // Query Firestore for memoir and biography books
  const querySnapshot = await getDocs(
    collection(firestore, "Memoir and Biography")
  );

  let count = 0; // Counter to keep track of the number of books added

  querySnapshot.forEach((doc) => {
    if (count < 2) {
      // Only add two books
      const bookData = doc.data();
      const bookHTML = `
        <div class="book">
          <h3>${bookData.title}</h3>
          <p><strong>Author:</strong> ${bookData.author}</p>
          <p><strong>Genre:</strong> ${bookData.genre}</p>
          <p class="description">${bookData.description}</p>
          <button class="read-less" style="display: none;">Read Less</button>
        </div>
      `;
      memoirAndBiographyBooksContainer.insertAdjacentHTML(
        "beforeend",
        bookHTML
      );
      count++; // Increment the counter after adding a book
    } else {
      return; // Stop iterating once two books are added
    }
  });

  // Add event listeners for "Read More" and "Read Less"
  addReadMoreAndLessFunctionality();
}

// Function to add "Read More" and "Read Less" functionality to each book
function addReadMoreAndLessFunctionality() {
  const books = document.querySelectorAll(".book");

  books.forEach((book) => {
    // Check if "Read More" functionality has already been added to this book
    if (book.classList.contains("read-more-added")) {
      return; // If already added, skip this book
    }

    const description = book.querySelector(".description");
    const readMoreBtn = document.createElement("span");
    readMoreBtn.classList.add("read-more");
    readMoreBtn.textContent = "Read More";
    const readLessBtn = document.createElement("span");
    readLessBtn.classList.add("read-less");
    readLessBtn.textContent = "Read Less";
    readLessBtn.style.display = "none"; // Initially hide "Read Less" button

    // Initial state: show only the first few lines of the description
    const shortText = description.innerText.substring(0, 100);
    const longText = description.innerText;

    description.innerHTML = shortText;
    book.appendChild(readMoreBtn);
    book.appendChild(readLessBtn);

    // Toggle between showing full and truncated description
    readMoreBtn.addEventListener("click", function () {
      description.innerHTML = longText;
      readMoreBtn.style.display = "none";
      readLessBtn.style.display = "inline"; // Show "Read Less" button
    });

    readLessBtn.addEventListener("click", function () {
      description.innerHTML = shortText;
      readMoreBtn.style.display = "inline"; // Show "Read More" button
      readLessBtn.style.display = "none";
    });

    // Add a class to mark that "Read More" functionality has been added to this book
    book.classList.add("read-more-added");
  });
}

// Call the function to add functionality
addReadMoreAndLessFunctionality();

// Fetch books for each genre on page load
fetchFantasyBooks();
fetchScienceFictionBooks();
fetchRomanceBooks();
fetchHorrorBooks();
fetchThrillerBooks();
fetchAdventureBooks();
fetchDystopianBooks();
fetchHistoricalBooks();
fetchMemoirAndBiographyBooks();

// Update links when auth state changes
getAuth().onAuthStateChanged(function (user) {
  if (user) {
    insertHeader();
    //fetchPosts();
  } else {
    console.error("User not authenticated.");
    // Handle user not authenticated, e.g., redirect to login page
  }
});

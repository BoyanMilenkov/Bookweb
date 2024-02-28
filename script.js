import { app } from './firebase';  
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

document.addEventListener('DOMContentLoaded', () => {
  const booksContainer = document.getElementById('books-container');
  const addBookForm = document.getElementById('add-book-form');
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  const ratingSelect = document.getElementById('rating');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const registerForm = document.getElementById('register-form');

  let books = [];

  
  

  const profileElement = document.createElement('div');
  profileElement.classList.add('profile');
  profileElement.innerHTML = `
    <h2>User Profile</h2>
    <p><strong>Name:</strong> ${userProfile.name}</p>
    <p><strong>Email:</strong> ${userProfile.email}</p>
    <p><strong>Favorite Book:</strong> ${userProfile.favoriteBook}</p>
  `;
  booksContainer.appendChild(profileElement);

  function displayBooks() {
    booksContainer.innerHTML = '';
    books.forEach((book) => {
      const bookElement = document.createElement('div');
      bookElement.classList.add('book');
      bookElement.innerHTML = `
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <span>⭐</span>
        <strong>${book.rating}</strong>
      `;
      booksContainer.appendChild(bookElement);
    });
  }

  function registerUser(event) {
    event.preventDefault();

    const nameInputValue = document.getElementById('name').value;
    const emailInputValue = emailInput.value;
    const passwordInputValue = passwordInput.value;

    if (!nameInputValue || !emailInputValue || !passwordInputValue) {
      alert('Please fill in all fields');
      return;
    }

    // Use the auth() method from the Firebase app instance
    app.auth().createUserWithEmailAndPassword(emailInputValue, passwordInputValue)
      .then((userCredential) => {
        alert('Registration successful!');
        window.location.href = `profile.html?name=${encodeURIComponent(nameInputValue)}&email=${encodeURIComponent(emailInputValue)}`;
      })
      .catch((error) => {
        alert(`Registration failed: ${error.message}`);
      });
  }

  registerForm.addEventListener('submit', registerUser);

  displayBooks();
});

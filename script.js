document.addEventListener('DOMContentLoaded', () => {
  const booksContainer = document.getElementById('books-container');
  const addBookForm = document.getElementById('add-book-form');
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  const ratingSelect = document.getElementById('rating');

  let books = [];

  // Add user profile information
  const userProfile = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    favoriteBook: 'To Kill a Mockingbird',
  };

  // Display user profile information
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
  
    // Get user input from the registration form
    const nameInput = document.getElementById('name').value;
    const emailInput = document.getElementById('email').value;
    const passwordInput = document.getElementById('password').value;
  
    // Validate user input (you can add more validation as needed)
    if (!nameInput || !emailInput || !passwordInput) {
      alert('Please fill in all fields');
      return;
    }
  
    // Simulate a successful registration (replace with your actual registration logic)
    alert('Registration successful!');
  
    // Redirect to the profile page with user data as query parameters
    window.location.href = `profile.html?name=${encodeURIComponent(nameInput)}&email=${encodeURIComponent(emailInput)}`;
  }

  addBookForm.addEventListener('submit', registerUser);

  displayBooks();
});

document.addEventListener('DOMContentLoaded', () => {
  // ...

  // Retrieve user data from query parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const name = urlParams.get('name');
  const email = urlParams.get('email');

  // Display user data
  const nameElement = document.getElementById('name');
  const emailElement = document.getElementById('email');
  nameElement.textContent = name || userProfile.name;
  emailElement.textContent = email || userProfile.email;

  // ...
});

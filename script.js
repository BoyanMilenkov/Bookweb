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
  
    addBookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newBook = {
        title: titleInput.value,
        author: authorInput.value,
        rating: ratingSelect.value,
      };
      books.push(newBook);
      titleInput.value = '';
      authorInput.value = '';
      ratingSelect.value = '1';
      displayBooks();
    });
  
    displayBooks();
  });
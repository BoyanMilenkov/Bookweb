document.addEventListener('DOMContentLoaded', () => { const booksContainer = document.getElementById('books-container'); const addBookForm = document.getElementById('add-book-form'); const titleInput = document.getElementById('title'); const authorInput = document.getElementById('author'); const ratingSelect = document.getElementById('rating');

let books = [];

function displayBooks() { booksContainer.innerHTML = ''; books.forEach((book) => { const bookElement = document.createElement('div'); bookElement.classList.add('book'); bookElement.innerHTML = `

<h3>${book.title}</h3> <p>${book.author}</p> <span>⭐</span> <strong>${book.rating}</strong> `; booksContainer.appendChild(bookElement); }); }
addBookForm.addEventListener('submit', (e) => { e.preventDefault(); const newBook = { title: titleInput.value, author: authorInput.value, rating: ratingSelect.value, }; books.push(newBook); titleInput.value = ''; authorInput.value = ''; ratingSelect.value = '1'; displayBooks(); });

displayBooks(); });
// admin_page.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDSVB_m--vKWpFjpa1PSyZoF7slhTdGN08",
    authDomain: "bookweb-99ef4.firebaseapp.com",
    databaseURL: "https://bookweb-99ef4-default-rtdb.firebaseio.com",
    projectId: "bookweb-99ef4",
    storageBucket: "bookweb-99ef4.appspot.com",
    messagingSenderId: "415676602525",
    appId: "1:415676602525:web:5ed67a9357cc9e3b88dc74",
    measurementId: "G-VDFL9E4XYJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Store collections globally
const collections = ["Adventure", "Dystopian", "Fantasy", "Historical", "Horror", "Memoir and Biography", "Romance", "ScienceFiction", "Thriller"];

async function populateGenreTables(genreFilter) {
    const genreTableContainer = document.getElementById('genres-table-container');
    genreTableContainer.innerHTML = ''; // Clear the genre tables container

    for (const genre of collections) {
        const genreTable = document.createElement('table');
        genreTable.innerHTML = `<h3>${genre}</h3>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="${genre.toLowerCase()}-table-body">
                                    <!-- Books will be dynamically added here -->
                                </tbody>`;
        
        if (genreFilter === 'all' || genre.toLowerCase() === genreFilter) {
            genreTableContainer.appendChild(genreTable);

            const genreTableBody = document.getElementById(`${genre.toLowerCase()}-table-body`);
            try {
                const booksRef = collection(db, genre);
                const querySnapshot = await getDocs(booksRef);

                if (querySnapshot.empty) {
                    console.log(`No books found for ${genre} genre`);
                } else {
                    querySnapshot.forEach(doc => {
                        const bookData = doc.data();
                        const row = `<tr>
                                        <td class="title" data-id="${doc.id}" data-genre="${genre}">${bookData.title}</td>
                                        <td class="author" data-id="${doc.id}" data-genre="${genre}">${bookData.author}</td>
                                        <td><div class="description">${bookData.description}</div></td>
                                        <td><button class="edit-btn" data-id="${doc.id}" data-genre="${genre}">Edit</button></td>
                                    </tr>`;
                        genreTableBody.innerHTML += row;
                    });
                }
            } catch (error) {
                console.error(`Error fetching books for ${genre} genre:`, error);
            }
        }
    }

    // Add event listener for edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const bookId = event.target.dataset.id;
            const genre = event.target.dataset.genre;
            const titleCell = document.querySelector(`.title[data-id="${bookId}"][data-genre="${genre}"]`);
            const authorCell = document.querySelector(`.author[data-id="${bookId}"][data-genre="${genre}"]`);
            const descriptionDiv = event.target.parentNode.previousElementSibling.querySelector('.description');
            const bookRef = doc(db, genre, bookId);
            const bookDoc = await getDoc(bookRef);
            if (bookDoc.exists()) {
                const bookData = bookDoc.data();
                const titleInput = document.createElement('input');
                titleInput.value = bookData.title;
                titleInput.classList.add('edit-title');
                titleCell.innerHTML = '';
                titleCell.appendChild(titleInput);

                const authorInput = document.createElement('input');
                authorInput.value = bookData.author;
                authorInput.classList.add('edit-author');
                authorCell.innerHTML = '';
                authorCell.appendChild(authorInput);

                const descriptionTextarea = document.createElement('textarea');
                descriptionTextarea.value = bookData.description;
                descriptionTextarea.classList.add('edit-description');
                descriptionDiv.innerHTML = '';
                descriptionDiv.appendChild(descriptionTextarea);

                // Change button text and functionality
                button.innerText = 'Save';
                button.classList.remove('edit-btn');
                button.classList.add('save-btn');

                // Add event listener for save button
                button.addEventListener('click', async () => {
                    const newTitle = titleInput.value;
                    const newAuthor = authorInput.value;
                    const newDescription = descriptionTextarea.value;
                    try {
                        await updateDoc(bookRef, { title: newTitle, author: newAuthor, description: newDescription });
                        // Update UI
                        populateGenreTables(genreFilter);
                    } catch (error) {
                        console.error("Error updating book details:", error);
                    }
                });
            } else {
                console.error("No such document!");
            }
        });
    });
}

async function populateUsersTable() {
    const usersTableBody = document.getElementById('users-table-body');

    try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);

        if (querySnapshot.empty) {
            console.log('No users found');
        } else {
            querySnapshot.forEach(doc => {
                const userData = doc.data();
                const row = `<tr>
                                <td>${userData.email}</td>
                                <td>${userData.name}</td>

                            </tr>`;
                usersTableBody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

document.getElementById('genre-filter').addEventListener('change', function() {
    const selectedGenre = this.value;
    populateGenreTables(selectedGenre);
});

populateGenreTables('all');
populateUsersTable();

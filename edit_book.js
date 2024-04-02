import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Function to get the correct collection name
// Function to get the correct collection name
function getCollectionName(bookId) {
    // Extract the first character of the bookId (assuming it represents the genre)
    const firstCharacter = bookId.charAt(0).toUpperCase();

    // Define mapping of first character to collection name
    const genreMap = {
        "A": "Adventure",
        "M": "Memoir and Biography",
        "T": "Thriller",
        "S": "Science Fiction",
        "R": "Romance",
        "D": "Dystopian",
        "F": "Fantasy",
        "H": "Historical",
        "O": "Horror"
    };

    // Check if the first character corresponds to a known genre
    if (firstCharacter in genreMap) {
        return genreMap[firstCharacter];
    } else {
        // Default to a fallback genre (e.g., "Other" or any other default collection name)
        return "Other";
    }
}


// Get the book ID from the URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

// Get the collection name for the given bookId
const collectionName = getCollectionName(bookId);

// Get a reference to the book document
const bookRef = doc(db, collectionName, bookId);

// Get the description textarea element
const descriptionTextarea = document.getElementById('description');

// Populate the form with existing description
async function populateForm() {
    try {
        console.log('Fetching document with ID:', bookId, 'from collection:', collectionName);
        const bookSnapshot = await getDoc(bookRef);
        console.log('Document snapshot:', bookSnapshot);
        if (bookSnapshot.exists()) {
            const bookData = bookSnapshot.data();
            descriptionTextarea.value = bookData.description;
        } else {
            console.error('No such document!');
        }
    } catch (error) {
        console.error('Error getting document:', error);
    }
}

// Update the description in Firestore
async function updateDescription(description) {
    try {
        await updateDoc(bookRef, {
            description: description
        });
        console.log('Document successfully updated!');
    } catch (error) {
        console.error('Error updating document:', error);
    }
}

// Populate the form with existing description
populateForm();

// Add event listener to the form for updating description
document.getElementById('edit-book-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const newDescription = descriptionTextarea.value;
    updateDescription(newDescription);
});

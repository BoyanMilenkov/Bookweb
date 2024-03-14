// Import necessary Firebase modules
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Function to submit the post
async function submitPost(event) {
    event.preventDefault();

    // Get form values
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;
    const genre = document.getElementById('genre').value; // New: Get selected genre

    // Check if author and title are provided
    if (!author || !title) {
        alert("Please provide both author and title!");
        return;
    }

    // Check if the book already exists in Firestore
    const firestore = getFirestore();
    const booksRef = collection(firestore, 'books');
    const q = query(booksRef, where('author', '==', author), where('title', '==', title));
    const querySnapshot = await getDocs(q);

    // If the book already exists in Firestore, prompt the user to check the information
    if (!querySnapshot.empty) {
        alert("This book already exists in the database. Please verify the information provided.");
        return;
    }

    // Create a new document in the 'books' collection
    try {
        await addDoc(collection(firestore, "books"), {
            author: author,
            title: title,
            genre: genre,
            rating: rating,
            review: review
        });
        alert("Post added successfully!");
        window.location.href = 'start.html'; // Redirect to start page after successful submission
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error adding document. Please try again later.");
    }
}

// Event listener for form submission
document.querySelector('form').addEventListener('submit', submitPost);

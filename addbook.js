import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
        
        // Initialize Firebase with your configuration
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


        // Access Firestore database
        const db = getFirestore(app);

        // Function to submit the book to Firestore
        // Function to submit the book to Firestore
async function submitBook(event) {
    event.preventDefault();

    // Get form values
    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const genre = document.getElementById('genre').value;
    const description = document.getElementById('description').value;

    // Define a mapping of genres to collection names
    const genreToCollection = {
        "thriller": "Thriller",
        "fantasy": "Fantasy",
        "horror": "Horror",
        "historical": "Historical",
        "adventure": "Adventure",
        "romance": "Romance",
        "science-fiction": "ScienceFiction",
        "memoir-and-biography": "Memoir and Biography",
        "dystopian": "Dystopian"
        // Add more mappings for other genres if needed
    };

    // Check if the selected genre has a corresponding collection
    if (genreToCollection.hasOwnProperty(genre)) {
        try {
            // Add a new document with a generated ID to the corresponding collection
            await addDoc(collection(db, genreToCollection[genre]), {
                author: author,
                title: title,
                description: description
            });
            
            alert("Book added successfully!");
            // Optionally, redirect the user to another page or perform other actions
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error adding document. Please try again later.");
        }
    } else {
        // Display an error message if the selected genre does not have a corresponding collection
        alert("No collection found for the selected genre.");
    }
}



        // Add event listener for form submission
        document.getElementById('addBookForm').addEventListener('submit', submitBook);
        document.getElementById('returnHomeButton').addEventListener('click', () => {
            window.location.href = 'start.html';
        });
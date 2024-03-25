import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getFirestore, collection, doc, setDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
        import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
    
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
        const auth = getAuth();
    
        document.getElementById('returnHomeButton').addEventListener('click', () => {
            window.location.href = 'start.html';
        });
    
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
    
            try {
                // Check if name is available
                const nameAvailable = await isNameAvailable(name);
                if (!nameAvailable) {
                    alert('Name is already taken. Please choose another one.');
                    return;
                }
                
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
    
                // Store user data in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    name: name,
                    email: email,
                });
    
                alert('User created successfully!');
                window.location.href = "start.html";
            } catch (error) {
                console.error("Error during registration:", error.message);
                alert("Error creating user or saving data to the database.");
            }
        });

        // Function to check if name is available
        async function isNameAvailable(name) {
            // Get a reference to the users collection
            const usersRef = collection(db, 'users');

            try {
                // Query the users collection for the provided name
                const querySnapshot = await getDocs(query(usersRef, where('name', '==', name)));

                // If no documents are returned, it means the name is available
                if (querySnapshot.empty) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error("Error checking name availability:", error);
                return false;
            }
        }
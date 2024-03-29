import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getFirestore, doc, updateDoc, arrayUnion, getDoc, getDocs, query, where, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
        import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

        // Function to add a friend to the current user's list
        async function addFriendToCurrentUser(friendName) {
            console.log("Current user UID:", auth.currentUser.uid); // Debugging statement

            const currentUserUID = auth.currentUser.uid;
            const currentUserName = auth.currentUser.name;

            if (!currentUserUID) {
                console.error("Current user UID is not available.");
                return;
            }

            if (!friendName) {
                console.error("Invalid friend name");
                return;
            }

            if (friendName === currentUserName) {
                alert("You cannot befriend yourself.");
                return;
            }

            // Query the users collection to check if the friend name exists
            const usersRef = collection(db, 'users');
            const userQuery = query(usersRef, where('name', '==', friendName));
            const userSnapshot = await getDocs(userQuery);
            
            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0]; // Get the first document in the result set
                const userUID = userDoc.id; // Obtain the user UID from the document ID

                if (userUID === currentUserUID) {
                    alert("You cannot befriend yourself.");
                    return;
                }

                const userRef = doc(db, 'users', currentUserUID);

                try {
                    const userDoc = await getDoc(userRef);
                    const userData = userDoc.data();
                    const existingFriends = Array.isArray(userData.friends) ? userData.friends : [];
                    const existingFriend = existingFriends.find(friend => friend.name === friendName);
                    if (existingFriend) {
                        alert(`Friend ${friendName} already exists.`);
                        return;
                    }

                    // Update the current user's document with the new friend
                    await updateDoc(userRef, {
                        friends: arrayUnion({ name: friendName, uid: userUID })
                    });

                    alert(`Friend ${friendName} added successfully!`);
                    window.location.href = 'friends-list.html'; // Redirect to friends-list.html after adding friend
                } catch (error) {
                    console.error("Error adding friend:", error);
                }
            } else {
                alert(`User ${friendName} does not exist.`);
            }
        }

        // Event listener for the "Add Friend" button
        document.getElementById('addFriendButton').addEventListener('click', async () => {
            const friendName = document.getElementById('friendName').value.trim();

            // Add friend to the current user's list and store in Firestore
            await addFriendToCurrentUser(friendName);
        });

        // Event listener for the return to home button
        document.getElementById('returnHomeButton').addEventListener('click', () => {
            window.location.href = 'start.html';
        });
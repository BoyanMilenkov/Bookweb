import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  getDocs,
  query,
  where,
  collection,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { updateHeader } from "./header.js"; // Import the updateHeader function

const firebaseConfig = {
  apiKey: "AIzaSyDSVB_m--vKWpFjpa1PSyZoF7slhTdGN08",
  authDomain: "bookweb-99ef4.firebaseapp.com",
  databaseURL: "https://bookweb-99ef4-default-rtdb.firebaseio.com",
  projectId: "bookweb-99ef4",
  storageBucket: "bookweb-99ef4.appspot.com",
  messagingSenderId: "415676602525",
  appId: "1:415676602525:web:5ed67a9357cc9e3b88dc74",
  measurementId: "G-VDFL9E4XYJ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Function to send friend request
async function sendFriendRequest(friendName) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("User not logged in.");
      return;
    }

    const currentUserUID = currentUser.uid;
    const currentUserName = currentUser.displayName;

    if (!friendName) {
      console.error("Invalid friend name.");
      return;
    }

    if (friendName === currentUserName) {
      alert("You cannot send a friend request to yourself.");
      return;
    }

    const usersRef = collection(db, "users");

    // Query the users collection to get the friend's UID
    const userQuery = query(usersRef, where("name", "==", friendName));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const friendUserDoc = userSnapshot.docs[0]; // Get the first document in the result set
      const friendUID = friendUserDoc.id;

      // Add the friend request to the friend's document
      const friendDocRef = doc(db, "users", friendUID);
      await updateDoc(friendDocRef, {
        friendRequests: arrayUnion(currentUserUID), // Store the sender's UID in friendRequests array
      });

      alert(`Friend request sent to ${friendName} successfully!`);
      window.location.href = "friends-list.html"; // Redirect to friends-list.html after sending request
    } else {
      alert(`User ${friendName} does not exist.`);
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
}

// Event listener for the "Send Request" button
document
  .getElementById("sendRequestButton")
  .addEventListener("click", async () => {
    const friendName = document.getElementById("friendName").value.trim();

    // Send friend request
    await sendFriendRequest(friendName);
  });

// Update the header dynamically
document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("headerContainer");
  // Call updateHeader function to update the header
  onAuthStateChanged(auth, (user) => {
    headerContainer.innerHTML = updateHeader(user);
  });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  runTransaction,
  query,
  where,
  getDocs,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Function to render friends
async function renderFriends(currentUserUID) {
  const friendsListContainer = document.getElementById("friends-list");

  try {
    const userDoc = await getDoc(doc(db, "users", currentUserUID));
    if (userDoc.exists()) {
      const friends = userDoc.data().friends || [];
      friendsListContainer.innerHTML = "";
      if (friends.length > 0) {
        friends.forEach((friend, index) => {
          const listItem = document.createElement("li");
          const buttonContainer = document.createElement("div");
          listItem.textContent = friend.name;

          // Create delete button
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.classList.add("btn");
          deleteButton.classList.add("deleteBtn");
          deleteButton.addEventListener("click", async () => {
            await deleteFriend(currentUserUID, index);
            renderFriends(currentUserUID);
          });

          // Create chat button
          const chatButton = document.createElement("button");
          chatButton.textContent = "Chat";
          chatButton.classList.add("btn");
          chatButton.classList.add("chatBtn");
          chatButton.addEventListener("click", () => {
            startChat(currentUserUID, friend.name);
          });

          // Append buttons to list item
          buttonContainer.appendChild(deleteButton);
          buttonContainer.appendChild(chatButton);
          listItem.appendChild(buttonContainer);

          // Append list item to friends list container
          friendsListContainer.appendChild(listItem);
        });
      } else {
        friendsListContainer.innerHTML = "<li>No friends yet</li>";
      }
    } else {
      friendsListContainer.innerHTML = "<li>User not found</li>";
    }
  } catch (error) {
    console.error("Error fetching friends:", error);
    friendsListContainer.innerHTML = "<li>Error fetching friends</li>";
  }
}

// Function to render friend requests with sender names and buttons for accepting or declining
async function renderFriendRequests(currentUserUID) {
  const requestsListContainer = document.getElementById("requests-list");

  try {
    // Clear previous requests from the UI
    requestsListContainer.innerHTML = "";

    // Get the current user's document
    const currentUserDoc = await getDoc(doc(db, "users", currentUserUID));
    if (currentUserDoc.exists()) {
      const friendRequests = currentUserDoc.data().friendRequests || [];
      if (friendRequests.length > 0) {
        // Loop through each friend request
        for (const friendRequest of friendRequests) {
          const senderUID = friendRequest.senderUID;
          // Fetch sender's name based on their UID
          const senderDoc = await getDoc(doc(db, "users", senderUID));
          if (senderDoc.exists()) {
            const senderName = senderDoc.data().name;
            // Create list item with sender's name and buttons for accepting or declining
            const listItem = document.createElement("li");
            listItem.textContent = `${senderName} has sent you a friend request`;

            // Create accept button
            const acceptButton = document.createElement("button");
            acceptButton.textContent = "Accept";
            acceptButton.classList.add("btn");
            acceptButton.addEventListener("click", async () => {
              await handleFriendRequest(currentUserUID, senderUID, true);
              renderFriendRequests(currentUserUID); // Refresh friend requests after accepting
            });

            // Create decline button
            const declineButton = document.createElement("button");
            declineButton.textContent = "Decline";
            declineButton.classList.add("btn");
            declineButton.addEventListener("click", async () => {
              await handleFriendRequest(currentUserUID, senderUID, false);
              renderFriendRequests(currentUserUID); // Refresh friend requests after declining
            });

            // Append buttons to list item
            listItem.appendChild(acceptButton);
            listItem.appendChild(declineButton);

            // Append list item to requests list container
            requestsListContainer.appendChild(listItem);
          } else {
            console.error("Sender not found:", senderUID);
          }
        }
      } else {
        requestsListContainer.innerHTML = "<li>No friend requests</li>";
      }
    } else {
      requestsListContainer.innerHTML = "<li>User not found</li>";
    }
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    requestsListContainer.innerHTML = "<li>Error fetching friend requests</li>";
  }
}

// Function to handle accepting or declining friend requests
async function handleFriendRequest(currentUserUID, senderUID, accept) {
  try {
    const currentUserRef = doc(db, "users", currentUserUID);
    const senderRef = doc(db, "users", senderUID);

    await runTransaction(db, async (transaction) => {
      const currentUserDoc = await transaction.get(currentUserRef);
      const senderDoc = await transaction.get(senderRef);

      if (currentUserDoc.exists() && senderDoc.exists()) {
        const currentUserData = currentUserDoc.data();
        const senderData = senderDoc.data();

        // Remove sender's ID from friend requests
        const updatedFriendRequests = currentUserData.friendRequests.filter((request) => request.senderUID !== senderUID);

        if (accept) {
          // Add sender to current user's friends
          const updatedFriends = [...(currentUserData.friends || []), { name: senderData.name, uid: senderUID }];
          transaction.update(currentUserRef, { friends: updatedFriends });
          // Add current user to sender's friends
          const updatedSenderFriends = [...(senderData.friends || []), { name: currentUserData.name, uid: currentUserUID }];
          transaction.update(senderRef, { friends: updatedSenderFriends });
        }

        // Update current user's friend requests
        transaction.update(currentUserRef, { friendRequests: updatedFriendRequests });
      }
    });

    // If accepted, refresh the friends list and friend requests
    if (accept) {
      await Promise.all([
        renderFriends(currentUserUID),
        renderFriendRequests(currentUserUID)
      ]);
    }
  } catch (error) {
    console.error("Error handling friend request:", error);
  }
}

// Function to delete friend
async function deleteFriend(currentUserUID, friendIndex) {
  try {
    const userRef = doc(db, "users", currentUserUID);
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const friends = userDoc.data().friends;
      const updatedFriends = friends.filter(
        (friend, index) => index !== friendIndex
      );
      transaction.update(userRef, { friends: updatedFriends });
    });
  } catch (error) {
    console.error("Error deleting friend:", error);
  }
}

// Function to start chat with friend
async function startChat(currentUserUID, friendName) {
  try {
    const friendID = await getFriendID(currentUserUID, friendName);
    if (friendID) {
      // Navigate to chat page with necessary parameters
      window.location.href = `chat.html?currentUserUID=${currentUserUID}&friendID=${friendID}`;
    } else {
      console.error("Error starting chat: Friend ID not found");
    }
  } catch (error) {
    console.error("Error starting chat:", error);
  }
}

// Function to get friend ID
async function getFriendID(currentUserUID, friendName) {
  try {
    const userSnapshot = await getDocs(collection(db, "users"));
    let friendID = null;
    userSnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.name === friendName && doc.id !== currentUserUID) {
        friendID = doc.id;
      }
    });
    return friendID;
  } catch (error) {
    console.error("Error fetching friend ID:", error);
    return null;
  }
}

// Function to render suggested friends
async function renderSuggestedFriends(currentUserUID) {
  const suggestedFriendsListContainer = document.getElementById("suggested-friends-list");

  try {
    // Fetch all users except the current user
    const usersSnapshot = await getDocs(collection(db, "users"));
    const currentUserFriends = (await getDoc(doc(db, "users", currentUserUID))).data().friends || [];
    
    suggestedFriendsListContainer.innerHTML = "";
    
    usersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      const userID = userDoc.id;

      // Check if the user is not the current user and not already a friend
      if (userID !== currentUserUID && !currentUserFriends.some(friend => friend.uid === userID)) {
        const listItem = document.createElement("li");
        const addButton = document.createElement("button");
        
        addButton.textContent = "Send Request";
        addButton.classList.add("btn");
        addButton.classList.add("smallBtn"); // Add class for small button
        addButton.addEventListener("click", async () => {
          await sendFriendRequest(currentUserUID, userID);
          renderSuggestedFriends(currentUserUID);
        });
        
        listItem.textContent = userData.name;
        listItem.appendChild(addButton);
        suggestedFriendsListContainer.appendChild(listItem);
      }
    });
  } catch (error) {
    console.error("Error fetching suggested friends:", error);
    suggestedFriendsListContainer.innerHTML = "<li>Error fetching suggested friends</li>";
  }
}

// Function to send friend request
async function sendFriendRequest(currentUserUID, recipientUID) {
  try {
    const recipientRef = doc(db, "users", recipientUID);
    const currentUserDoc = await getDoc(doc(db, "users", currentUserUID));

    if (currentUserDoc.exists()) {
      const currentUserData = currentUserDoc.data();
      const updatedFriendRequests = [...(currentUserData.friendRequests || []), { senderUID: currentUserUID, recipientUID }];
      await runTransaction(db, async (transaction) => {
        transaction.update(recipientRef, { friendRequests: updatedFriendRequests });
      });
      
      // Show a success message after sending the friend request
      window.alert("Friend request sent successfully!");
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    // Show an error message if there's an issue with sending the friend request
    window.alert("Error sending friend request. Please try again later.");
  }
}

// Event listener for Return Home button
document.getElementById("returnHomeButton").addEventListener("click", () => {
  window.location.href = "start.html";
});

// Listen for authentication state changes and render friends, friend requests, and suggested friends
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const currentUserUID = user.uid;
    await Promise.all([
      renderFriends(currentUserUID),
      renderFriendRequests(currentUserUID),
      renderSuggestedFriends(currentUserUID)
    ]);
  } else {
    console.error("User not logged in");
  }
});

document.getElementById("addFriendButton").addEventListener("click", () => {
  window.location.href = "add-friend.html";
});

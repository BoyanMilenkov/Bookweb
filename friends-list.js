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
      } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
      import {
        getAuth,
        onAuthStateChanged,
      } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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

      async function getCurrentUserUID() {
        try {
          const user = auth.currentUser;
          if (user) {
            return user.uid;
          } else {
            console.error("User not logged in");
            return null;
          }
        } catch (error) {
          console.error("Error fetching user UID:", error);
          return null;
        }
      }

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

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const currentUserUID = user.uid;
          await renderFriends(currentUserUID);
        } else {
          console.error("User not logged in");
        }
      });

      document
        .getElementById("addFriendButton")
        .addEventListener("click", () => {
          window.location.href = `add-friend.html`;
        });

      document
        .getElementById("returnHomeButton")
        .addEventListener("click", () => {
          window.location.href = "start.html";
        });
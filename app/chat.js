import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    getDoc,
    onSnapshot,
    doc,
    where,
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

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const currentUserUID = user.uid;

        const urlParams = new URLSearchParams(window.location.search);
        const friendID = urlParams.get("friendID");

        if (!currentUserUID || !friendID) {
            console.error("currentUserUID or friendID is undefined.");
        } else {
            const chatMessages = document.getElementById("chatMessages");
            const friendNameSpan = document.getElementById("friendName");
            const messageInput = document.getElementById("messageInput");
            const sendMessageButton = document.getElementById("sendMessageButton");

            sendMessageButton.addEventListener("click", sendMessage);
            messageInput.addEventListener("keydown", function(event) {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault(); // Prevents the newline character
                    sendMessage();
                }
            });

            // Fetch friend's name based on friendID
            const friendDoc = await getDoc(doc(db, "users", friendID));
            if (friendDoc.exists()) {
                const friendName = friendDoc.data().name;
                friendNameSpan.textContent = friendName;
                console.log("Friend name:", friendName); // Log friend's name
            } else {
                console.error("Friend not found.");
                return;
            }

            const chatCollectionRef = collection(db, "chats");
            const chatQuery = query(
                chatCollectionRef,
                where("participants", "array-contains", currentUserUID),
                orderBy("timestamp")
            );

            onSnapshot(chatQuery, (snapshot) => {
              const messages = [];
              snapshot.forEach((doc) => {
                  const data = doc.data();
                  console.log("Message data:", data); // Log message data
                  if (data.participants.includes(friendID)) {
                      messages.push(data);
                  }
              });
              console.log("Messages:", messages); // Log messages array
              renderChatMessages(messages, currentUserUID); // Pass currentUserUID to the rendering function
          });
          


            async function sendMessage() {
              const text = messageInput.value.trim();
              if (text === "") return;
          
              try {
                  // Fetch the user's document from Firestore
                  const userDocRef = doc(db, "users", currentUserUID);
                  const userDocSnapshot = await getDoc(userDocRef);
          
                  // Retrieve sender name from the user document
                  let senderName = "Anonymous"; // Default to "Anonymous" if sender name is not available
                  if (userDocSnapshot.exists()) {
                      const userData = userDocSnapshot.data();
                      if (userData && userData.name) {
                          senderName = userData.name;
                      }
                  }
          
                  console.log("Sender Name:", senderName); // Log sender name
          
                  // Add message to the chat collection
                  await addDoc(chatCollectionRef, {
                      text: text,
                      senderID: currentUserUID,
                      timestamp: new Date(),
                      senderName: senderName,
                      participants: [currentUserUID, friendID],
                  });
          
                  messageInput.value = "";
              } catch (error) {
                  console.error("Error sending message:", error);
              }
          }

            function renderChatMessages(messages, currentUserUID) {
              chatMessages.innerHTML = "";
              messages.forEach((message) => {
                  const messageElement = document.createElement("div");
                  messageElement.classList.add("chat-message");
          
                  // Check if the message is sent by the current user
                  if (message.senderID === currentUserUID) {
                      messageElement.classList.add("sent");
                  } else {
                      messageElement.classList.add("received");
                  }
          
                  // Create elements for sender's name and message content
                  const senderNameElement = document.createElement("p");
                  senderNameElement.classList.add("message-sender");
                  senderNameElement.textContent = message.senderName;
                  const messageContentElement = document.createElement("p");
                  messageContentElement.textContent = message.text;
          
                  // Append sender's name and message content to the message element
                  messageElement.appendChild(senderNameElement);
                  messageElement.appendChild(messageContentElement);
          
                  // Append message element to the chat container
                  chatMessages.appendChild(messageElement);
              });
          }
        }
    } else {
        // If the user is not authenticated, redirect to the sign-in page
        window.location.href = "register.html";
    }
});

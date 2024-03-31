import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
      import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
      import {
        getFirestore,
        collection,
        getDocs,
      } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
      initializeApp(firebaseConfig);

      function updateLinksOnAuth() {
        const registerButton = document.getElementById("register");
        const loginButton = document.getElementById("login");
        const profileButton = document.getElementById("profile");
        const createPostButton = document.getElementById("create-post");
        const addBookButton = document.getElementById("add-book");
        const myBookListButton = document.getElementById("my-book-list");
        const friendListButton = document.getElementById("friend-list"); // Correct ID
        const genresButton = document.getElementById("genres");

        const user = getAuth().currentUser;
      
        if (user) {
          registerButton.style.display = "none";
          loginButton.style.display = "none";
          profileButton.style.display = "block";
          createPostButton.style.display = "block";
          addBookButton.style.display = "block";
          myBookListButton.style.display = "block";
          friendListButton.style.display = "block"; // Show friend list button
          genresButton.style.display = "block";
        } else {
          registerButton.style.display = "block";
          loginButton.style.display = "block";
          profileButton.style.display = "none";
          createPostButton.style.display = "none";
          addBookButton.style.display = "none";
          myBookListButton.style.display = "none";
          friendListButton.style.display = "none"; // Hide friend list button
          genresButton.style.display = "none";

        }
      }
      
      
      

      // Call the function to check auth status when the DOM content is loaded
      updateLinksOnAuth();

      // Call the function to update links when the auth state changes
      getAuth().onAuthStateChanged(function (user) {
        updateLinksOnAuth();
        if (user) {
          fetchPosts();
        } else {
          console.error("User not authenticated.");
          // Handle user not authenticated, e.g., redirect to login page
        }
      });

      async function fetchPosts() {
        const firestore = getFirestore();
        const postsContainer = document.getElementById("postsContainer");
        postsContainer.innerHTML = ""; // Clear previous posts

        const querySnapshot = await getDocs(collection(firestore, "users"));
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const posts = userData.posts;

          // Display posts for each user
          for (const postId in posts) {
            if (Object.hasOwnProperty.call(posts, postId)) {
              const post = posts[postId];
              const postHTML = `
                            <div class="post">
                                <h3>Posted by: <a class="username-link" href="user-profile.html?userId=${doc.id}">${userData.name}</a></h3>
                                <h2>${postId}</h2>
                                <p><strong>Author:</strong> ${post.author}</p>
                                <p><strong>Genre:</strong> ${post.genre}</p>
                                <p><strong>Review:</strong> ${post.review}</p>
                            </div>
                        `;
              postsContainer.insertAdjacentHTML("beforeend", postHTML);
            }
          }
        });

        // Redirect to user profile page if the logged-in user clicks their own name
        document.querySelectorAll(".username-link").forEach((link) => {
          link.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default link behavior
            const user = getAuth().currentUser;
            if (user) {
              const userId = event.target.getAttribute("href").split("=")[1];
              if (userId === user.uid) {
                window.location.href = "profile.html";
              } else {
                window.location.href = event.target.getAttribute("href"); // Redirect to user-profile.html for other users
              }
            }
          });
        });
      }
      document.addEventListener("DOMContentLoaded", function () {
        // Check if the user is logged in or registered
        var isLoggedIn = false; // Change this based on your authentication status
        var isRegistered = false; // Change this based on your registration status
    
        // Function to create and display the login message
        function displayLoginMessage() {
            // Check if the message already exists
            if (!document.getElementById("loginMessage")) {
                var message = document.createElement("div");
                message.textContent = "Please make an account or log in, through pressing the button on the navigation bar, to access the site";
                message.id = "loginMessage"; // Assign an id to the message for easy removal
    
                // Insert the message before the posts container
                var postsContainer = document.getElementById("postsContainer");
                postsContainer.parentNode.insertBefore(message, postsContainer);
            }
        }
    
        // Function to remove the login message
        function removeLoginMessage() {
            var loginMessage = document.getElementById("loginMessage");
            if (loginMessage) {
                loginMessage.parentNode.removeChild(loginMessage);
            }
        }
    
        // Call appropriate functions based on user authentication status
        if (!isLoggedIn && !isRegistered) {
            displayLoginMessage();
        }
    
        // Check for changes in authentication status
        getAuth().onAuthStateChanged(function (user) {
            if (user) {
                isLoggedIn = true;
                removeLoginMessage();
            } else {
                isLoggedIn = false;
                displayLoginMessage();
            }
        });
    });
    
    
    
    
    
    
// Function to update links based on user authentication status
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

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
initializeApp(firebaseConfig);

export function updateHeader() {
  const user = getAuth().currentUser;

  return `
  <nav class="navig">
    <p>BookWeb</p>
    <ul>
      <li><a id="home" href="start.html">Home</a></li>
      <li class="dropdown">
        <a href="#" id="genres" class="dropbtn">Genres</a>
        <div class="dropdown-content">
          <button onclick="window.location.href='fantasy.html'">Fantasy</button>
          <button onclick="window.location.href='science-fiction.html'">Science Fiction</button>
          <button onclick="window.location.href='romance.html'">Romance</button>
          <button onclick="window.location.href='horror.html'">Horror</button>
          <button onclick="window.location.href='thriller.html'">Thriller</button>
          <button onclick="window.location.href='adventure.html'">Adventure</button>
          <button onclick="window.location.href='dystopian.html'">Dystopian</button>
          <button onclick="window.location.href='historical.html'">Historical</button>
          <button onclick="window.location.href='memoir-and-biography.html'">Memoir and Biography</button>
        </div>
      </li>
      ${
        user
          ? `<li><a id="create-post" href="create-post.html">Create Post</a></li>
          <li><a id="add-book" href="addbook.html">Add a Book to the Collection</a></li>
          <li><a id="my-book-list" href="my-book-list.html">My Book List</a></li>
          <li><a id="friend-list" href="friends-list.html">Friend List</a></li>
          <li id="profileLink">
            <a id="profile" href="profile.html">Profile</a>
          </li>
          <li><a id="post" href="post.html">Posts</a></li>`
          : `<li id="registerLink"><a id="register" href="register.html">Register</a></li>
          <li id="loginLink"><a id="login" href="login.html">Login</a></li>`
      }
    </ul>
  </nav>`;
}

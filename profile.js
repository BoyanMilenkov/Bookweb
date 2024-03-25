import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
        import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDSVB_m--vKWpFjpa1PSyZoF7slhTdGN08",
            authDomain: "bookweb-99ef4.firebaseapp.com",
            projectId: "bookweb-99ef4",
            storageBucket: "bookweb-99ef4.appspot.com",
            messagingSenderId: "415676602525",
            appId: "1:415676602525:web:5ed67a9357cc9e3b88dc74",
            measurementId: "G-VDFL9E4XYJ"
        };

        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const storage = getStorage(app);

        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        document.getElementById('name').textContent = userData.name;
                        document.getElementById('email').textContent = userData.email;
                        document.getElementById('bio').textContent = userData.bio || "No bio available.";
                        if (userData.bio) {
                            document.getElementById('bioTextarea').style.display = 'none'; // Hide bio textarea
                            document.getElementById('saveBioButton').style.display = 'none'; // Hide save bio button
                            document.getElementById('editBioButton').style.display = 'block'; // Show edit bio button
                        }
                        if (userData.photoURL) {
                            document.getElementById('photoContainer').innerHTML = `
                                <img src="${userData.photoURL}" alt="Profile Photo" style="max-width: 200px;">
                            `;
                            document.getElementById('uploadPhotoButton').style.display = 'none'; // Hide circular button
                            document.getElementById('editPhotoButton').style.display = 'block'; // Show edit button
                            document.getElementById('deletePhotoButton').style.display = 'block'; // Show delete button
                        }
                        fetchUserPosts(user.uid); // Fetch user posts
                    } else {
                        console.log("User document not found");
                    }
                } catch (error) {
                    console.error("Error retrieving user data:", error.message);
                }
            } else {
                console.log("User is not logged in, redirecting to login page");
                window.location.href = "login.html";
            }
        });

        // Fetch user posts and display them
        async function fetchUserPosts(userId) {
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userPosts = userData.posts;
                if (userPosts) {
                    for (const postId in userPosts) {
                        if (Object.hasOwnProperty.call(userPosts, postId)) {
                            const postData = userPosts[postId];
                            const postHTML = `
                                <div class="post">
                                    <h2>${postId}</h2>
                                    <p><strong>Author:</strong> ${postData.author}</p>
                                    <p><strong>Genre:</strong> ${postData.genre}</p>
                                    <p><strong>Review:</strong> ${postData.review}</p>
                                    <button class="editPostButton" data-postid="${postId}">Edit Post</button>
                                </div>
                            `;
                            document.getElementById('userPostsContainer').insertAdjacentHTML('beforeend', postHTML);
                        }
                    }
                    attachEditEventListeners(); // Attach event listeners to edit buttons
                } else {
                    console.log("User has no posts.");
                }
            } else {
                console.log("User document not found.");
            }
        }

        // Attach event listeners to edit buttons
        function attachEditEventListeners() {
            document.querySelectorAll('.editPostButton').forEach(button => {
                button.addEventListener('click', (event) => {
                    const postId = event.target.getAttribute('data-postid');
                    window.location.href = `edit_post.html?postId=${postId}`;
                });
            });
        }

        // Function to delete the photo...
        function deletePhoto() {
            const user = auth.currentUser;
            if (user) {
                const storageRef = ref(storage, `profilePicture/${user.uid}`);
                deleteObject(storageRef)
                    .then(() => {
                        console.log("Photo deleted successfully");
                        updateDoc(doc(db, 'users', user.uid), {
                            photoURL: null // Remove the photoURL URL from user document
                        });
                        document.getElementById('photoContainer').innerHTML = ''; // Remove displayed photo
                        document.getElementById('uploadPhotoButton').style.display = 'block'; // Show circular button
                        document.getElementById('editPhotoButton').style.display = 'none'; // Hide edit button
                        document.getElementById('deletePhotoButton').style.display = 'none'; // Hide delete button
                    })
                    .catch(error => {
                        console.error("Error deleting photo:", error.message);
                    });
            }
        }

        document.getElementById('uploadPhotoButton').addEventListener('click', () => {
            document.getElementById('photoInput').click();
        });

        document.getElementById('photoInput').addEventListener('change', (event) => {
            const file = event.target.files[0];
            const user = auth.currentUser;
            if (user && file) {
                const storageRef = ref(storage, `profilePicture/${user.uid}`);
                uploadBytes(storageRef, file).then(() => {
                    console.log("Photo uploaded successfully");
                    getDownloadURL(storageRef).then(url => {
                        document.getElementById('photoContainer').innerHTML = `
                            <img src="${url}" alt="Profile Photo" style="max-width: 200px;">
                        `;
                        document.getElementById('uploadPhotoButton').style.display = 'none'; // Hide circular button
                        document.getElementById('editPhotoButton').style.display = 'block'; // Show edit button
                        document.getElementById('deletePhotoButton').style.display = 'block'; // Show delete button
                        // Save photo URL to user document
                        updateDoc(doc(db, 'users', user.uid), {
                            photoURL: url
                        });
                    });
                }).catch(error => {
                    console.error("Error uploading photo:", error.message);
                });
            }
        });

        document.getElementById('saveBioButton').addEventListener('click', () => {
            const newBio = document.getElementById('bioTextarea').value.trim();
            const user = auth.currentUser;
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                setDoc(userRef, { bio: newBio }, { merge: true })
                    .then(() => {
                        console.log("Bio updated successfully");
                        document.getElementById('bio').textContent = newBio || "No bio available.";
                        document.getElementById('bioTextarea').value = newBio;
                        document.getElementById('editBioButton').style.display = 'block';
                        document.getElementById('saveBioButton').style.display = 'none';
                        document.getElementById('bioTextarea').style.display = 'none';
                    })
                    .catch((error) => {
                        console.error("Error updating bio:", error.message);
                    });
            }
        });

        document.getElementById('editBioButton').addEventListener('click', () => {
            document.getElementById('editBioButton').style.display = 'none';
            document.getElementById('saveBioButton').style.display = 'block';
            document.getElementById('bioTextarea').style.display = 'block';
        });

        document.getElementById('logoutButton').addEventListener('click', () => {
            signOut(auth).then(() => {
                console.log("User signed out successfully");
                window.location.href = "login.html";
            }).catch((error) => {
                console.error("Error signing out:", error.message);
            });
        });

        document.getElementById('returnHomeButton').addEventListener('click', () => {
            window.location.href = "start.html";
        });

        document.getElementById('editPhotoButton').addEventListener('click', () => {
            document.getElementById('photoInput').click();
        });

        document.getElementById('deletePhotoButton').addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default action of button click
            deletePhoto();
        });
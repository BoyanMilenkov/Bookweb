function redirectToCreatePost() {
    window.location.href = 'create-post.html';
}
document.addEventListener('DOMContentLoaded', function () {
    const postsContainer = document.getElementById('posts-container');
    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

    existingPosts.forEach(function (post) {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
});

function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');

    postElement.innerHTML = `<strong>${post.author}</strong><br>Title: ${post.title}<br>Rating: ${post.rating}/5<br>Review: ${post.review}
        <div class="post-actions">
            <button onclick="editPost('${post.author}', '${post.title}', '${post.rating}', '${post.review}')">Edit</button>
            <button onclick="deletePost('${post.author}', '${post.title}')">Delete</button>
        </div>`;
    return postElement;
}

function redirectToEditPost(author, title, rating, review) {
    sessionStorage.setItem('editAuthor', author);
    sessionStorage.setItem('editTitle', title);
    sessionStorage.setItem('editRating', rating);
    sessionStorage.setItem('editReview', review);

    window.location.href = 'edit-post.html';
}



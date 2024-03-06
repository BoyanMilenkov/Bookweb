document.addEventListener('DOMContentLoaded', function () {
    const editRating = sessionStorage.getItem('editRating');
    const editReview = sessionStorage.getItem('editReview');

    document.getElementById('editedRating').value = editRating;
    document.getElementById('editedReview').value = editReview;
});

function submitEditedPost() {
    const editedRating = document.getElementById('editedRating').value;
    const editedReview = document.getElementById('editedReview').value;

    const editAuthor = sessionStorage.getItem('editAuthor');
    const editTitle = sessionStorage.getItem('editTitle');

    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

    const postIndex = existingPosts.findIndex(post => post.author === editAuthor && post.title === editTitle);

    if (postIndex !== -1) {
        existingPosts[postIndex].rating = editedRating;
        existingPosts[postIndex].review = editedReview;

        localStorage.setItem('posts', JSON.stringify(existingPosts));
    }

    window.location.href = 'index.html';
}
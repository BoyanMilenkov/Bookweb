function submitPost(event) {
    event.preventDefault();

    const author = document.getElementById('author').value;
    const title = document.getElementById('title').value;
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;

    console.log('Author:', author);
    console.log('Title:', title);
    console.log('Rating:', rating);
    console.log('Review:', review);

    const post = {
        author: author,
        title: title,
        rating: rating,
        review: review
    };

    const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

    existingPosts.push(post);

    localStorage.setItem('posts', JSON.stringify(existingPosts));

    window.location.href = 'start.html';
}
function editPost(author, title, rating, review) {
    localStorage.setItem('editAuthor', author);
    localStorage.setItem('editTitle', title);
    localStorage.setItem('editRating', rating);
    localStorage.setItem('editReview', review);

    window.location.href = 'edit-post.html';
}


function deletePost(author, title) {
    const confirmation = confirm(`Are you sure you want to delete the post by ${author} titled "${title}"?`);

    if (confirmation) {
        const existingPosts = JSON.parse(localStorage.getItem('posts')) || [];

        const updatedPosts = existingPosts.filter(post => !(post.author === author && post.title === title));

        localStorage.setItem('posts', JSON.stringify(updatedPosts));

        window.location.reload();
    }
}

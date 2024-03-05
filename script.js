document.addEventListener('DOMContentLoaded', () => {
  const userPostsContainer = document.getElementById('user-posts-container');

  // Assume you have a function to fetch user posts from a server
  function fetchUserPosts() {
      // Replace this with your actual API call or data retrieval logic
      return new Promise((resolve) => {
          const mockUserPosts = [
              { title: 'Book Review 1', author: 'John Doe', content: 'A great book!', date: '2023-03-01' },
              { title: 'Book Review 2', author: 'Jane Smith', content: 'Highly recommended!', date: '2023-03-02' },
              // ... more posts
          ];
          resolve(mockUserPosts);
      });
  }

  function displayUserPosts(posts) {
      userPostsContainer.innerHTML = '';
      posts.forEach((post) => {
          const postElement = document.createElement('div');
          postElement.classList.add('post');
          postElement.innerHTML = `
              <h3>${post.title}</h3>
              <p><strong>Author:</strong> ${post.author}</p>
              <p>${post.content}</p>
              <p><strong>Date:</strong> ${post.date}</p>
          `;
          userPostsContainer.appendChild(postElement);
      });
  }

  // Fetch and display user posts when the page loads
  fetchUserPosts().then((posts) => {
      displayUserPosts(posts);
  });
})
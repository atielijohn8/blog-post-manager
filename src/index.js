// API configuration
const API_URL = 'http://localhost:3000/posts';

// DOM elements
const postList = document.getElementById('post-list');
const postDetail = document.querySelector('#post-detail .post-card');
const form = document.getElementById('new-post-form');
const cancelBtn = document.querySelector('.cancel-btn');

// Main function that runs when DOM is loaded
function main() {
  displayPosts();
  addNewPostListener();
}

// Fetch and display all posts
async function displayPosts() {
  try {
    const response = await fetch(API_URL);
    const posts = await response.json();
    
    // Clear existing list
    postList.innerHTML = '';
    
    // Add each post title to the list
    posts.forEach(post => {
      const titleButton = document.createElement('button');
      titleButton.className = 'post-title';
      titleButton.textContent = post.title;
      titleButton.addEventListener('click', () => handlePostClick(post));
      postList.appendChild(titleButton);
    });
    
    // Display first post by default
    if (posts.length > 0) {
      handlePostClick(posts[0]);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    postList.innerHTML = '<p>Error loading posts. Please try again.</p>';
  }
}

// Handle click on post title
function handlePostClick(post) {
  postDetail.innerHTML = `
    <h3>${post.title}</h3>
    ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
    <p class="author">By: ${post.author}</p>
    <p>${post.content}</p>
  `;
}

// Add event listener for new post form
function addNewPostListener() {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPost = {
      title: document.getElementById('title').value,
      author: document.getElementById('author').value,
      image: document.getElementById('image').value,
      content: document.getElementById('content').value
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
      });

      const createdPost = await response.json();

       // Update UI
      displayPosts();
      handlePostClick(createdPost);
      form.reset();
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post. Please try again.');
    }
  });

  // Cancel button functionality
  cancelBtn.addEventListener('click', () => {
    form.reset();
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', main);


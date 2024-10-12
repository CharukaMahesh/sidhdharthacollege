import { firebaseConfig } from './config.js'; // Ensure config.js has firebaseConfig
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', () => {
  const userEmailSpan = document.getElementById('userEmail');
  const signoutBtn = document.getElementById('signoutbtn');

  // Check if the user is signed in
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, show their email
      userEmailSpan.textContent = user.email;
    } else {
      // If no user is signed in, redirect to the login page
      location.href = 'index.html';
    }
  });

  // Handle Sign Out
  signoutBtn.addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        alert('Signed out successfully.');
        location.href = 'index.html'; // Redirect to login page
      })
      .catch((error) => {
        alert('Error signing out: ' + error.message);
      });
  });
});

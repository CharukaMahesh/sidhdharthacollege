import { firebaseConfig } from './config.js';
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage();

// Function to switch forms
const toggleForms = (showSignup) => {
  const loginForm = document.querySelector('.login.form');
  const signupForm = document.querySelector('.registration.form');

  if (showSignup) {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  } else {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  }
};

// Event listeners for toggling forms
document.getElementById('signupLabel').addEventListener('click', () => toggleForms(true));
document.getElementById('loginLabel').addEventListener('click', () => toggleForms(false));

// Handle Signup
document.querySelector('.signupbtn').addEventListener('click', () => {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const profilePhoto = document.getElementById('profilePhoto').files[0]; // Get the file

  if (!name || !email || !password || !profilePhoto) {
    alert('Please fill out all fields, including uploading a profile photo.');
    return;
  }

  // Create user with email and password
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      const storageRef = storage.ref(`profilePhotos/${user.uid}`); // Store with user ID
      const uploadTask = storageRef.put(profilePhoto); // Upload the profile photo

      uploadTask.on('state_changed',
        (snapshot) => {
          // Progress bar logic (optional)
        },
        (error) => {
          console.error('Error uploading profile photo:', error);
        },
        () => {
          // Get the download URL of the uploaded photo
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            // Update user profile with the name and photo URL
            user.updateProfile({
              displayName: name,
              photoURL: downloadURL
            }).then(() => {
              console.log('User profile updated successfully!');
              // Redirect or show success message
              alert('Signup successful!');
              // Optionally redirect to another page
              // window.location.href = "profile.html"; // Redirect after signup
            }).catch(error => {
              console.error('Error updating profile:', error);
            });
          });
        }
      );
    })
    .catch(error => {
      console.error('Error signing up:', error.message);
      alert('Signup failed: ' + error.message);
    });
});

// Handle Login
document.querySelector('.loginbtn').addEventListener('click', () => {
  const email = document.getElementById('inUsr').value;
  const password = document.getElementById('inPass').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('Login successful!', userCredential.user);
      // Optionally redirect to another page
      // window.location.href = "profile.html"; // Redirect after login
    })
    .catch((error) => {
      console.error('Error logging in:', error.message);
      alert('Login failed: ' + error.message);
    });
});

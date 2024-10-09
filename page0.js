import { firebaseConfig } from './config.js';
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
const signupForm = document.querySelector('.registration.form');
const loginForm = document.querySelector('.login.form');
const forgotForm = document.querySelector('.forgot.form');
const signupBtn = document.querySelector('.signupbtn');
const loginBtn = document.querySelector('.loginbtn');
const forgotBtn = document.querySelector('.forgotbtn');
const googleLoginBtn = document.querySelector('#googleLogin');
const googleSignupBtn = document.querySelector('#googleSignup');

// Handle anchor tags to toggle between forms
const anchors = document.querySelectorAll('a');
anchors.forEach(anchor => {
  anchor.addEventListener('click', () => {
    const id = anchor.id;
    switch (id) {
      case 'loginLabel':
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        forgotForm.style.display = 'none';
        break;
      case 'signupLabel':
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
        forgotForm.style.display = 'none';
        break;
      case 'forgotLabel':
        signupForm.style.display = 'none';
        loginForm.style.display = 'none';
        forgotForm.style.display = 'block';
        break;
    }
  });
});

// Handle Signup
signupBtn.addEventListener('click', () => {
  const name = document.querySelector('#name').value;
  const username = document.querySelector('#username').value;
  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;
      user.sendEmailVerification()
        .then(() => {
          alert('Verification email sent. Please check your inbox and verify your email before signing in.');
        })
        .catch((error) => {
          alert('Error sending verification email: ' + error.message);
        });
      firestore.collection('users').doc(uid).set({
        name: name,
        username: username,
        email: email,
      });
      signupForm.style.display = 'none';
      loginForm.style.display = 'block';
      forgotForm.style.display = 'none';
    })
    .catch((error) => {
      alert('Error signing up: ' + error.message);
    });
});

// Handle Login
loginBtn.addEventListener('click', () => {
  const email = document.querySelector('#inUsr').value.trim();
  const password = document.querySelector('#inPass').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (user.emailVerified) {
        console.log('User is signed in with a verified email.');
        location.href = "signout.html";
      } else {
        alert('Please verify your email before signing in.');
      }
    })
    .catch((error) => {
      alert('Error signing in: ' + error.message);
    });
});

// Handle Forgot Password
forgotBtn.addEventListener('click', () => {
  const emailForReset = document.querySelector('#forgotinp').value.trim();
  if (emailForReset.length > 0) {
    auth.sendPasswordResetEmail(emailForReset)
      .then(() => {
        alert('Password reset email sent. Please check your inbox to reset your password.');
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
        forgotForm.style.display = 'none';
      })
      .catch((error) => {
        alert('Error sending password reset email: ' + error.message);
      });
  }
});

// Initialize Google Auth Provider
const provider = new firebase.auth.GoogleAuthProvider();

// Handle Google Login
googleLoginBtn.addEventListener('click', () => {
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log('Google user signed in:', user);
      location.href = "signout.html"; // Redirect after login
    })
    .catch((error) => {
      console.error('Error during Google login:', error);
      alert('Error during Google login: ' + error.message);
    });
});

// Handle Google Signup
googleSignupBtn.addEventListener('click', () => {
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      const uid = user.uid;
      firestore.collection('users').doc(uid).set({
        name: user.displayName,
        email: user.email,
        googleUser: true
      });
      console.log('Google user signed up and saved to Firestore:', user);
      location.href = "signout.html"; // Redirect after signup
    })
    .catch((error) => {
      console.error('Error during Google signup:', error);
      alert('Error during Google signup: ' + error.message);
    });
});
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDczLLPnaREY3SahAMeKJ-DOMyVENmWwLk",
    authDomain: "crex-f9f68.firebaseapp.com",
    databaseURL: "https://crex-f9f68-default-rtdb.firebaseio.com",
    projectId: "crex-f9f68",
    storageBucket: "crex-f9f68.appspot.com",
    messagingSenderId: "209664661907",
    appId: "1:209664661907:web:933435dab65ebb20913066"
  };
  firebase.initializeApp(firebaseConfig);
  
  // Reference to the users database
  const usersRef = firebase.database().ref('crex/users');
  
  // Function to display user data
  function displayUserData() {
    usersRef.on('value', (snapshot) => {
      const userData = snapshot.val();
      const displayContainer = document.getElementById('display-container-users');
      displayContainer.innerHTML = '';
      
      Object.keys(userData).forEach((username) => {
        const user = userData[username];
        const displayText = `Username: ${username}<br>Email: ${user.email}<br>Password: ${user.password}<br><br>`;
        const deleteUserButton = document.createElement('button');
        deleteUserButton.textContent = 'Delete User';
        deleteUserButton.onclick = () => deleteUser(username);
        
        const userContainer = document.createElement('div');
        userContainer.innerHTML = displayText;
        userContainer.appendChild(deleteUserButton);
        
        displayContainer.appendChild(userContainer);
      });
    });
  }
  
  // Function to delete user data
  function deleteUser(username) {
    usersRef.child(username).remove();
    alert(`User ${username} deleted successfully!`);
  }
  
  // Function to update user data
  function updateUserData() {
    const updateUsernameInput = document.getElementById('update-username');
    const newUsernameInput = document.getElementById('new-username');
    const updateEmailInput = document.getElementById('update-email');
    const updatePasswordInput = document.getElementById('update-password');
    
    const username = updateUsernameInput.value;
    const newUsername = newUsernameInput.value;
    const email = updateEmailInput.value;
    const password = updatePasswordInput.value;
    
    if (username) {
      usersRef.child(username).once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          const updates = {};
          if (newUsername) {
            usersRef.child(newUsername).set(userData);
            usersRef.child(username).remove();
            alert('Username updated successfully!');
          } else {
            if (email) {
              updates.email = email;
            }
            if (password) {
              updates.password = password;
            }
            usersRef.child(username).update(updates);
            alert('User data updated successfully!');
          }
        } else {
          alert('User not found.');
        }
      });
    } else {
      alert('Please enter a username to update.');
    }
  }
  
  // Add event listener to display button
  document.getElementById('display-btn').addEventListener('click', displayUserData);
  
  // Add event listener to update button
  document.getElementById('update-btn').addEventListener('click', updateUserData);
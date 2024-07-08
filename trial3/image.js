import { uploadBytes, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-q7WKos_WDe9CI7Vt8h7L9p8hmU3RN2U",
  authDomain: "form-40eb7.firebaseapp.com",
  databaseURL: "https://form-40eb7-default-rtdb.firebaseio.com",
  projectId: "form-40eb7",
  storageBucket: "form-40eb7.appspot.com",
  messagingSenderId: "446836596141",
  appId: "1:446836596141:web:1e62260579074b04e81524"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage(app);

// Get the file input element
const fileInput = document.querySelector('input[type="file"]');
const displayImagesButton = document.querySelector('#display-images');
const imageContainer = document.querySelector('#image-container');
const imageForm = document.querySelector('#image-form');

// Add an event listener to the form's submit event
imageForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the form from submitting
});

// Add an event listener to the file input element
fileInput.addEventListener('change', (e) => {
  // Get the selected file
  const file = fileInput.files[0];

  // Ask for a filename
  const filenameInput = prompt("Enter a filename for the image:");
  if (!filenameInput) return; // cancel upload if no filename is entered

  // Create a reference to the storage location with the entered filename
  const storageRef = ref(storage, `images/${filenameInput}`);

  // Upload the file to storage
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
});
// Add an event listener to the display images button
displayImagesButton.addEventListener('click', () => {
  // Clear the image container
  imageContainer.innerHTML = '';

  // Create a reference to the storage location
  const storageRef = ref(storage, 'images');

  // List all files in the storage location
  listAll(storageRef).then((res) => {
    res.items.forEach((item) => {
      // Get the URL of the file
      getDownloadURL(item).then((url) => {
        // Create a new div element to wrap the image
        const imageDiv = document.createElement('div');
        imageDiv.style.display = 'inline-block'; // display horizontally
        imageDiv.style.margin = '10px'; // add margin between images
        imageDiv.style.width = '200px'; // set the width of the div
        imageDiv.style.height = '300px'; // set the height of the div
        imageDiv.style.overflow = 'auto'; // add scrolling if image exceeds div size

        // Create an image element and add it to the div
        const img = document.createElement('img');
        img.src = url;
        img.alt = item.name;
        img.style.width = '100%'; // set the image width to 100% of the div
        img.style.height = '100%'; // set the image height to 100% of the div
        img.style.objectFit = 'cover'; // maintain aspect ratio
        imageDiv.appendChild(img);

        // Create a delete button and add it to the container
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button'; // add class to style the button
        deleteButton.addEventListener('click', () => {
          // Delete the image from Firebase Storage
          deleteObject(item).then(() => {
            console.log(`Deleted file ${item.name}`);
            // Remove the div element from the container
            imageContainer.removeChild(imageDiv);
            // Remove the delete button from the container
            imageContainer.removeChild(deleteButton);
          }).catch((error) => {
            console.error(`Error deleting file ${item.name}:`, error);
          });
        });
        imageContainer.appendChild(deleteButton);

        // Add the div element to the container
        imageContainer.appendChild(imageDiv);
      });
    });
  });
});
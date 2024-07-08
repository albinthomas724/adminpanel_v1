// Initialize Firebase (replace with your own configuration)
const firebaseConfig = {
    apiKey: "AIzaSyD-q7WKos_WDe9CI7Vt8h7L9p8hmU3RN2U",
    authDomain: "form-40eb7.firebaseapp.com",
    databaseURL: "https://console.firebase.google.com/project/form-40eb7/storage/form-40eb7.appspot.com/files",
    projectId: "form-40eb7",
    storageBucket: "form-40eb7.appspot.com",
    messagingSenderId: "446836596141",
    appId: "1:446836596141:web:1e62260579074b04e81524"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Reference for the storage
  var storageRef = firebase.storage().ref();
  
  // Function to handle form submission
  document.getElementById('form1').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const msgContent = document.getElementById('message').value;
    const imageFile = document.getElementById('image').files[0];
  
    if (!imageFile) {
      // Handle case where no image is selected
      console.error("Please select an image to upload.");
      return;
    }
  
    try {
      // Create a unique filename to prevent overwrites
      const filename = `${Date.now()}-${imageFile.name}`;
      const imageRef = storageRef.child('images/' + filename);
  
      // Upload image to Firebase Storage
      const uploadTask = await imageRef.put(imageFile); // Use async/await
  
      // Get download URL after successful upload
      const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
  
      // Save data to Firebase Realtime Database (replace if needed)
      const formdb = firebase.database().ref('form');
      const newForm = formdb.push();
      await newForm.set({
        name,
        email,
        msgContent,
        image: downloadURL
      });
  
      console.log("Form data and image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle upload errors appropriately (e.g., display error message)
    }
  });
  
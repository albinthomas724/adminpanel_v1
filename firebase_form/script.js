// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD-q7WKos_WDe9CI7Vt8h7L9p8hmU3RN2U",
    authDomain: "form-40eb7.firebaseapp.com",
    databaseURL: "https://form-40eb7-default-rtdb.firebaseio.com",
    projectId: "form-40eb7",
    storageBucket: "form-40eb7.appspot.com",
    messagingSenderId: "446836596141",
    appId: "1:446836596141:web:1e62260579074b04e81524"
};
firebase.initializeApp(firebaseConfig);

// Reference for the database
var formdb = firebase.database().ref('form');

// Function to handle form submission
document.getElementById('form1').addEventListener('submit', function (e) {
    e.preventDefault();
    
    var uniqueId = getElementByVal('unique-id');
    var name = getElementByVal('name');
    var email = getElementByVal('email');
    var msgContent = getElementByVal('message');

    saveMessages(uniqueId, name, email, msgContent);
});

// Function to save messages to Firebase
function saveMessages(uniqueId, name, email, msgContent) {
    var newForm = formdb.child(uniqueId);
    newForm.set({
        name: name,
        email: email,
        msgcontent: msgContent
    });
}

// Function to get element value by ID
function getElementByVal(id) {
    return document.getElementById(id).value;
}

// Function to display data
function displayData() {
    formdb.on('value', (snapshot) => {
        const data = snapshot.val();
        const displayContainer = document.getElementById('display-container');
        displayContainer.innerHTML = '';

        Object.keys(data).forEach((key) => {
            const message = data[key];
            const displayText = `Unique ID: ${key}<br>Name: ${message.name}<br>Email: ${message.email}<br>Message: ${message.msgcontent}<br><button id="${key}" onclick="deleteData(this.id)">Delete</button><br><br>`;
            displayContainer.innerHTML += displayText;
        });
    });
}

// Function to delete data from Firebase
function deleteData(uniqueId) {
    formdb.child(uniqueId).remove();
}

// Function to update data in Firebase
function updateData() {
    var updateId = getElementByVal('update-id');
    var name = prompt("Enter new name");
    var email = prompt("Enter new email");
    var msgContent = prompt("Enter new message");

    var updates = {};
    updates['/form/' + updateId] = {
        name: name,
        email: email,
        msgcontent: msgContent
    };

    firebase.database().ref().update(updates);
}

// Add event listener to display button
document.getElementById('display-data').addEventListener('click', displayData);

// Add event listener to update button
document.getElementById('update-data').addEventListener('click', updateData);
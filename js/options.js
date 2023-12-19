const uploadButton = document.getElementById("upload-button");
const uploadMessage = document.getElementById("upload-message");

uploadButton.addEventListener("click", () => {
  const file = document.getElementById("calendar-file").files[0];
  if (!file || !file.type.match(/\.ics$/)) {
    uploadMessage.textContent = "Please choose a valid .ics file.";
    return;
  }

  uploadMessage.textContent = "Uploading...";

  const reader = new FileReader();
  reader.onload = async (event) => {
    const icsData = event.target.result;
    try {
      const events = parseIcs(icsData); // Use iCal.js library to parse
      await chrome.storage.local.set({ 'calendarEvents': events });
      uploadMessage.textContent = "Upload successful! Refresh new tab to see today's events.";
    } catch (error) {
      uploadMessage.textContent = `Error parsing file: ${error.message}`;
    }
  };
  reader.readAsText(file);
});


const STORAGE_KEY = "nameListStorage"; // Key for storing data in Chrome storage

// Function to add a new name to the list and save it
const addName = () => {
    const list = document.getElementById("nameList");
    const input = document.getElementById("nameInput");

    if (input.value.trim() === "") return;

    addNameToList(input.value);
    input.value = "";
    saveNames();
};

// Function to create a list item with a remove button
const createListItem = (name) => {
    const listItem = document.createElement("li");
    listItem.textContent = name;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
        listItem.remove();
        saveNames();
    });

    listItem.appendChild(removeBtn);
    return listItem;
};

// Function to add a name to the list element
const addNameToList = (name) => {
    const list = document.getElementById("nameList");
    const listItem = createListItem(name);
    list.appendChild(listItem);
};

// Function to save the list of names to Chrome storage
const saveNames = () => {
    const names = Array.from(document.getElementById("nameList").children).map(li => li.firstChild.textContent);
    chrome.storage.local.set({ [STORAGE_KEY]: names });
};

// Function to load the list of names from Chrome storage
const loadNames = () => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
        if (result[STORAGE_KEY]) {
            result[STORAGE_KEY].forEach(name => addNameToList(name));
        }
    });
};

// Event listener for the add button
document.getElementById("addNameBtn").addEventListener("click", addName);

// Load names from storage when the page loads
document.addEventListener("DOMContentLoaded", loadNames);

const uploadButton = document.getElementById("uploadBtn");
const uploadMessage = document.getElementById("upload-message");

function parseIcs(icsData) {
  const events = [];
  const jcalData = ICAL.parse(icsData);
  const comp = new ICAL.Component(jcalData);

  comp.getAllSubcomponents('vevent').forEach(vevent => {
      const event = new ICAL.Event(vevent);
      events.push({
          summary: event.summary,
          location: event.location,
          startDate: event.startDate.toString() + 'Z',
          endDate: event.endDate.toString() + 'Z',
          description: event.description
      });
  });

  return events;
}

uploadButton.addEventListener("click", () => {
  const file = document.getElementById("calendar-file").files[0];
  if (!file || !file.name.endsWith('.ics')) {
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
    const input = document.getElementById("nameInput");

    if (input.value.trim() === "") return;

    if (Array.from(document.getElementById("name-table").rows).some(row => row.cells[0].textContent === input.value)) {
        alert("Name already exists!");
        return;
    }

    let count = 0;

    chrome.storage.local.get('calendarEvents', function(result) {
      const events = result['calendarEvents'] || []; // Provide a default value if undefined
  
      events.forEach(event => {
          if (event['summary'] && event['summary'].includes(input.value)) {
              count += 1;
          }
      });

      if (count === 0) {
        alert("Name not found in calendar!");
        return;
      }

      addNameToTable(input.value, count);
      input.value = "";

      saveNames();
      loadResult();
    });
};

const submitTuition = () => {
  var userInput = document.getElementById("tuitionInput");
  const result = document.getElementById("tuition-result");

  chrome.storage.local.set({ ['tuitionCost']: userInput.value });

  loadResult();
};

// Function to add a name to the list element
const addNameToTable = (name, count) => {
    const table = document.getElementById("name-table");
    let row = table.insertRow();

    let nameCell = row.insertCell(0);
    let countCell = row.insertCell(1);

    nameCell.textContent = name;
    countCell.textContent = count;
  
    const removeBtn = document.createElement("button");
    removeBtn.id = "removeBtn"
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
        row.remove();
        saveNames();
        loadResult();
    });

    const td = document.createElement("td");
    td.appendChild(removeBtn);

    row.appendChild(td);
};

// Function to save the list of names to Chrome storage
const saveNames = () => {
  const tableRows = document.getElementById("name-table").rows;
  const vals = {};

  Array.from(tableRows).slice(1).forEach(row => {
    const [nameCell, costCell] = row.cells;
    vals[nameCell.textContent] = costCell.textContent;
  });

  chrome.storage.local.set({ [STORAGE_KEY]: vals });
};

const loadValues = () => {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    if (result[STORAGE_KEY]) {
        Object.entries(result[STORAGE_KEY]).forEach(([name, count]) => addNameToTable(name, count));
    }
  });
};

const loadResult = () => {
  let numberOfCourses = 0;
  chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (result[STORAGE_KEY]) {
          numberOfCourses = Object.keys(result[STORAGE_KEY]).length;
      }
  });

  chrome.storage.local.get(['tuitionCost'], (val) => {
    if (val['tuitionCost']) {
        const result = document.getElementById("tuition-result");
        result.textContent = `Avg. tuition cost: cost / no. of courses = ${val['tuitionCost']} / ${numberOfCourses} = ${val['tuitionCost'] / numberOfCourses}`;
    }
});
};

document.getElementById('toggleNewTab').addEventListener('change', function() {
  chrome.storage.local.set({'disableNewTab': !this.checked});
});

chrome.storage.local.get('disableNewTab', function(data) {
  document.getElementById('toggleNewTab').checked = !data.disableNewTab;
});

// Event listener for the add button
document.getElementById("addNameBtn").addEventListener("click", addName);
document.getElementById("tuitionBtn").addEventListener("click", submitTuition);

// Load names from storage when the page loads
document.addEventListener("DOMContentLoaded", loadValues);
document.addEventListener("DOMContentLoaded", loadResult);

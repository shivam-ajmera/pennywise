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
          startDate: (!event.startDate.toString().endsWith('Z')) ? event.startDate.toString() + 'Z' : event.startDate.toString(),
          endDate: (!event.endDate.toString().endsWith('Z')) ? event.endDate.toString() + 'Z' : event.startDate.toString(),
          description: event.description
      });
  });

  return events;
}

uploadButton.addEventListener("click", async () => {
  const url = document.getElementById("calendar-url").value;
  if (!url || !url.endsWith('.ics')) {
    uploadMessage.textContent = "Please choose a valid link (ends with .ics)";
    return;
  }

  uploadMessage.textContent = "In Progress...";
  uploadButton.disabled = true;

  chrome.runtime.sendMessage({action: "fetchICS", url: url}, async function(response) {
    if (response.data) {
      const events = parseIcs(response.data); // Use iCal.js library to parse
      await chrome.storage.local.set({ 'calendarEvents': events });
      uploadMessage.textContent = "Completed!";
    } else if (response.error) {
      uploadMessage.textContent = `Error fetching the .ics file`;
    }
  });

  uploadButton.disabled = false;
});

// uploadButton.addEventListener("click", () => {
//   const file = document.getElementById("calendar-file").files[0];
//   if (!file || !file.name.endsWith('.ics')) {
//     uploadMessage.textContent = "Please choose a valid .ics file.";
//     return;
//   }

//   uploadMessage.textContent = "Uploading...";

//   const reader = new FileReader();
//   reader.onload = async (event) => {
//     const icsData = event.target.result;
//     try {
//       const events = parseIcs(icsData); // Use iCal.js library to parse
//       await chrome.storage.local.set({ 'calendarEvents': events });
//       uploadMessage.textContent = "Upload successful!";
//     } catch (error) {
//       uploadMessage.textContent = `Error parsing file: ${error.message}`;
//     }
//   };
//   reader.readAsText(file);
// });


const STORAGE_KEY = "nameListStorage"; // Key for storing data in Chrome storage

// Function to add a new name to the list and save it
const addName = () => {
    const input = document.getElementById("nameInput");

    if (input.value.trim() === "") return;

    if (Array.from(document.getElementById("name-table").rows).some(row => row.cells[0].textContent === input.value)) {
        alert("Keyword already exists!");
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
        alert("Keyword not found in calendar!");
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

  if (userInput.value.trim() === "") return;

  if (userInput.value < 0) {
    alert("Tuition cannot be negative!");
    return;
  }

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
    removeBtn.textContent = "Delete Keyword";
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

const loadTimeRange = () => {
  chrome.storage.local.get(['isDay'], (val) => {
    document.getElementById('day').checked = val['isDay'];
    document.getElementById('night').checked = !val['isDay'];
  });
};

const loadResult = () => {
  let numberOfCourses = 0;
  chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (result[STORAGE_KEY]) {
          numberOfCourses = Object.keys(result[STORAGE_KEY]).length;
      }
  });

  chrome.storage.local.get(['tuitionCost'], async (val) => {
    if (val['tuitionCost']) {
        const result = document.getElementById("tuition-result");

        // Get names of events from chrome storage
        const allowedEvents = await chrome.storage.local.get(STORAGE_KEY);
        if (!allowedEvents[STORAGE_KEY]) {
            return;
        }
        const totalNumberOfClasses = Object.values(allowedEvents[STORAGE_KEY]).reduce((total, value) => {
            return total + Number(value);
          }, 0);

        const tuition = await chrome.storage.local.get(['tuitionCost']);

        const pricePerClass = (tuition['tuitionCost'] || 0) / (totalNumberOfClasses || 1);

        result.textContent = `Cost per class = Total Tuition (${val['tuitionCost']}) \u00f7 No. of classes (${totalNumberOfClasses}) = $${pricePerClass.toFixed(2)}`;
    }
});
};

document.getElementById('toggleNewTab').addEventListener('change', function() {
  chrome.storage.local.set({'disableNewTab': !this.checked});
});

chrome.storage.local.get('disableNewTab', function(data) {
  document.getElementById('toggleNewTab').checked = !data.disableNewTab;
});

var timeRangeRadios = document.querySelectorAll('input[name="defaultTimeRange"]');

// Add the event listener to each radio button
timeRangeRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      let isDaySelected = (this.value === 'on') ? true : false;
      chrome.storage.local.set({['isDay']: isDaySelected})
    });
});

// Event listener for the add button
document.getElementById("addNameBtn").addEventListener("click", addName);
document.getElementById("tuitionBtn").addEventListener("click", submitTuition);

// Load names from storage when the page loads
document.addEventListener("DOMContentLoaded", loadValues);
document.addEventListener("DOMContentLoaded", loadResult);
document.addEventListener("DOMContentLoaded", loadTimeRange);
document.addEventListener("DOMContentLoaded", async () => {
  var calendarEvents = await chrome.storage.local.get('calendarEvents');
  if (calendarEvents['calendarEvents']) {
    uploadMessage.innerText = "Already uploaded!";
  }
});


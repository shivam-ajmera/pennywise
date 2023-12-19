const STORAGE_KEY = "nameListStorage"; // Key for storing data in Chrome storage

const cost = document.querySelector('.dollar-value');
const comparison = document.querySelector('.comparison-value');

function isTodayDate(inputDate) {
    const today = new Date("2023-09-13T00:00:00");

    return inputDate.getDate() === today.getDate() &&
            inputDate.getMonth() === today.getMonth() &&
            inputDate.getFullYear() === today.getFullYear();
}

function containsAnySubstring(str, substrings) {
    return substrings.some(substring => str.includes(substring));
}

async function getTodayEvents() {
    const todayEvents = [];
    const events = await chrome.storage.local.get('calendarEvents');

    const allowedEvents = await chrome.storage.local.get(STORAGE_KEY);

    events['calendarEvents'].forEach(event => {
        const eventDate = new Date(event['startDate']);
        
        if (isTodayDate(eventDate) && containsAnySubstring(event['summary'], allowedEvents[STORAGE_KEY])) {
            todayEvents.push(event);
        }
    });

    return todayEvents;
}

//  initialize a dict with random objects to their prices
const objectPrices = {
    "Nespresso Vertuo Coffee Machines": 199.00,
    "Montblanc Leather Wallets": 250.00,
    "Ray-Ban Aviator Sunglasses": 153.00,
    "JBL Flip 5 Bluetooth Speakers": 119.95,
    "Apple Watches": 399.00,
    "Bose QuietComfort 45 Headphones": 329.00,
    "Burberry Cashmere Scarves": 470.00,
    "Godiva Gourmet Chocolate Gift Boxes": 59.99,
    "iPhone 14 Pro Max": 1099.00,
    "GoPro HERO10": 399.99,
    "Sony Noise Cancelling Headphones WH1000XM4": 348.00,
    "Dyson V11 Vacuum Cleaners": 599.99,
    "Samsung QLED 4K Smart TVs": 799.99,
    "Breville Barista Espresso Machines": 699.95,
    "Microsoft Surface Pro 8": 1099.99,
    "Canon EOS R5 Cameras": 3899.00,
    "Bose SoundLink Bluetooth Speakers": 129.00,
    "Fitbit Charge 5": 179.95
};

function displayCost(){
    // Generate a random value between 10 and 100    
    const min = 1000.00;
    const max = 10000.00;
    const randomValue = Math.random() * (max - min) + min;

    // Format the value to 2 decimal places and add dollar sign
    cost.innerText = `$${Number(randomValue.toFixed(2)).toLocaleString()}`;

    // Get a random object from the objectPrices dict
    const randomKey = Object.keys(objectPrices)[Math.floor(Math.random() * Object.keys(objectPrices).length)];
    val = randomValue.toFixed(2) / objectPrices[randomKey];
    comparison.innerText = `or nearly ${val.toFixed(1)} ${randomKey}`;
}


// Function to get the suffix for the day of the month
function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

// Function to format the date as "19th Dec 2023"
function formatDate(date) {
    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}${getDaySuffix(day)} ${month} ${year}`;
}

document.getElementById('date').textContent = "Date: " + formatDate(new Date());

// Function to add items to the table
async function addItemsToTable() {
    const table = document.getElementById('events-table-body');
    const events = await getTodayEvents();
        
    events.forEach(event => {
        let row = table.insertRow();
        const startDate = new Date(event['startDate']);
        const endDate = new Date(event['endDate']);

        let time = row.insertCell(0);
        let className = row.insertCell(1);
        let duration = row.insertCell(2);

        time.textContent = startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        className.textContent = event['summary'];
        duration.textContent = `${(endDate - startDate) / (1000 * 60)} mins`;
    });
}

displayCost();
addItemsToTable();
getTodayEvents();
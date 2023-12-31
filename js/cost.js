const STORAGE_KEY = "nameListStorage"; // Key for storing data in Chrome storage

const displayText = document.querySelector('.today-text');
const cost = document.querySelector('.dollar-value');
const popupCost = document.querySelector('.dollar-value-popup');
const comparison = document.querySelector('.comparison-value');

function isTodayDate(inputDate) {
    const today = new Date();

    return inputDate.getDate() === today.getDate() &&
            inputDate.getMonth() === today.getMonth() &&
            inputDate.getFullYear() === today.getFullYear();
}

function isThisMonth(inputDate) {
    const today = new Date();

    return inputDate.getMonth() === today.getMonth() &&
            inputDate.getFullYear() === today.getFullYear();
}

function containsAnySubstring(str, substrings) {
    return substrings.some(substring => str.includes(substring));
}

async function getTodayEvents() {
    const todayEvents = [];
    const events = await chrome.storage.local.get('calendarEvents');

    const allowedEvents = await chrome.storage.local.get(STORAGE_KEY);
    if (allowedEvents[STORAGE_KEY] === undefined || allowedEvents[STORAGE_KEY] === null) {
        return;
    }
    const allowedEventNames = Object.keys(allowedEvents[STORAGE_KEY])

    events['calendarEvents']?.forEach(event => {
        const eventDate = new Date(event['startDate']);
        
        if (isTodayDate(eventDate) && containsAnySubstring(event['summary'], allowedEventNames)) {
            todayEvents.push(event);
        }
    });

    todayEvents.sort((a, b) => {
        const aDate = new Date(a['startDate']);
        const bDate = new Date(b['startDate']);
        return aDate - bDate;
    });

    return todayEvents;
}

async function getThisMonthEvents() {
    const monthEvents = [];
    const events = await chrome.storage.local.get('calendarEvents');

    const allowedEvents = await chrome.storage.local.get(STORAGE_KEY);
    if (allowedEvents[STORAGE_KEY] === undefined || allowedEvents[STORAGE_KEY] === null) {
        return;
    }
    const allowedEventNames = Object.keys(allowedEvents[STORAGE_KEY])

    events['calendarEvents']?.forEach(event => {
        const eventDate = new Date(event['startDate']);
        
        if (isThisMonth(eventDate) && containsAnySubstring(event['summary'], allowedEventNames)) {
            monthEvents.push(event);
        }
    });

    return monthEvents;
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
    "Fitbit Charge 5": 179.95,
    "Starbucks Cold Brews": 4,
    "McDonald's French Fries": 4.89,
};

async function displayPopupCost(){
    if(!popupCost){
        return;
    }

    // Get today's events
    const todayEvents = await getTodayEvents();

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
    
    const total = pricePerClass * (todayEvents || []).length;

    // Format the value to 2 decimal places and add dollar sign
    popupCost.innerText = `$${Number(total.toFixed(2)).toLocaleString()}`;
}

async function displayCost(){
    // Get today's events
    const todayEvents = await getTodayEvents();

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
    
    const total = pricePerClass * (todayEvents || []).length;

    displayText.innerText = "Today costs you:";

    // Format the value to 2 decimal places and add dollar sign
    cost.innerText = `$${Number(total.toFixed(2)).toLocaleString()}`;

    // Get a random object from the objectPrices dict
    const randomKey = Object.keys(objectPrices)[Math.floor(Math.random() * Object.keys(objectPrices).length)];
    val = total.toFixed(2) / objectPrices[randomKey];
    if (comparison) {
        comparison.innerText = `or nearly ${val.toFixed(1)} ${randomKey}`;
    }
}

async function displayMonthCost(){
    // Get this month's events
    const monthEvents = await getThisMonthEvents();

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

    const total = pricePerClass * (monthEvents || []).length;
    
    displayText.innerText = `${getThisMonth()} costs you:`;

    cost.innerText = `$${Number(total.toFixed(2)).toLocaleString()}`;
    
    // Get a random object from the objectPrices dict
    const randomKey = Object.keys(objectPrices)[Math.floor(Math.random() * Object.keys(objectPrices).length)];
    val = total.toFixed(2) / objectPrices[randomKey];
    if (comparison) {
        comparison.innerText = `or nearly ${val.toFixed(1)} ${randomKey}`;
    }
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

function getThisMonth() {
    const day = new Date();
    const fullMonthNames = ["January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"];
    const year = day.getFullYear();
    return `${fullMonthNames[day.getMonth()]} ${year}`;
}

document.getElementById('date').textContent = "Date: " + formatDate(new Date());

// Function to add items to the table
async function addItemsToTable() {
    const table = document.getElementById('events-table-body');
    const events = await getTodayEvents();
    if (!events) {
        return;
    }
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

function applyTimeChanges(isDay){
    var receipt = document.getElementById('targetDivReceipt');
    if(!receipt){
        return;
    }
    if(isDay){
        receipt.style.display = "block";
        displayCost();
    } else {
        receipt.style.display = "none";
        displayMonthCost();
    }
}

var mySwitch = document.getElementById('mySwitch');
if (mySwitch) {
    mySwitch.addEventListener('change', function() {
        applyTimeChanges(this.checked);
    });
}

async function initialTimeChanges(){
    var isDay = await chrome.storage.local.get(['isDay']);
    if(isDay['isDay'] == undefined){
        isDay['isDay'] = false;
    }
    applyTimeChanges(isDay['isDay']);
    var mySwitch = document.getElementById('mySwitch');
    if(!mySwitch){
        return;
    }
    mySwitch.checked = isDay['isDay'];
}

addItemsToTable();
initialTimeChanges();
displayPopupCost();
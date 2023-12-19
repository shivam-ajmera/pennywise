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



// Sample data for items
const items = [
    { qty: 2, item: "Apple", price: "$1.00" },
    { qty: 5, item: "Banana", price: "$2.00" },
    { qty: 1, item: "Cake", price: "$5.00" }
];

// Function to add items to the table
function addItemsToTable(items) {
    const table = document.getElementById('events-table-body');
    items.forEach(item => {
        let row = table.insertRow();
        let qtyCell = row.insertCell(0);
        let itemCell = row.insertCell(1);
        let priceCell = row.insertCell(2);

        qtyCell.textContent = item.qty;
        itemCell.textContent = item.item;
        priceCell.textContent = item.price;
    });
}

addItemsToTable(items);
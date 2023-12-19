const cost = document.querySelector('.dollar-value');
const comparison = document.querySelector('.comparison-value');

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

displayCost();
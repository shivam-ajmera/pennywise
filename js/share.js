// This function converts the entire document body into a canvas and then to an image
function captureEntirePageAndOpenNewTab() {
    const elements = document.getElementsByClassName('receipt-container');
    if (elements.length > 0) {
        console.log(elements[0]);
        html2canvas(elements[0]).then(canvas => {
            canvas.toBlob(function(blob) {
                const item = new ClipboardItem({ "image/png": blob });
                navigator.clipboard.write([item]);
            });
        });

        // Change button appearance to show "Copied!"
        var copyText = document.getElementById('copyText');
        var copyImage = document.querySelector('#capturePageBtn img');
        copyImage.style.display = 'none'; // Hide the copy icon
        copyText.style.display = 'block'; // Show the "Copied!" message
        // Optionally, set a timeout to revert the button after a few seconds
        setTimeout(function() {
            copyImage.style.display = 'block';
            copyText.style.display = 'none';
        },4000);
    }
}

// Add the event listener to a button with id 'capturePageBtn'
document.getElementById('capturePageBtn').addEventListener('click', captureEntirePageAndOpenNewTab);

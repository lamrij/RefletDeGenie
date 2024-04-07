// script.js
//HELLO
document.addEventListener('DOMContentLoaded', function() {
    // Send a GET request to the server to fetch the current time
    fetch('/get_time')
        .then(response => response.json())
        .then(data => {
            document.getElementById('time').textContent = 'Current Time: ' + data.time;
        })
        .catch(error => console.error('Error fetching time:', error));

    // Add event listeners to the buttons
    document.getElementById('validate').addEventListener('click', function() {
        fetch('/validate_request', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    console.log('Request validated successfully');
                } else {
                    console.error('Failed to validate request');
                }
            })
            .catch(error => console.error('Error validating request:', error));
    });

    document.getElementById('cancel').addEventListener('click', function() {
        fetch('/cancel_request', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    console.log('Request canceled successfully');
                } else {
                    console.error('Failed to cancel request');
                }
            })
            .catch(error => console.error('Error canceling request:', error));
    });
});
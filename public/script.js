let monitoringInterval;

function checkVPN() {
    fetch('/checkvpn')
        .then(response => response.json())
        .then(data => {
            const statusElement = document.getElementById('status');
            const currentIPElement = document.getElementById('currentIP');
            const monitoredIPsElement = document.getElementById('monitoredIPs');
            const rejectedIPsElement = document.getElementById('rejectedIPs');

            // Update status and current IP
            statusElement.innerText = data.message;
            currentIPElement.innerText = `Current IP: ${data.currentIP}`;

            // Update styling based on access status
            statusElement.style.color = data.blocked ? '#e74c3c' : '#2ecc71';

            // Update monitored and rejected IP lists
            monitoredIPsElement.innerHTML = data.monitoredIPs.map(ip => `<li>${ip}</li>`).join('');
            rejectedIPsElement.innerHTML = data.rejectedIPs.map(ip => `<li>${ip}</li>`).join('');
        })
        .catch(error => console.error('Error:', error));
}

// Start continuous monitoring when the Start button is clicked
function onStartClick() {
    monitoringInterval = setInterval(checkVPN, 5000);
}

// Stop continuous monitoring when the Stop button is clicked
function onStopClick() {
    clearInterval(monitoringInterval);
}

// Call checkVPN when the Check VPN button is clicked
function onCheckVPNClick() {
    checkVPN();
}

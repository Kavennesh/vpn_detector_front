const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');

// Set to store monitored and rejected IPs
const monitoredIPs = new Set();
const rejectedIPs = new Set();

app.use(express.static('public'));

app.get('/checkvpn', async (req, res) => {
    try {
        const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Log the request details
        console.log('Request received - IP:', clientIP);

        // Use an external service to get the public IP
        const publicIPResponse = await axios.get('https://api64.ipify.org?format=json');
        const publicIP = publicIPResponse.data.ip;

        // Skip VPN detection logic for loopback addresses
        if (isLoopbackAddress(clientIP)) {
            console.log('Access granted (local).');
            res.json({ currentIP: publicIP, message: 'Access granted (local).', blocked: false, monitoredIPs: Array.from(monitoredIPs), rejectedIPs: Array.from(rejectedIPs) });
            return;
        }

        // Check if the current IP matches your specific IP (replace with your IP)
        if (clientIP !== publicIP) {
            console.log('VPN detected. Access denied.');
            rejectedIPs.add(clientIP);
            res.json({ currentIP: publicIP, message: 'VPN detected. Access denied.', blocked: true, monitoredIPs: Array.from(monitoredIPs), rejectedIPs: Array.from(rejectedIPs) });
        } else {
            // Continue with your existing logic for monitored and rejected IPs
            const rejected = rejectedIPs.has(clientIP);

            if (rejected) {
                console.log('VPN detected. Access denied.');
                res.json({ currentIP: publicIP, message: 'VPN detected. Access denied.', blocked: true, monitoredIPs: Array.from(monitoredIPs), rejectedIPs: Array.from(rejectedIPs) });
            } else {
                // Continue with the rest of your logic...
                monitoredIPs.add(clientIP);
                console.log('Access granted.');
                res.json({ currentIP: publicIP, message: 'Access granted.', blocked: false, monitoredIPs: Array.from(monitoredIPs), rejectedIPs: Array.from(rejectedIPs) });
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

function isLoopbackAddress(ip) {
    // Check if the IP address is a loopback address
    return ip === '::1' || ip.startsWith('127.');
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

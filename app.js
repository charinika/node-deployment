const express = require('express');
const os = require('os');

const app = express();
const port = 3000;

// Get container hostname
const hostname = os.hostname();

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>My CI/CD App</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    text-align: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                }
                .container {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37);
                }
                h1 {
                    font-size: 2.5em;
                    margin-bottom: 20px;
                }
                .info {
                    background: rgba(255,255,255,0.2);
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .badge {
                    display: inline-block;
                    background: #4CAF50;
                    color: white;
                    padding: 8px 15px;
                    border-radius: 20px;
                    margin: 5px;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 0.9em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>CI/CD Pipeline Demo</h1>
                <div class="info">
                    <h2>Application Information</h2>
                    <div class="badge">Pod: ${hostname}</div>
                    <div class="badge">Version: ${process.env.BUILD_VERSION || 'latest'}</div>
                    <div class="badge">Node: ${process.version}</div>
                </div>
                <p>This app was deployed using Jenkins CI/CD pipeline!</p>
                <p> Running in Kubernetes (Minikube)</p>
                <div class="footer">
                    <small>Deployment Time: ${new Date().toLocaleString()}</small>
                </div>
            </div>
        </body>
        </html>
    `);
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        hostname: hostname,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/info', (req, res) => {
    res.json({
        app: 'CI/CD Demo App',
        version: process.env.BUILD_VERSION || 'latest',
        hostname: hostname,
        platform: os.platform(),
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
    console.log(`Health check at http://localhost:${port}/health`);
    console.log(`API info at http://localhost:${port}/api/info`);
});
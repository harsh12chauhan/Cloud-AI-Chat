
const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch(
            'http://127.0.0.1:11434/api/chat',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...req.body,
                    stream: true
                })
            }
        );

        if (!response.ok) {
            return res.status(response.status)
                .send(await response.text());
        }

        res.setHeader('Content-Type', 'application/x-ndjson');
        res.setHeader('Cache-Control', 'no-cache, no-transform');

        for await (const chunk of response.body) {
            res.write(chunk);
        }

        res.end();

    } catch (error) {
        console.error(error);

        if (!res.headersSent) {
            res.status(502).json({
                error: error.message
            });
        } else {
            res.end();
        }
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend running on port ${PORT}`);
});


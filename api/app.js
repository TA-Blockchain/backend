const PORT = 3000;
const HOST = 'http://127.0.0.1'
const express = require('express');
const cors = require('cors')
const app = express();

const router = require('./routes/index.js');

app.use(express.json())
app.use(cors())
app.use('/', router)

app.get('/test', (req, res) => res.send('Hello World!'));
app.post('/test-post', async(req, res) => {
    console.log('Received data:', req.body);
});

app.listen(PORT, () => console.log(`Express app running on host ${HOST}:${PORT}`));
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 80;

app.use(cors({ origin: '*' }));

const v2 = require('./v2');

app.get('/', v2);
app.get('/v2', v2);

app.listen(port, () => console.log(`[server] up :${port}`));

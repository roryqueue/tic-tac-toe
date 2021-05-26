
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes');

const PORT = 8080;

const app = express();

// register middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('', router);

// start
app.listen(PORT);
console.log('listening on ' + PORT);

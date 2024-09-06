//index.js
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./userRouter')

const app = express();

app.use(bodyParser.json());

app.use('/', userRouter);

module.exports = app;
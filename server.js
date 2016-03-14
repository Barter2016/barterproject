'use strict';

var path = require('path');
var express = require('express');
var AWS = require('aws-sdk');

var app = express();

app.use(express.static(path.resolve(__dirname, 'client')));

app.listen(process.env.PORT, process.env.IP);

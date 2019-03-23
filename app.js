'use strict';

const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const manifest = require('./dist/manifest.json');
var serveStatic = require('serve-static');

app.use('/dist', express.static(__dirname + '/dist', {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    index: false,
    maxAge: '1y',
    redirect: false
})).use(cookieParser());

const runtimeContent = fs.readFileSync(__dirname + manifest['runtime~app.js'], 'utf8');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(4000, function () {
   console.log('listening on port 4000!');
});

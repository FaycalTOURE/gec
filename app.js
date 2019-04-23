'use strict';

const _ = require('lodash');
const exphbs = require('express-handlebars');
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const manifest = require('./dist/manifest.json');
var serveStatic = require('serve-static');

var hbs = exphbs.create({defaultLayout: 'main'});

app.set('views', __dirname + '/views');
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

var renderViewNoOverride = function (res, view, params) {
    params = _.defaultsDeep(params, {
        config: config,
        partialHeader: 'not-crawlable/header',
        partialFooter: 'not-crawlable/footer',
        brepRates : B_REPUATION_RATES,
        favicon: 'favicon',
        layout: 'main',
        app: 'b2b',
        assets: {style: manifest['landing-site/css/style.css']}
    });

    res.render(view, params);
};

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
    res.render('home', {layout: false});
});

app.listen(4000, function () {
   console.log('listening on port 4000!');
});

'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
require('dotenv').config();
let Schema = mongoose.Schema;

mongoose.connect(process.env.MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true });

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
  
// ShortURL Schema
let shortURLSchema = new Schema({
    original: String,
    shortend: Number
})

let ShortURL = mongoose.model('ShortURL', shortURLSchema);

const getShortUrl = url => {
    let shortUrl = 0;
    ShortURL.find({original: url}, (err, urlDoc) => {
        // need to set shortUrl to current shortUrl
        console.log('URL DOC: ', typeof urlDoc);
        if(Object.entries(urlDoc).length !== 0) {
            console.log('Found!');
            return shortUrl + 1;
        } else {
            console.log('NOT Found!');
            let newUrl = new ShortURL({
                original: url,
                shortend: shortUrl
            });
            newUrl.save((err, data) => {
                err ? console.log(err) : console.log('Created: ', data)
            });
        }    
        return err ? console.log(err) : url;
    }).limit(1);
    console.log(shortUrl);
    return 0;
}

// your first API endpoint... 
app.post('/api/shorturl/new', (req, res) => {
    const url = req.body.url;
    const invalidUrl = {error: 'Invalid URL'};

    // Check if url is valid
    if(url.includes('https://') || url.includes('http://')) {
        const invalidHostname = {error: 'Invalid Hostname'};
        const hostName = url.slice(url.indexOf('/') + 2);
        let urlObj = {
            original_url: String,
            short_url: Number
        }
        let ipRegex = /^[23]./

        dns.lookup(hostName, (err, address, family) => {

            // Check if the ip starts with 23
            if(ipRegex.test(address)) {
                console.log(address);
                res.json(invalidHostname);
            } else {
                getShortUrl(url);
                urlObj.original_url = url;
                urlObj.short_url = 1;
                res.json(urlObj);
            }
            err ? console.log(err) : console.log('Look Up Success');
            family ? console.log('Family: ', family) : urlObj = invalidHostname; 
        })
    }
});


app.listen(port, function () {
  console.log('Node.js listening on port: ' + port);
});

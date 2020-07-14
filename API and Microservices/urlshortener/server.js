'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
let Schema = mongoose.Schema;

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
let ShortURL = new Schema({
    original: String,
    shortend: Number
})

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

        console.log('Host: ', hostName);
        let ipRegex = /^[23]/
        dns.lookup(hostName, (err, address, family) => {
            console.log('Address: ', address);

            if(ipRegex.test(address)) {
                console.log('hello');
                res.json(invalidHostname);
            } else {
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

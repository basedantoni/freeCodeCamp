'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dns = require('dns');
require('dotenv').config();
let Schema = mongoose.Schema;

mongoose
    .connect(process.env.MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to Mongo'))
    .catch(err => console.log(err))

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
    original_url: String,
    short_url: Number
})

let sequenceSchema = new Schema({
    _id: String,
    sequence_val: Number 
})

// Create a ShortUrl Model
let ShortURL = mongoose.model('ShortURL', shortURLSchema);
let Sequence = mongoose.model('Sequence', sequenceSchema);

// let newSequence = new Sequence({
//     _id: 'urlId',
//     sequence_val: 0
// })

//newSequence.save().then(seq => console.log(seq)).catch(err => console.log(err))

// This will be used to check if it is a valid url
const protcolRegex = /(https?:\/\/)/

// Uses protocolRegex to parse out the hostname
const getHostname = url => {
    let splitUrl = url.split(protcolRegex);
    return splitUrl[2];
}

// your first API endpoint... 
app.post('/api/shorturl/new', (req, res) => {
    const url = req.body.url;
    const invalidUrl = {error: 'Invalid URL'};

    // Check if url is valid
    if(protcolRegex.test(url)) {
        const invalidHostname = {error: 'Invalid Hostname'};
        const hostName = getHostname(url);
        let urlObj = {
            original_url: '',
            short_url: 0
        }
        let x = 0
        let ipRegex = /^[23]./
        dns.lookup(hostName, (err, address, family) => {
            // Check if the ip starts with 23
            if(x /* ipRegex.test(address) */) {
                res.json(invalidHostname);
            } else {
                ShortURL
                    .find({original_url: url})
                    .then(shortUrl => {
                        let numOfMatches = Object.entries(shortUrl).length;
                        if(!numOfMatches) {
                            Sequence.findByIdAndUpdate({_id: 'urlId'}, {$inc: {sequence_val: 1}}, {useFindAndModify: false})
                                .then(sequenceDoc => {
                                    let newUrl = new ShortURL({
                                        original_url: url,
                                        short_url: sequenceDoc.sequence_val + 1
                                    })
                                    newUrl
                                        .save()
                                        .then(url => {
                                            urlObj.original_url = url.original_url
                                            urlObj.short_url = url.short_url
                                            res.json(urlObj)
                                        })
                                        .catch(err => console.log(err))
                                })
                                .catch(err => console.log(err))
                        } else {
                            urlObj.original_url = shortUrl[0].original_url
                            urlObj.short_url = shortUrl[0].short_url
                            res.json(urlObj)
                        }
                    })
            }
            err ? console.log(err) : console.log('Look Up Success');
        })
    } else {
        res.json(invalidUrl);
    }
});

app.get('/api/shorturl/:num', (req, res) => {
    const shortUrl = parseInt(req.params.num);
    console.log(shortUrl)
    if(!shortUrl && shortUrl !== 0) {
        res.json({error: 'Wrong format'})
    } else {
        ShortURL.find({short_url: shortUrl})
            .then(shortUrl => {
                let numOfMatches = Object.entries(shortUrl).length;
                if(!numOfMatches) {
                    res.json({error: 'No short URL found for the given input'})
                } else {
                    res.redirect(shortUrl[0].original_url)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
})


app.listen(port, function () {
  console.log('Node.js listening on port: ' + port);
});

// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/timestamp/:date_string?", function (req, res) {

    let dateString = req.params.date_string;
    let date = new Date(dateString).setUTCHours(0); 
    let utcDate = new Date(date).toUTCString();
    let dateObj = {
        unix: Number,
        utc: String
    }

    // Check if date is empty
    if(!dateString) {
        console.log('Date is empty');
        let newDate = Date.now();
        let utcDate = new Date(newDate);
        dateObj.unix = newDate;
        dateObj.utc = new Date(newDate).toUTCString();
    }

    // Check if date cannot be parsed
    if(!Date.parse(dateString)) {
        dateObj = { error: 'Invalid Date' };
    }

    // Check if date is in unix or ISO format 
    if(dateString.indexOf('-') > 0 && parseInt(dateString)) {
        console.log('Date is in ISO format');
        dateObj.unix = date;
        dateObj.utc = utcDate;
        delete dateObj.error;
    } 
    else if(parseInt(dateString) || parseInt(dateString) === 0) {
        console.log('Else Statement')
        dateObj.unix = parseInt(dateString);
        dateObj.utc = new Date(parseInt(dateString)).toUTCString();
        delete dateObj.error;
    }

    res.json(dateObj);
})

// listen for requests :)
var listener = app.listen(3000 || process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

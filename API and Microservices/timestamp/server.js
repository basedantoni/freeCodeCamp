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

    let date = req.params.date_string;

    console.log('Date Parsed: ', Date.parse(date));
    // Check if date is empty
    if(date === '') {
        console.log('Date is empty');
        let newDate = Date.now();
        let utcDate = new Date(newDate);
        res.json({unix: newDate, utc: utcDate.toUTCString()});
    }

    // Check if date can be parsed
    else if(Date.parse(date) !== Number && !date.indexOf('-')) {
        console.log('Date can\'t be parsed');
        res.json({error: 'Invalid Date'})
    } 
    else if(Date.parse(date) >= 0 || parseInt(date)){
        console.log('Normal Date');
        res.json({unix: date, utc: new Date(date).toUTCString()})
    }
    else if(Date.parse(date) < 0) {
        console.log('Parsed Int', parseInt(date))
        res.json({unix: date, utc: new Date(parseInt(date)).toUTCString()})
    }
})

// listen for requests :)
var listener = app.listen(3000 || process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

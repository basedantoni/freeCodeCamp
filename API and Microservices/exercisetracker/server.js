require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

mongoose
    .connect(process.env.MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to Mongo'))
    .catch(err => console.log(err))

app.use(cors())

app.use(express.json({extended: false}));


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const userSchema = new Schema( {
  username: String
})

const User = mongoose.model('user', userSchema);

// @route POST api/exercise/new-user
// @desc Register User
// @access Public
app.post('/api/exercise/new-user', (req, res) => {
  let newUser = User({
    username: req.body.username
  })

  newUser.save().then(doc => res.json(doc)).catch(err => console.log(err))
})

// @route GET api/exercise/users
// @desc Get Users
// @access Public
app.get('/api/exercise/users', (req, res) => {
  
})

// @route POST api/exercise/add
// @desc Register User
// @access Public
app.post('/api/exercise/add', (req, res) => {

})

// @route GET api/exercise/log
// @desc Get Exercise Log
// @access Public
app.get('/api/exercise/log', (req, res) => {
  
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

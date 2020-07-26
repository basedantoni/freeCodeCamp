require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose');
const { urlencoded } = require('body-parser');
const Schema = mongoose.Schema;

mongoose
    .connect(process.env.MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to Mongo'))
    .catch(err => console.log(err))

app.use(cors())

// body-parser
app.use(express.json({extended: false}));

// Using querystring
app.use(urlencoded({extended: false}));

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new Schema( {
  username: String,
  exercises: [Object]
})

const User = mongoose.model('user', userSchema);

// @route POST api/exercise/new-user
// @desc Register User
// @access Public
app.post('/api/exercise/new-user', (req, res) => {
  const username = req.body.username

  User.find({username: username}).then(doc => {
    // Check if doc exists
    if(doc.length) {
      res.send('Username already taken')
    } else {
      let newUser = User({
        username: username
      })
    
      // Save new user
      newUser
        .save()
        .then(doc => {
          res.json({
            username: doc.username,
            _id: doc._id
          })
        })
        .catch(err => console.log(err))
    }
  })
})

// @route GET api/exercise/users
// @desc Get All Users
// @access Public
app.get('/api/exercise/users', (req, res) => {
  User.find({}).then(docs => res.json(docs)).catch(err => console.log(err))
})

// @route POST api/exercise/add
// @desc Register User
// @access Public
app.post('/api/exercise/add', (req, res) => {
  let { userId, description, duration, date } = req.body;
  let exerciseObj;

  // If date is empty
  if(!date) {
    console.log('NO DATE')
    const newDate = Date.now();
    const utcDate = new Date(newDate);
    const dateString = utcDate.toDateString();

    User.findOne({_id: userId}, (err, doc) => {
      if(err) {
        console.log(err)
        res.send('UserId doesn\'t exist')
      } else {
        req.body.date = dateString;
        exerciseObj = {
          description: description,
          duration: duration,
          date: dateString
        }
        doc.exercises.push(exerciseObj);

        doc
          .save()
          .then(doc => res.json({
            _id: doc._id,
            username: doc.username,
            date: dateString,
            duration: duration,
            description: description
          }))
          .catch(err => console.log(err))
      }
    })
  } else {
    console.log('YES DATE')
    let utcDate = new Date(date);
    utcDate.setDate(utcDate.getDate())
    const dateString = utcDate.toDateString();

    User.findOne({_id: userId}, (err, doc) => {
      if(err) {
        console.log(err)
        res.send('UserId doesn\'t exist')
      } else {
        exerciseObj = {
          description: description,
          duration: duration,
          date: dateString
        }
        doc.exercises.push(exerciseObj);
        doc
          .save()
          .then(doc => res.json({
            _id: doc._id,
            username: doc.username,
            date: dateString,
            duration: duration,
            description: description
          }))
          .catch(err => console.log(err))
      }
    })
  }
})

// @route GET api/exercise/log
// @desc Get Exercise Log
// @access Public
app.post('/api/exercise/log', (req, res) => {
  const { userId, from, to, limit } = req.body

  User
    .findOne({_id: userId})
    .exec((err, doc) => {
      let exerciseTotal = doc.exercises.length;
      let userObj = {};
      userObj.total = exerciseTotal;
      userObj._id = doc._id;
      userObj.username = doc.username;
      userObj.exercises = doc.exercises;

      if(err) {
        console.log(err)
      }
      else if(from && to && limit) {
        let fromParsed = Date.parse(from);
        let toParsed = Date.parse(to);

        // array of exercise dates
        let newExerciseArr = userObj.exercises.filter(exercise => {
          return Date.parse(exercise.date) >= fromParsed && Date.parse(exercise.date) <= toParsed;
        })
        let limitedExercises = newExerciseArr.slice(0, limit);
        userObj.exercises = limitedExercises;
        userObj.total = limitedExercises.length;
        res.json(userObj)
      } 
      else if(from && to) {
        let fromParsed = Date.parse(from);
        let toParsed = Date.parse(to);

        // array of exercise dates
        let newExerciseArr = userObj.exercises.filter(exercise => {
          return Date.parse(exercise.date) >= fromParsed && Date.parse(exercise.date) <= toParsed;
        })

        userObj.exercises = newExerciseArr;
        userObj.total = newExerciseArr.length;
        res.json(userObj);
      }
      else if(from && limit) {
        let fromParsed = Date.parse(from);

        // array of exercise dates
        let newExerciseArr = userObj.exercises
          .sort((a, b) => (a.date < b.date) ? 1 : -1)
          .filter(exercise => {
            return Date.parse(exercise.date) >= fromParsed;
        })
        let limitedExercises = newExerciseArr.slice(0, limit);
        userObj.exercises = limitedExercises;
        userObj.total = limitedExercises.length;
        res.json(userObj)
      } 
      else if(to && limit) {
        let toParsed = Date.parse(to);

        // array of exercise dates
        let newExerciseArr = userObj.exercises
          .sort((a, b) => (a.date < b.date) ? 1 : -1)
          .filter(exercise => {
            return Date.parse(exercise.date) <= toParsed;
        })
        let limitedExercises = newExerciseArr.slice(0, limit);
        userObj.exercises = limitedExercises;
        userObj.total = limitedExercises.length;
        res.json(userObj)
      } 
      else if(from) {
        let fromParsed = Date.parse(from);

        // array of exercise dates
        let newExerciseArr = userObj.exercises
          .sort((a, b) => (a.date < b.date) ? 1 : -1)
          .filter(exercise => {
            return Date.parse(exercise.date) >= fromParsed;
        })
        userObj.exercises = newExerciseArr;
        userObj.total = newExerciseArr.length;
        res.json(userObj)
      } 
      else if(to) {
        let toParsed = Date.parse(to);

        // array of exercise dates
        let newExerciseArr = userObj.exercises
          .sort((a, b) => (a.date < b.date) ? 1 : -1)
          .filter(exercise => {
            return Date.parse(exercise.date) <= toParsed;
        })
        userObj.exercises = newExerciseArr;
        userObj.total = newExerciseArr.length;
        res.json(userObj)
      } 
      else if(limit) {
        let limitedExercises = userObj.exercises.slice(0, limit);
        userObj.exercises = limitedExercises;
        userObj.total = limitedExercises.length;
        res.json(userObj)
      } else {
        res.json(userObj);
      }
  })
})


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage
  console.log(err)

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

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

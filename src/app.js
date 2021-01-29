require('dotenv').config()

const DaysService = require('./days-service')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')

// const foldersRouter = require('./folders/folders-router')
// const notesRouter = require('./notes/notes-router')
const daysRouter = require('./days/days-router')
const dishesRouter = require('./dishes/dishes-router')
const assignmentsRouter = require('./assignments/assignments-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

// app.use('/folders', foldersRouter)
// app.use('/notes', notesRouter)
// app.use('/days', daysRouter)
app.use('/dishes', dishesRouter)
app.use('/assignments', assignmentsRouter)

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.get('/days', (req, res, next) => {
  const knexInstance = req.app.get('db')
  DaysService.getAllDays(knexInstance)
  .then(days => {
    res.json(days.map(serializeDay))
  })
  .catch(next)
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
    })

module.exports = app
const express = require('express')
const DaysService = require('./days-service')

const daysRouter = express.Router()

const serializeDay = day => ({
  dayId: day.id,
  dayName: day.day_name
})

daysRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    DaysService.getAllDays(knexInstance)
      .then(days => {
        res.json(days.map(serializeDay))
      })
      .catch(next)
  })
  
daysRouter
  .route('/:id')
  .all((req, res, next) => {
    DaysService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(day => {
        if (!day) {
          return res.status(404).json({
            error: { message: `Day doesn't exist` }
          })
        }
        res.day = day
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeDay(res.day))
  })

module.exports = daysRouter
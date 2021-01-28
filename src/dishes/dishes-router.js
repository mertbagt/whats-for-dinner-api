const path = require('path')
const express = require('express')
const xss = require('xss')
const DishesService = require('./dishes-service')

const dishesRouter = express.Router()
const jsonParser = express.json()

const serializeDish = dish => ({
  dishId: dish.id,
  dishCategory: xss(dish.dish_category),
  dishName: xss(dish.dish_name),
})

dishesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    DishesService.getAllDishes(knexInstance)
      .then(dishes => {
        res.json(dishes.map(serializeDish))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { dish_category, dish_name } = req.body
    const newDish = { dish_category, dish_name }

    for (const [key, value] of Object.entries(newDish)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    DishesService.insertDish(
      req.app.get('db'),
      newDish
    )
      .then(dish => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${dish.id}`))
          .json(serializeDish(dish))
      })
      .catch(next)
  })

dishesRouter
  .route('/:dish_id')
  .all((req, res, next) => {
    DishesService.getById(
      req.app.get('db'),
      req.params.dish_id
    )
      .then(dish => {
        if (!dish) {
          return res.status(404).json({
            error: { message: `Dish doesn't exist` }
          })
        }
        res.dish = dish
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeDish(res.dish))
  })
  .delete((req, res, next) => {
    DishesService.deleteDish(
      req.app.get('db'),
      req.params.dish_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { dish_category, dish_name } = req.body
    const dishToUpdate = { dish_category, dish_name }

    const numberOfValues = Object.values(dishToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'Dish Category' or 'Dish Name'`
        }
      })

    DishesService.updateDish(
      req.app.get('db'),
      req.params.dish_id,
      dishToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = dishesRouter
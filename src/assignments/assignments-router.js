const path = require('path')
const express = require('express')
const xss = require('xss')
const AssignmentsService = require('./assignments-service')

const assignmentsRouter = express.Router()
const jsonParser = express.json()

const serializeAssignment = assignment => ({
  assignmentId: assignment.id,
  dayId: assignment.day_id,
  dishId: assignment.dish_id,
})

assignmentsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    AssignmentsService.getAllAssignments(knexInstance)
      .then(assignments => {
        res.json(assignments.map(serializeAssignment))
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    AssignmentsService.deleteAllAssignments(
      req.app.get('db'),
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { day_id, dish_id } = req.body
    const newAssignment = { day_id, dish_id }

    for (const [key, value] of Object.entries(newAssignment)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    AssignmentsService.insertAssignment(
      req.app.get('db'),
      newAssignment
    )
      .then(assignment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${assignment.id}`))
          .json(serializeAssignment(assignment))
      })
      .catch(next)
  })

  assignmentsRouter
  .route('/:assignment_id')
  .all((req, res, next) => {
    AssignmentsService.getById(
      req.app.get('db'),
      req.params.assignment_id
    )
      .then(assignment => {
        if (!assignment) {
          return res.status(404).json({
            error: { message: `Assignment doesn't exist` }
          })
        }
        res.assignment = assignment
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeAssignment(res.assignment))
  })
  .delete((req, res, next) => {
    AssignmentsService.deleteAssignment(
      req.app.get('db'),
      req.params.assignment_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { day_id, dish_id } = req.body
    const assignmentToUpdate = { day_id, dish_id }

    const numberOfValues = Object.values(assignmentToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name', 'folderID', or 'content'`
        }
      })

      AssignmentsService.updateAssignment(
      req.app.get('db'),
      req.params.assignment_id,
      assignmentToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = assignmentsRouter
const AssignmentsService = {
    getAllAssignments(knex) {
      return knex.select('*').from('wfd_assignments')
    },
  
    insertAssignment(knex, newAssignment) {
      return knex
        .insert(newAssignment)
        .into('wfd_assignments')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('wfd_assignments')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteAssignment(knex, id) {
      return knex('wfd_assignments')
        .where({ id })
        .delete()
    },
  
    deleteAllAssignments(knex) {
      return knex.delete('*').from('wfd_assignments')
    },

    updateAssignment(knex, id, newAssignmentFields) {
      return knex('wfd_assignments')
        .where({ id })
        .update(newAssignmentFields)
    },
  }
  
  module.exports = AssignmentsService
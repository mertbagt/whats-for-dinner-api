const DaysService = {
    getAllDays(knex) {
      return knex.select('*').from('wfd_days')
    },
  
    insertDay(knex, newDay) {
      return knex
        .insert(newDay)
        .into('wfd_days')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('wfd_days')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteDay(knex, id) {
      return knex('wfd_days')
        .where({ id })
        .delete()
    },
  
    updateDay(knex, id, newDayFields) {
      return knex('wfd_days')
        .where({ id })
        .update(newDayFields)
    },
  }
  
  module.exports = DaysService
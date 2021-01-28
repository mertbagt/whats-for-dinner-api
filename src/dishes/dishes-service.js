const DishesService = {
    getAllDishes(knex) {
      return knex.select('*').from('wfd_dishes')
    },
  
    insertDish(knex, newDish) {
      return knex
        .insert(newDish)
        .into('wfd_dishes')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('wfd_dishes')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteDish(knex, id) {
      return knex('wfd_dishes')
        .where({ id })
        .delete()
    },
  
    updateDish(knex, id, newDishFields) {
      return knex('wfd_dishes')
        .where({ id })
        .update(newDishFields)
    },
  }
  
  module.exports = DishesService
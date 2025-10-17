const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

async function getClassificationById(id) {
  return await pool.query(
    `SELECT * FROM public.classification WHERE classification_id = ${id}`
  );
}

module.exports = { 
  getClassifications,
  getClassificationById
};

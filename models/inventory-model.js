const pool = require("../database/");
const inventoryModel = {};

/* *********************************************** *
 *  Get all classification data
 * *********************************************** */
inventoryModel.getClassifications = async function () {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
};

/* *********************************************** *
 *  Get all inventory items and
 *  classification_name by classification_id
 * *********************************************** */
inventoryModel.getInventoryByClassificationId = async function (
  classification_id
) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
};

/* *********************************************** *
 *  Get all inventory items and
 *  classification_name by classification_id
 * *********************************************** */
inventoryModel.getInventoryByInvId = async function (inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM inventory 
      WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error(`getInventoryById error ${error}`);
  }
};

/* *********************************************** *
 *  Check if classification id exists
 * *********************************************** */
inventoryModel.checkClassificationId = async function (classificationId) {
  try {
    const data = await pool.query(
      `SELECT * FROM classification
      WHERE classification_id = ${classificationId};`
    );
    return data.rows
  } catch (error) {
    console.error(`checkClassification error ${error}`);
  }
};

module.exports = inventoryModel;

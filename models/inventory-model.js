const pool = require("../database/");
const inventoryModel = {};

/* *********************************************** *
 *  SELECT Functions
 * *********************************************** */
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

inventoryModel.getInventoryItemByColumns = async function (
  inv_make,
  inv_model,
  inv_color,
  inv_description,
  inv_price,
  inv_year,
  inv_miles
) {
  const sql = "SELECT * FROM inventory WHERE inv_make = $1 AND inv_model = $2 AND inv_color = $3 AND inv_description = $4 AND inv_price = $5 AND inv_year = $6 AND inv_miles = $7;";
  try {
    let yearString = inv_year.toString();
    let getVehicle = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_color,
      inv_description,
      inv_price,
      yearString,
      inv_miles
    ]);
    let result = getVehicle.rows.length;
    return result;
  } catch (error) {
    console.error("getInventoryItemByColumns error " + error);
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
 *  Validation Functions
 * *********************************************** */
/* *********************************************** *
 *  Check if classification id exists
 * *********************************************** */
inventoryModel.checkClassificationId = async function (classificationId) {
  try {
    const data = await pool.query(
      `SELECT * FROM classification
      WHERE classification_id = ${classificationId};`
    );
    return data.rows;
  } catch (error) {
    console.error(`inventory-model.checkClassification error ${error}`);
  }
};

/* *********************************************** *
 *  INSERT Functions
 * *********************************************** */
/* *********************************************** *
 *  Add new inventory
 * *********************************************** */
inventoryModel.addNewInventory = async function (
  classification_id,
  inv_make,
  inv_model,
  inv_color,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles
) {
  try {
    const sql =
      "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_color, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);";

    await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_color,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
    ]);

    let result = inventoryModel.getInventoryItemByColumns(
      inv_make,
      inv_model,
      inv_color,
      inv_description,
      inv_price,
      inv_year,
      inv_miles
    );
    
    if (result != 0 ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error.message;
  }
};

module.exports = inventoryModel;

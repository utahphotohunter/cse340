const pool = require("../database/");
const inventoryModel = {};

/* *********************************************** *
 *  Classification Functions
 * *********************************************** */
// Get all classification data
inventoryModel.getClassifications = async function () {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
};

// Check if classification_id exists
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

// Get classification by classification_name
inventoryModel.getClassificationByName = async function (classification_name) {
  const sql = "SELECT * FROM classification WHERE classification_name = $1;";
  try {
    let getClassification = await pool.query(sql, [classification_name]);
    let result = getClassification.rows;
    return result;
  } catch (error) {
    console.error("getInventoryItemByColumns error " + error);
  }
};

// Add new classification
inventoryModel.addNewClassification = async function (classification_name) {
  let response = [];
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1);";

    await pool.query(sql, [classification_name]);

    let result = await inventoryModel.getClassificationByName(
      classification_name
    );

    if (result.length != 0) {
      response.push(true);
      response.push("");
    } else {
      response.push(false);
      response.push("");
    }
  } catch (error) {
    response.push(false);
    response.push(error.message);
  } finally {
    return response;
  }
};

/* *********************************************** *
 *  Inventory Functions
 * *********************************************** */
// Get all inventory items and classification_name by classification_id
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

//Get single inventory by inv_id
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

// Get single inventory based on make, model, color, description, price, year, and miles
inventoryModel.getInventoryItemByColumns = async function (
  inv_make,
  inv_model,
  inv_color,
  inv_description,
  inv_price,
  inv_year,
  inv_miles
) {
  const sql =
    "SELECT * FROM inventory WHERE inv_make = $1 AND inv_model = $2 AND inv_color = $3 AND inv_description = $4 AND inv_price = $5 AND inv_year = $6 AND inv_miles = $7;";
  try {
    let yearString = inv_year.toString();
    let getVehicle = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_color,
      inv_description,
      inv_price,
      yearString,
      inv_miles,
    ]);
    let result = getVehicle.rows;
    return result;
  } catch (error) {
    console.error("getInventoryItemByColumns error " + error);
  }
};

// Add new inventory
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
  let response = [];
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

    if (result.length != 0) {
      response.push(true);
      response.push("");
    } else {
      response.push(false);
      response.push("");
    }
  } catch (error) {
    response.push(false);
    response.push(error.message);
  } finally {
    return response;
  }
};

module.exports = inventoryModel;

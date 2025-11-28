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
  let response;
  try {
    const sql = `INSERT INTO classification (classification_name) VALUES ($1) RETURNING classification_id;`;
    let addClassificationAndConfirm = await pool.query(sql, [
      classification_name,
    ]);
    let result = addClassificationAndConfirm.rows;
    if (result.length != 0) {
      response = "";
    } else {
      response = `Sorry, the addition of "${classification_name}" to the classification list has failed. Please try again.`;
      console.log("=============================================");
      console.log(
        "Error at inventory-model.addNewClassification: -- Failed to add classification"
      );
      console.log("=============================================");
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at inventory-model.addNewClassification: -- ${error}`);
    console.log("=============================================");
    response = `Sorry, the addition of "${classification_name}" to the classification list has failed. Please try again.`;
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
  let response;
  try {
    const sql =
      "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_color, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id;";

    let addVehicleAndConfirm = await pool.query(sql, [
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
    const result = addVehicleAndConfirm.rows;
    if (result.length != 0) {
      response = "";
    } else {
      response = `Sorry, the addition of your "${inv_year} ${inv_make} ${inv_model}" to the inventory has failed. Please try again.`;
      console.log("=============================================");
      console.log(
        "Error at inventory-model.addNewInventory: -- Failed to add inventory."
      );
      console.log("=============================================");
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at inventory-model.addNewInventory: -- ${error}`);
    console.log("=============================================");
    response = `Sorry, the addition of your "${inv_year} ${inv_make} ${inv_model}" to the inventory has failed. Please try again.`;
  } finally {
    return response;
  }
};

// Update inventory
inventoryModel.updateInventory = async function (
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
  inv_id
) {
  let response;
  try {
    const sql =
      "UPDATE inventory SET classification_id = $1, inv_make = $2, inv_model = $3, inv_color = $4, inv_description = $5, inv_image = $6, inv_thumbnail = $7, inv_price = $8, inv_year = $9, inv_miles = $10 WHERE inv_id = $11 RETURNING inv_id;";

    let addVehicleAndConfirm = await pool.query(sql, [
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
      inv_id
    ]);
    const result = addVehicleAndConfirm.rows;
    if (result.length != 0) {
      response = "";
    } else {
      response = `Sorry, the update of your "${inv_year} ${inv_make} ${inv_model}" to the inventory has failed. Please try again.`;
      console.log("=============================================");
      console.log(
        "Error at inventory-model.updateInventory: -- Failed to update inventory."
      );
      console.log("=============================================");
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at inventory-model.updateInventory: -- ${error}`);
    console.log("=============================================");
    response = `Sorry, the update of your "${inv_year} ${inv_make} ${inv_model}" to the inventory has failed. Please try again.`;
  } finally {
    return response;
  }
};

// Update inventory
inventoryModel.deleteInventory = async function (
  inv_id
) {
  let response;
  try {
    const sql =
      "DELETE FROM inventory WHERE inv_id = $1 RETURNING inv_id;";

    let deleteVehicleAndConfirm = await pool.query(sql, [
      inv_id
    ]);
    const result = deleteVehicleAndConfirm.rows;
    if (result.length != 0) {
      response = "";
    } else {
      response = `Sorry, the deletion of your "${inv_year} ${inv_make} ${inv_model}" from the inventory has failed. Please try again.`;
      console.log("=============================================");
      console.log(
        "Error at inventory-model.deleteInventory: -- Failed to delete inventory."
      );
      console.log("=============================================");
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at inventory-model.deleteInventory: -- ${error}`);
    console.log("=============================================");
    response = `Sorry, the deletion of your "${inv_year} ${inv_make} ${inv_model}" from the inventory has failed. Please try again.`;
  } finally {
    return response;
  }
};

module.exports = inventoryModel;

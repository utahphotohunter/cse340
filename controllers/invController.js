const { render } = require("ejs");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const manager = require("../utilities/management");
const inventoryModel = require("../models/inventory-model");

const inventoryController = {};

/* *********************************************** *
 *  Build management view
 * *********************************************** */
inventoryController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const managerOptions = await manager.buildManagement();
  res.render("./inventory/management", {
    title: "Manage Site",
    nav,
    managerOptions,
  });
};

/* *********************************************** *
 *  Classification Functions
 * *********************************************** */
/* *********************************************** *
 *  Build classification view with
 *  classification id
 * *********************************************** */
inventoryController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* *********************************************** *
 *  Build add classification view
 * *********************************************** */
inventoryController.buildClassificationManager = async function (
  req,
  res,
  next
) {
  let nav = await utilities.getNav();
  let classManager = await manager.buildClassificationForm();
  res.render("./inventory/add-classification", {
    title: "Manage Classifications",
    nav,
    classManager,
  });
};

/* *********************************************** *
 *  Process adding classification
 * *********************************************** */
inventoryController.addNewClassification = async function (req, res) {
  const { classification_name } = req.body;
  const addClassResult = await inventoryModel.addNewClassification(
    classification_name
  );

  let nav = await utilities.getNav();
  if (addClassResult[0] == true) {
    req.flash(
      "notice",
      `Success! ${classification_name} has been added to the classification list.`
    );
    const managerOptions = await manager.buildManagement();
    res.render("./inventory/management", {
      title: "Manage Site",
      nav,
      managerOptions,
    });
  } else {
    req.flash(
      "notice",
      `Sorry, the addition of ${classification_name} to the classification list has failed.`
    );
    res.status(501);
    if (addInvResult[2] != "") {
      console.log(
        `inventory-model addNewClassification error: ${addInvResult[2]}`
      );
    } else {
      console.log("inventory-model addNewClassification error: unknown");
    }
    let classManager = await manager.buildClassificationForm();
    res.render("inventory/add-classification", {
      errors: null,
      title: "Manage Classifications",
      nav,
      classManager,
    });
  }
};

/* *********************************************** *
 *  Inventory Functions
 * *********************************************** */
/* *********************************************** *
 *  Build detail view w/ inventory id
 * *********************************************** */
inventoryController.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const data = await invModel.getInventoryByInvId(inv_id);
  let nav = await utilities.getNav();
  let d = data[0];
  res.render("./inventory/detail", {
    title: `${d.inv_year} ${d.inv_make} ${d.inv_model}`,
    nav,
    d,
  });
};
/* *********************************************** *
 *  Build add inventory view
 * *********************************************** */
inventoryController.buildInventoryManager = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await manager.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Manage Inventory",
    nav,
    classificationList,
    errors: null,
  });
};

/* *********************************************** *
 *  Process adding inventory
 * *********************************************** */
inventoryController.addNewInventory = async function (req, res) {
  const {
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
  } = req.body;

  const addInvResult = await inventoryModel.addNewInventory(
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
  );

  let nav = await utilities.getNav();
  if (addInvResult[0] == true) {
    req.flash(
      "notice",
      `Success! Your ${inv_year} ${inv_make} ${inv_model} has been added to the inventory.`
    );
    const managerOptions = await manager.buildManagement();
    res.render("./inventory/management", {
      title: "Manage Site",
      nav,
      managerOptions,
    });
  } else {
    req.flash(
      "notice",
      `Sorry, the addition of your ${inv_year} ${inv_make} ${inv_model} to the inventory has failed.`
    );
    res.status(501);
    if (addInvResult[2] != "") {
      console.log(`inventory-model addNewInventory error: ${addInvResult[2]}`);
    } else {
      console.log("inventory-model addNewInventory error: unknown");
    }
    let classificationList = await manager.buildClassificationList(
      classification_id
    );
    res.render("inventory/add-inventory", {
      errors: null,
      title: "Manage Inventory",
      nav,
      classificationList,
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
    });
  }
};

module.exports = inventoryController;

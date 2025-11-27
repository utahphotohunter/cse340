const { render } = require("ejs");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities");
const manager = require("../utilities/management");

const inventoryController = {};

/* *********************************************** *
 *  Build management view
 * *********************************************** */
inventoryController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await manager.buildClassificationList();
  const managerOptions = await manager.buildManagement();
  res.render("./inventory/management", {
    title: "Manage Site",
    nav,
    managerOptions,
    classificationSelect,
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
    errors: null,
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
  try {
    const addClassResult = await invModel.addNewClassification(
      classification_name
    );
    let nav = await utilities.getNav();
    const classManager = await manager.buildClassificationForm();
    const managerOptions = await manager.buildManagement();
    if (addClassResult != "") {
      req.flash("notice", addClassResult);
      res.status(501);
      res.render("inventory/add-classification", {
        errors: null,
        title: "Manage Classifications",
        nav,
        classManager,
      });
    } else {
      req.flash(
        "notice",
        `Success! "${classification_name}" has been added to the classification list.`
      );
      res.status(201);
      res.render("./inventory/management", {
        title: "Manage Site",
        nav,
        managerOptions,
      });
    }
  } catch (error) {
    console.log("=============================================");
    console.log(
      `Error at inventoryController.addNewClassification: -- ${error}`
    );
    console.log("=============================================");
    let nav = await utilities.getNav();
    const classManager = await manager.buildClassificationForm();
    req.flash(
      "notice",
      `Sorry, the addition of "${classification_name}" to the classifcation list has failed.`
    );
    res.status(501);
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
    errors: null,
    title: "Manage Inventory",
    nav,
    classificationList,
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

  let nav = await utilities.getNav();
  const managerOptions = await manager.buildManagement();
  const classificationList = await manager.buildClassificationList(
    classification_id
  );
  try {
    const addInvResult = await invModel.addNewInventory(
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
    if (addInvResult != "") {
      req.flash("notice", addInvResult);
      res.status(501);
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
    } else {
      req.flash(
        "notice",
        `Success! Your "${inv_year} ${inv_make} ${inv_model}" has been added to the inventory.`
      );
      res.status(201);
      res.render("./inventory/management", {
        title: "Manage Site",
        nav,
        managerOptions,
      });
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at inventoryController.addNewInventory: -- ${error}`);
    console.log("=============================================");
    req.flash("notice", "Sorry, an internal error occured. Please Try again.");
    res.status(501);
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

/* *********************************************** *
 *  Build Inventory Editor
 * *********************************************** */
inventoryController.buildInventoryEditor = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.params.inv_id);
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const invItem = itemData[0];
  const itemName = `${invItem.inv_make} ${invItem.inv_model}`;
  const classificationSelect = await manager.buildClassificationList(
  invItem.classification_id
  );
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
    inv_id: invItem.inv_id,
    inv_make: invItem.inv_make,
    inv_model: invItem.inv_model,
    inv_year: invItem.inv_year,
    inv_description: invItem.inv_description,
    inv_image: invItem.inv_image,
    inv_thumbnail: invItem.inv_thumbnail,
    inv_price: invItem.inv_price,
    inv_miles: invItem.inv_miles,
    inv_color: invItem.inv_color,
    classification_id: invItem.classification_id,
  });
};

/* *********************************************** *
 *  Process updating inventory
 * *********************************************** */
inventoryController.updateInventory = async function (req, res) {
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

  const inv_id = parseInt(req.params.inv_id);
  const itemData = await invModel.getInventoryByInvId(inv_id);
  const invItem = itemData[0];
  const itemName = `${invItem.inv_make} ${invItem.inv_model}`;
  let nav = await utilities.getNav();
  const managerOptions = await manager.buildManagement();
  const classificationList = await manager.buildClassificationList(
    classification_id
  );
  try {
    const updateInvResult = await invModel.updateInventory(
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
    if (updateInvResult != "") {
      req.flash("notice", updateInvResult);
      res.status(501);
      res.render("inventory/edit-inventory", {
        errors: null,
        title: "Edit " + itemName,
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
    } else {
      req.flash(
        "notice",
        `Success! Your "${inv_year} ${inv_make} ${inv_model}" has been updated in the inventory.`
      );
      res.status(201);
      res.render("./inventory/management", {
        title: "Manage Site",
        nav,
        managerOptions,
      });
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at inventoryController.updateInventory: -- ${error}`);
    console.log("=============================================");
    req.flash("notice", "Sorry, an internal error occured. Please Try again.");
    res.status(501);
    res.render("inventory/edit-inventory", {
      errors: null,
      title: "Edit " + itemName,
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

/* *********************************************** *
 *  Return Inventory by Classification As JSON
 * *********************************************** */
inventoryController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

module.exports = inventoryController;

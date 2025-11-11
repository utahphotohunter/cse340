const { render } = require("ejs");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const manager = require("../utilities/management");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
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

/* ***************************
 *  Build detail by inventory id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
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

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const managerOptions = await manager.buildManagement();
  res.render("./inventory/management", {
    title: "Manage Site",
    nav,
    managerOptions,
  });
};

/* ***************************
 *  Build classification manager view
 * ************************** */
invCont.buildClassificationManager = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classManager = await manager.buildClassificationForm();
  res.render("./inventory/add-classification", {
    title: "Manage Classifications",
    nav,
    classManager,
  });
};

/* ***************************
 *  Build inventory manager view
 * ************************** */
invCont.buildInventoryManager = async function (req, res, next) {
  let nav = await utilities.getNav();
  let invManager = await manager.buildInventoryForm();
  res.render("./inventory/add-inventory", {
    title: "Manage Inventory",
    nav,
    invManager,
  });
};

module.exports = invCont;

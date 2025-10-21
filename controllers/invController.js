const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

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
  const details = await utilities.buildDetail(data);
  let nav = await utilities.getNav();
  let inv_make = data[0].inv_make;
  let inv_model = data[0].inv_model;
  res.render("./inventory/detail", {
    title: `${inv_make} ${inv_model}`,
    nav,
    details,
  });
};

module.exports = invCont;

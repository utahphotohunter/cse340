const utilities = require(".");
const { body, validationResult } = require("express-validator");
const inventoryModel = require("../models/inventory-model");
const manager = require("../utilities/management");
const validate = {};

/* *********************************************** *
 *  rules for Manage Inventory
 * *********************************************** */
validate.addInventoryRules = () => {
  return [
    // check is classification_id exists
    body("classification_id")
      .isInt({ min: 1 })
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please select a valid vehicle classification.")
      .custom(async (classification_id) => {
        const classificationExists = await inventoryModel.checkClassificationId(
          classification_id
        );
        if (classificationExists.length == 0) {
          throw new Error(
            "Classification does not exist. Please select a different classification."
          );
        }
      }),

    // make is required and must be a string
    body("inv_make")
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a vehicle make."), // on error this message is sent.

    // model is required and must be a string
    body("inv_model")
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a vehicle model."), // on error this message is sent.

    // description is required and must be a string
    body("inv_description")
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a vehicle description."), // on error this message is sent.

    // image is required and must a string (file path)
    body("inv_image")
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a vehicle image."), // on error this message is sent.

    // thumbnail is required and must a string (file path)
    body("inv_thumbnail")
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a vehicle thumbnail."), // on error this message is sent.

    // price is required and must be a number >=100
    body("inv_price")
      .isNumeric({ min: 100 })
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a vehicle price."), // on error this message is sent.

    // year is required and must be an integer 1900>=year=< 2100
    body("inv_year")
      .isInt({ min: 1900 })
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a vehicle year."), // on error this message is sent.

    // miles is requierd and must be an integer >=0
    body("inv_miles")
      .isInt({ min: 0 })
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide vehicle miles."), // on error this message is sent.

    // color is required and must a string >=3 in length
    body("inv_color")
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide vehicle color."), // on error this message is sent.
  ];
};

/* *********************************************** *
 *  Check data and return errors or continue
 *  to add inventory
 * *********************************************** */
validate.checkInvData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await manager.buildClassificationList(
      classification_id
    );
    res.render("inventory/add-inventory", {
      errors,
      title: "Manage Inventory",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/* *********************************************** *
 *  rules for Add Classification
 * *********************************************** */
validate.addClassificationRules = () => {
  return [
    // classification_name is required and must be a string >=2 in length
    body("classification_name")
      .isString()
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a vehicle classification.") // on error this message is sent.
      // check if classification_name already exists
      .custom(async (classification_name) => {
        const results = await inventoryModel.getClassificationByName(
          classification_name
        );
        const resultsLength = results.length;
        // console.log(resultsLength);
        if (resultsLength != 0) {
          throw new Error(
            "Classification already exists. Please create a new classification."
          );
        }
        return true;
      }),
  ];
};

/* *********************************************** *
 *  Check data and return errors or continue to
 *  add classification
 * *********************************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;

  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);

    const error = errors.errors[0].msg;

    let nav = await utilities.getNav();
    let classManager = await manager.buildClassificationForm();

    req.flash("notice", error);
    res.render("inventory/add-classification", {
      errors,
      title: "Manage Classifications",
      nav,
      classManager,
    });

    return;
  }
  next();
};

module.exports = validate;

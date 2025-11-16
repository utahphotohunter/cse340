const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const inventoryValidator = require("../utilities/inventory-validation");

/* *********************************************** *
 *  Manangement Route
 * *********************************************** */
// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

/* *********************************************** *
 *  Classification Routes
 * *********************************************** */
// Route to build classification management view
router.get(
  "/manage/class",
  utilities.handleErrors(invController.buildClassificationManager)
);

// Route to post new classification to db
router.post(
  "/manage/class",
  inventoryValidator.addClassificationRules(),
  inventoryValidator.checkClassificationData,
  utilities.handleErrors(invController.addNewClassification)
);

/* *********************************************** *
 *  Inventory Routes
 * *********************************************** */
// Route to build inventory management form
router.get(
  "/manage/inv",
  utilities.handleErrors(invController.buildInventoryManager)
);

// Route to post new inventory item to db
router.post(
  "/manage/inv",
  inventoryValidator.addInventoryRules(),
  inventoryValidator.checkInvData,
  utilities.handleErrors(invController.addNewInventory)
);

/* *********************************************** *
 *  Type and Detail Routes
 * *********************************************** */
// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.buildByInvId)
);

module.exports = router;

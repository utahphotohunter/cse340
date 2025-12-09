const express = require("express");
const router = new express.Router();
const inventoryController = require("../controllers/inventoryController");
const utilities = require("../utilities");
const inventoryValidator = require("../utilities/inventory-validation");

/* *********************************************** *
 *  Manangement Route
 * *********************************************** */
// Route to build management view
router.get("/", utilities.checkJWTToken, utilities.handleErrors(inventoryController.buildManagement));

/* *********************************************** *
 *  Classification Routes
 * *********************************************** */
// Route to build classification management view
router.get(
  "/manage/class",
  utilities.handleErrors(inventoryController.buildClassificationManager)
);

// Route to post new classification to db
router.post(
  "/manage/class",
  inventoryValidator.addClassificationRules(),
  inventoryValidator.checkClassificationData,
  utilities.handleErrors(inventoryController.addNewClassification)
);

/* *********************************************** *
 *  Inventory Routes
 * *********************************************** */
// Route to build inventory management form
router.get(
  "/manage/inv",
  utilities.handleErrors(inventoryController.buildInventoryManager)
);

// Route to post new inventory item to db
router.post(
  "/manage/inv",
  inventoryValidator.addInventoryRules(),
  inventoryValidator.checkInvData,
  utilities.handleErrors(inventoryController.addNewInventory)
);

// route to manage inventory in db
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(inventoryController.getInventoryJSON)
);

// route to build the update inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(inventoryController.buildInventoryEditor)
);

// route to update inventory in the db
router.post(
  "/update/",
  inventoryValidator.addInventoryRules(),
  inventoryValidator.checkUpdateData,
  utilities.handleErrors(inventoryController.updateInventory)
);

// route to build the delete inventory view
router.get("/delete/:inv_id", utilities.handleErrors(inventoryController.buildInventoryDelete));

// route to delete inventory in the db
router.post("/delete/", utilities.handleErrors(inventoryController.deleteInventory));

/* *********************************************** *
 *  Type and Detail Routes
 * *********************************************** */
// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(inventoryController.buildByClassificationId)
);

// Route to build inventory detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(inventoryController.buildByInvId)
);

module.exports = router;

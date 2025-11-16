const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const inventoryValidator = require("../utilities/inventory-validation");

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build classification management view
router.get(
  "/manage/class",
  utilities.handleErrors(invController.buildClassificationManager)
);

// Route to build inventory management view
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
  // redirect only for development - needs to be replaced with logic to update inventory table in db
  // (req, res) => {
  //   res.redirect("/inv/manage/inv");
  // }
);

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

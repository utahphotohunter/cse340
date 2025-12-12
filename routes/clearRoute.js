const express = require("express");
const router = new express.Router();
const clearController = require("../controllers/clearController");
const utilities = require("../utilities");


// Route to build account management page
router.get("/", utilities.handleErrors(clearController.clearCookies));



module.exports = router;

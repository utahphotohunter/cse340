const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");
const reviewValidator = require("../utilities/review-validation");

// Route to post review to db
router.post("/", utilities.handleErrors(reviewController.buildByInvId));

module.exports = router;

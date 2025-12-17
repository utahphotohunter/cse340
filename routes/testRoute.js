const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");

// Route to build account management page
router.get("/review/:inv_id", utilities.handleErrors(reviewController.buildReviews));

module.exports = router;

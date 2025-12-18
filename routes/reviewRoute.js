const express = require("express");
const router = new express.Router();
const reviewController = require("../controllers/reviewController");
const utilities = require("../utilities");
const reviewValidator = require("../utilities/review-validation");

// Route to post review to db
router.post("/", utilities.handleErrors(reviewController.addReview));

// Route to build review update form
router.get("/update/:review_id", utilities.handleErrors(reviewController.buildUpdateReviewForm));

// Route to edit review in db
router.post("/update", utilities.handleErrors(reviewController.updateReviewByReviewId));

// Route to build review delete form
router.get("/delete/:review_id", utilities.handleErrors(reviewController.buildDeleteReviewForm));

// Route to delete review in db
router.delete("/delete", utilities.handleErrors(reviewController.deleteReviewByReviewId));

module.exports = router;

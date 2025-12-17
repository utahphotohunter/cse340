const reviewsModel = require("../models/review-model");
require("dotenv").config();
const reviewController = {};

// reviewController.buildReviews = async function (inv_id) {
reviewController.buildReviews = async function (req, res) {
  let response;
  const inv_id = req.params.inv_id;
  try {
    const reviews = await reviewsModel.getReviewsByInvId(inv_id);
    if (!reviews) {
      response = "";
      console.log("no response")
    } else if ((response = "Error")) {
      response = "Database Error";
    } else {
      // reviewItems = reviews.map(
      //   (review) => `<li></li>` /* review data <li> goes here */
      // );
      console.log("=============================================");
      console.log(reviews);
      console.log("=============================================");
      response = reviewItems.join("");
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at reviewController.buildReviews: -- ${error}`);
    console.log("=============================================");
    response = "Controller Error";
  } finally {
    return response;
  }
};

reviewController.buildInteraction = (accountData) => {
  if (accountData) {
    return "Interaction Form";
  } else {
    return '<p>You must <a href="/account/login">login</a> to write a review.</p>';
  }
};

module.exports = reviewController;

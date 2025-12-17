const reviewsModel = require("../models/review-model");
require("dotenv").config();
const reviewController = {};
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

reviewController.buildReviews = async function (inv_id) {
  let response;
  try {
    const reviews = await reviewsModel.getReviewsByInvId(inv_id);
    if (!reviews) {
      response = "";
      console.log("no response");
    } else if (reviews === "Error") {
      response = "Database Error";
    } else {
      const reviewsList = reviews.map((review) => {
        const numDate = review.review_date.toISOString().split("T")[0];
        const [year, month, day] = numDate.split("-");
        const namedMonth = months[parseInt(month) - 1];

        const date = `${namedMonth} ${day}, ${year}`;
        const screenName = `${review.first_name[0]}${review.last_name}`;
        const textContent = review.review_text;

        return `<li>
            <p>${screenName} wrote on ${date}</p>
            <p>${textContent}</p>
        </li>`
      });

      response = reviewsList;
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
    // interaction form goes here
    return "Interaction Form";
  } else {
    return '<p>You must <a href="/account/login">login</a> to write a review.</p>';
  }
};

module.exports = reviewController;

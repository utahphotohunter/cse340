const reviewsModel = require("../models/review-model");
const utilities = require("../utilities");
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

/* *********************************************** *
 *  Build reviews list by inv_id
 * *********************************************** */
reviewController.buildReviews = async function (inv_id) {
  let response;
  try {
    const reviews = await reviewsModel.getReviewsByInvId(inv_id);
    if (!reviews) {
      response = "Be the first to write a review.";
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
        </li>`;
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

/* *********************************************** *
 *  Build review form and login prompt, retuning
 *  correct data based on login status
 * *********************************************** */
reviewController.buildInteraction = (accountData, inv_id) => {
  let response;
  
  if (accountData) {
    const screenName = `${accountData.account_firstname[0]}${accountData.account_lastname}`;
    const account_id = accountData.account_id;

    response = `<h3>Add Your Own Review</h3>
    <form id="reviewForm" action="/review" method="post">
      <section class="container">
        <label for="screen_name">Screen Name:</label>
        <input
          type="text"
          name="screen_name"
          id="screenName"
          required
          value="${screenName}"
          readonly
        />
      </section>
      <section class="container">
        <label for="review_text">Last Name:</label>
        <textarea name="review_text" id="reviewText" placeholder="Write your vehicle review here." required></textarea>
        <label for="account_id" hidden></label>
        <input type="number" name="account_id" id="accountId" value="${account_id}" required hidden>
        <label for="inv_id" hidden></label>
        <input type="number" name="inv_id" id="invId" value="${inv_id}" required hidden>
      </section>
      <section class="submit-area container">
        <button type="submit" class="btn submit-btn">Submit Review</button>
      </section>
    </form>`;
  } else {
    response =
      '<p>You must <a href="/account/login">login</a> to write a review.</p>';
  }
  return response;
};

module.exports = reviewController;

// review model logic
const pool = require("../database/");
const reviewModel = {};

// Get reviews by inv_id
reviewModel.getReviewsByInvId = async function (inv_id) {
  let response;
  try {
    const sql =
      "SELECT review.inv_id, review.review_id, review.review_text, review.review_date, account.account_firstname AS first_name, account.account_lastname AS last_name, account.account_id FROM review INNER JOIN account ON review.account_id = account.account_id WHERE inv_id = $1;";
    let getReviews = await pool.query(sql, [inv_id]);
    let result = getReviews.rows;
    if (result.length != 0) {
      response = getReviews;
    } else {
      response = false;
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at review-model.getReviewsByInvId: -- ${error}`);
    console.log("=============================================");
    response = "Error";
  } finally {
    return response;
  }
};

module.exports = reviewModel;

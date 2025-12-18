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
      response = result;
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

reviewModel.getReviewsByAccountId = async function (accountId) {
  let response;
  try {
    const sql =
      "SELECT review.account_id, review.review_id, review.review_text, review.review_date, review.inv_id, inventory.inv_year, inventory.inv_make, inventory.inv_model FROM review INNER JOIN inventory ON review.inv_id = inventory.inv_id WHERE account_id = $1;";
    let getReviews = await pool.query(sql, [accountId]);
    let result = getReviews.rows;
    if (result.length != 0) {
      response = result;
    } else {
      response = false;
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at review-model.getReviewsByAccountId: -- ${error}`);
    console.log("=============================================");
    response = "Error";
  } finally {
    return response;
  }
};

reviewModel.getReviewByReviewId = async function (reviewId) {
  let response;
  try {
    const sql =
      "SELECT review.review_id, review.account_id, review.review_text, review.review_date, review.inv_id, inventory.inv_year, inventory.inv_make, inventory.inv_model FROM review INNER JOIN inventory ON review.inv_id = inventory.inv_id WHERE review_id = $1;";
    let getReviews = await pool.query(sql, [reviewId]);
    let result = getReviews.rows;
    if (result.length != 0) {
      response = result;
    } else {
      response = false;
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at review-model.getReviewsByReviewId: -- ${error}`);
    console.log("=============================================");
    response = "Error";
  } finally {
    return response;
  }
};

reviewModel.addReview = async function (review_text, account_id, inv_id) {
  let response;
  try {
    const date = new Date().toISOString().split("T")[0];

    const sql =
      "INSERT INTO review (review_text, review_date, inv_id, account_id) VALUES ($1, $2, $3, $4) RETURNING *;";
    let addReview = await pool.query(sql, [
      review_text,
      date,
      inv_id,
      account_id,
    ]);
    let result = addReview.rows;
    if (result.length != 0) {
      response = "success";
    } else {
      response = false;
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at review-model.addReview: -- ${error}`);
    console.log("=============================================");
    response = "Error";
  } finally {
    return response;
  }
};

reviewModel.updateReviewByReviewId = async function (review_id, review_text) {
  let response;
  try {
    const sql =
      "UPDATE review SET review_text = $1 WHERE review_id = $2 RETURNING *;";
    let updateReview = await pool.query(sql, [review_text, review_id]);
    let result = updateReview.rows;
    if (result.length != 0) {
      response = "success";
    } else {
      response = false;
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at review-model.updateReviewByReviewId: -- ${error}`);
    console.log("=============================================");
    response = "Error";
  } finally {
    return response;
  }
};

reviewModel.deleteReviewByReviewId = async function (review_id) {
  let response;
  try {
    const sql =
      "DELETE FROM review WHERE review_id = $1 RETURNING *;";
    let deleteReview = await pool.query(sql, [review_id]);
    let result = deleteReview.rows;
    if (result.length != 0) {
      response = "success";
    } else {
      response = false;
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at review-model.deleteReviewByReviewId: -- ${error}`);
    console.log("=============================================");
    response = "Error";
  } finally {
    return response;
  }
};

module.exports = reviewModel;

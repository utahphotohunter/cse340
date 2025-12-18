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
reviewController.buildReviewsByInvId = async function (inv_id) {
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
            <p class="review-credit">${screenName} wrote on ${date}</p>
            <p class="review-comment">${textContent}</p>
        </li>`;
      });

      response = reviewsList.join("");
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at reviewController.buildReviewsByInvId: -- ${error}`);
    console.log("=============================================");
    response = "Controller Error";
  } finally {
    return response;
  }
};

reviewController.buildReviewsByAccountId = async function (accountId) {
  let response;
  try {
    const reviews = await reviewsModel.getReviewsByAccountId(accountId);

    if (!reviews) {
      response = "You haven't reviewed any vehicles yet.";
    } else if (reviews === "Error") {
      response = "Database Error";
    } else {
      const reviewsList = reviews.map((review) => {
        const numDate = review.review_date.toISOString().split("T")[0];
        const [year, month, day] = numDate.split("-");
        const namedMonth = months[parseInt(month) - 1];

        const date = `${namedMonth} ${day}, ${year}`;
        const vehicle = `${review.inv_year} ${review.inv_make} ${review.inv_model}`;
        const review_id = review.review_id;

        return `<li>
            <p>Reviewed the ${vehicle} on ${date} | <a href="/review/update/${review_id}">Edit</a> | <a href="/review/delete/${review_id}">Delete</a></p>
        </li>`;
      });

      response = reviewsList.join("");
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at reviewController.getReviewsByAccountId: -- ${error}`);
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
reviewController.buildReviewInteraction = (accountData, inv_id) => {
  let response;

  if (accountData) {
    const screenName = `${accountData.account_firstname[0]}${accountData.account_lastname}`;
    const account_id = accountData.account_id;

    response = `<h3>Add Your Own Review</h3>
    <form id="reviewForm" action="/review" method="post">
      <section class="container">
        <label for="screenName">Screen Name:</label>
        <input
          type="text"
          name="screen_name"
          id="screen_name"
          required
          value="${screenName}"
          readonly
        />
      </section>
      <section class="container">
        <label for="reviewText">Last Name:</label>
        <textarea name="review_text" id="reviewText" placeholder="Write your vehicle review here." value="<%= locals.review_text %>" required></textarea>
        <label for="accountId" hidden></label>
        <input type="number" name="account_id" id="accountId" value="${account_id}" required hidden>
        <label for="invId" hidden></label>
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

/* *********************************************** *
 *  Add review to database
 * *********************************************** */
reviewController.addReview = async function (req, res) {
  const { screen_name, review_text, account_id, inv_id } = req.body;
  res.locals.loginLink = utilities.getHeaderLinks(req, res);
  let nav = await utilities.getNav();

  try {
    const result = await reviewsModel.addReview(
      review_text,
      account_id,
      inv_id
    );
    if (result === "success") {
      req.flash(
        "notice",
        `Thank you, ${screen_name} for your comments! Your review has been posted.`
      );
      res.status(201).redirect(`inv/detail/${inv_id}`);
    } else {
      const data = await invModel.getInventoryByInvId(inv_id);
      let d = data[0];
      let reviews = await reviewController.buildReviewsByInvId(inv_id);
      const accountData = utilities.readAccountCookie(req, res);
      const interaction = await reviewController.buildReviewInteraction(
        accountData,
        inv_id
      );
      res.locals.review_text = review_text;
      req.flash(
        "notice",
        "An uknown error occured while posting your review. Please try again."
      );
      res.status(500).render("./inventory/detail", {
        title: `${d.inv_year} ${d.inv_make} ${d.inv_model}`,
        nav,
        d,
        reviews,
        interaction,
      });
    }
  } catch (error) {
    console.log("=============================================");
    console.log(`Error at reviewController.addReview: -- ${error}`);
    console.log("=============================================");
    const data = await invModel.getInventoryByInvId(inv_id);
    let d = data[0];
    let reviews = await reviewController.buildReviewsByInvId(inv_id);
    const accountData = utilities.readAccountCookie(req, res);
    const interaction = await reviewController.buildReviewInteraction(
      accountData,
      inv_id
    );
    res.locals.review_text = review_text;
    req.flash(
      "notice",
      "An uknown error occured while posting your review. Please try again."
    );
    res.status(500).render("./inventory/detail", {
      title: `${d.inv_year} ${d.inv_make} ${d.inv_model}`,
      nav,
      d,
      reviews,
      interaction,
    });
  }
};

reviewController.buildUpdateReviewForm = async function (req, res) {
  res.locals.loginLink = utilities.getHeaderLinks(req, res);
  let nav = await utilities.getNav();
  const review_id = req.params.review_id;
  let result = await reviewsModel.getReviewsByReviewId(review_id);

  try {
    if (!result) {
      req.flash(
        "notice",
        "An uknown error occured while retrieving your review. Please try again."
      );
      const accountData = utilities.readAccountCookie(req, res);
      if (accountData) {
        const accountType = accountData.account_type;
        const firstName = accountData.account_firstname;
        let content = `
            <h2>Welcome ${firstName}</h2>
            <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
          `;
        if (accountType == "Admin" || accountType == "Employee") {
          content = `<h2>Welcome ${firstName}</h2>
          <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
          <h3>Inventory Management</h3>
          <p><a href="/inv" title="Manage Inventory" class="btn">Manage Inventory</a></p>
          `;
        }

        const accountId = accountData.account_id;
        const reviews = await reviewController.buildReviewsByAccountId(
          accountId
        );
        res.status(500).render("account/management", {
          title: "Account Management",
          nav,
          content: content,
          reviews,
          errors: null,
        });
      } else {
        const review_text = result.review_text;
        const inv_year = result.inv_year;
        const inv_make = result.inv_make;
        const inv_model = result.inv_model;

        const numDate = result.review_date.toISOString().split("T")[0];
        const [year, month, day] = numDate.split("-");
        const namedMonth = months[parseInt(month) - 1];
        const date = `${namedMonth} ${day}, ${year}`;

        res.locals.review_date = date;
        res.locals.review_text = review_text;
        res.locals.review_id = review_id;

        res.status(200).render("./review/update", {
          title: `Edit ${inv_year} ${inv_make} ${inv_model} Review`,
          nav,
        });
      }
    }
  } catch (error) {
    req.flash(
      "notice",
      "An uknown error occured while retrieving your review. Please try again."
    );
    const accountData = utilities.readAccountCookie(req, res);
    if (accountData) {
      const accountType = accountData.account_type;
      const firstName = accountData.account_firstname;
      let content = `
            <h2>Welcome ${firstName}</h2>
            <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
          `;
      if (accountType == "Admin" || accountType == "Employee") {
        content = `<h2>Welcome ${firstName}</h2>
          <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
          <h3>Inventory Management</h3>
          <p><a href="/inv" title="Manage Inventory" class="btn">Manage Inventory</a></p>
          `;
      }

      const accountId = accountData.account_id;
      const reviews = await reviewController.buildReviewsByAccountId(accountId);
      res.status(500).render("account/management", {
        title: "Account Management",
        nav,
        content: content,
        reviews,
        errors: error,
      });
    }
  }
};

reviewController.buildDeleteReviewForm = async function (req, res) {
  res.locals.loginLink = utilities.getHeaderLinks(req, res);
  let nav = await utilities.getNav();
  const review_id = req.params.review_id;
  let result = await reviewsModel.getReviewsByReviewId(review_id);

  try {
    if (!result) {
      req.flash(
        "notice",
        "An uknown error occured while retrieving your review. Please try again."
      );
      const accountData = utilities.readAccountCookie(req, res);
      if (accountData) {
        const accountType = accountData.account_type;
        const firstName = accountData.account_firstname;
        let content = `
            <h2>Welcome ${firstName}</h2>
            <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
          `;
        if (accountType == "Admin" || accountType == "Employee") {
          content = `<h2>Welcome ${firstName}</h2>
          <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
          <h3>Inventory Management</h3>
          <p><a href="/inv" title="Manage Inventory" class="btn">Manage Inventory</a></p>
          `;
        }
        const accountId = accountData.account_id;
        const reviews = await reviewController.buildReviewsByAccountId(
          accountId
        );
        res.status(500).render("account/management", {
          title: "Account Management",
          nav,
          content: content,
          reviews,
          errors: null,
        });
      } else {
        const review_text = result.review_text;
        const inv_year = result.inv_year;
        const inv_make = result.inv_make;
        const inv_model = result.inv_model;

        const numDate = result.review_date.toISOString().split("T")[0];
        const [year, month, day] = numDate.split("-");
        const namedMonth = months[parseInt(month) - 1];
        const date = `${namedMonth} ${day}, ${year}`;

        res.locals.review_date = date;
        res.locals.review_text = review_text;
        res.locals.review_id = review_id;

        res.status(200).render("./review/update", {
          title: `Delete ${inv_year} ${inv_make} ${inv_model} Review`,
          nav,
        });
      }
    }
  } catch (error) {
    req.flash(
      "notice",
      "An uknown error occured while retrieving your review. Please try again."
    );
    const accountData = utilities.readAccountCookie(req, res);
    if (accountData) {
      const accountType = accountData.account_type;
      const firstName = accountData.account_firstname;
      let content = `
            <h2>Welcome ${firstName}</h2>
            <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
          `;
      if (accountType == "Admin" || accountType == "Employee") {
        content = `<h2>Welcome ${firstName}</h2>
          <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
          <h3>Inventory Management</h3>
          <p><a href="/inv" title="Manage Inventory" class="btn">Manage Inventory</a></p>
          `;
      }

      const accountId = accountData.account_id;
      const reviews = await reviewController.buildReviewsByAccountId(accountId);
      res.status(500).render("account/management", {
        title: "Account Management",
        nav,
        content: content,
        reviews,
        errors: error,
      });
    }
  }
};


reviewController.updateReviewByReviewId = async function (req, res) {
  const { review_date, review_text, review_id } = req.body;
}

module.exports = reviewController;

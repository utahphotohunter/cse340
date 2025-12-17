const invModel = require("../models/inventory-model");
const utilities = require("./");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const InvUtil = {};

InvUtil.buildReviews = async function () {
  return "reviews here";
};

InvUtil.buildInteraction = (accountData) => {
  if (accountData) {
    return "Interaction Form";
  } else {
    return '<p>You must <a href="/account/login">login</a> to write a review.</p>';
  }
};

module.exports = InvUtil;

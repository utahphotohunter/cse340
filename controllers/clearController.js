const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/");
require("dotenv").config();
const accountController = {};

/* *********************************************** *
 *  Clear Cookies
 * *********************************************** */
accountController.clearCookies = async function (req, res, next) {
  utilities.clearAccountCookie(req, res);
  req.flash("notice", "cookies cleared");
  res.status(200).redirect("/");
};

module.exports = accountController;

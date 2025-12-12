const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const accountController = {};

/* *********************************************** *
 *  Clear Cookies
 * *********************************************** */
accountController.clearCookies = async function (req, res, next) {
  res.clearCookie("jwt", {
    httpOnly: true,
    path: "/",
  });
  res.clearCookie("accountInfo", {
    httpOnly: true,
    path: "/",
  });
  req.flash("notice", "cookies cleared");
  res.redirect("/").status(200);
};

module.exports = accountController;

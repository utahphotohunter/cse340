const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* *********************************************** *
 * Constructs the nav HTML unordered list
 * *********************************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list +=
    '<li id="nav-0" class="nav-btn"><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += '<li class="nav-btn" id="nav-' + row.classification_id + '">';
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* *********************************************** *
 * Build the classification view HTML
 * *********************************************** */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_image +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      // grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* *********************************************** *
 *  Middleware For Handling Errors Wrap other
 *  function in this for General Error Handling
 * *********************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* *********************************************** *
 * Middleware to check token validity
 * *********************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* *********************************************** *
 *  Check Login
 * *********************************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* *********************************************** *
 *  Check Access Permisssions
 * *********************************************** */
Util.checkAccess = (accessLevel) => {
  return (req, res, next) => {
    if (!req.cookies.jwt) {
      req.flash("notice", "Restricted Access. Please log in.");
      return res.redirect("/account/login");
    } else {
      const rawAccountData = req.cookies.jwt;
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const accountData = jwt.verify(rawAccountData, secret);
      const accountType = accountData.account_type;

      if (accessLevel == "Admin") {
        if (accountType == "Admin") {
          next();
        } else {
          req.flash("notice", "Restricted Access. Please log in.");
          return res.redirect("/account/login");
        }
      } else if (accessLevel == "Employee") {
        if (accountType == "Admin" || accountType == "Employee") {
          next();
        } else {
          req.flash("notice", "Restricted Access. Please log in.");
          return res.redirect("/account/login");
        }
      } else {
        req.flash("notice", "Restricted Access. Please log in.");
        return res.redirect("/account/login");
      }
    }
  };
};

/* *********************************************** *
 *  Get Header Links
 * *********************************************** */
Util.getHeaderLinks = (req, res) => {
  let loginLink;
  if (req.cookies.jwt) {
    const rawAccountData = req.cookies.jwt;
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const accountData = jwt.verify(rawAccountData, secret);
    const firstName = accountData.account_firstname;
    loginLink = `<a title="Manage Account" href="/account">Welcome ${firstName}!</a> <a title="Click to log out" href="/account/logout">Logout</a>`;
  } else {
    loginLink =
      '<a title="Click to log in" href="/account/login">My Account</a>';
  }
  return loginLink;
};

/* *********************************************** *
 *  Set JWT Cookie
 * *********************************************** */
Util.setAccountCookie = (req, res, accountData) => {
  const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600 * 1000,
  });
  if (process.env.NODE_ENV === "development") {
    return res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: 3600 * 1000,
    });
  } else {
    return res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600 * 1000,
    });
  }
};

/* *********************************************** *
 *  Read JWT Cookie
 * *********************************************** */
Util.readAccountCookie = (req, res) => {
  if (req.cookies.jwt) {
    const rawAccountData = req.cookies.jwt;
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const accountData = jwt.verify(rawAccountData, secret);
    return accountData;
  } else {
    return false;
  }
};

/* *********************************************** *
 *  Clear JWT Cookie
 * *********************************************** */
Util.clearAccountCookie = (req, res) => {
  return res.clearCookie("jwt", {
    httpOnly: true,
    path: "/",
  });
};

module.exports = Util;

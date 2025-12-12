const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const accountController = {};

/* *********************************************** *
 *  Deliver registration view
 * *********************************************** */
accountController.buildRegistration = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.locals.loginLink = utilities.getHeaderLinks(req, res);
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
};

/* *********************************************** *
 *  Process Registration
 * *********************************************** */
accountController.registerAccount = async function (req, res) {
  let nav = await utilities.getNav();
  res.locals.loginLink = utilities.getHeaderLinks(req, res);
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
};

/* *********************************************** *
 *  Deliver login view
 * *********************************************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.locals.loginLink = utilities.getHeaderLinks(req, res);
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null,
  });
};

/* *********************************************** *
 *  Process login request
 * *********************************************** */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  res.locals.loginLink = utilities.getHeaderLinks(req, res);
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;

      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      res.cookie(
        "accountInfo",
        JSON.stringify({
          firstName: accountData.first_Name,
          lastName: accountData.last_Name,
          accountType: accountData.account_Type,
        }),
        { httpOnly: true, maxAge: 3600 * 1000 }
      );

      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
        res.cookie(
          "accountInfo",
          JSON.stringify({
            firstName: accountData.account_firstname,
            lastName: accountData.account_lastname,
            accountType: accountData.account_type,
          }),
          { httpOnly: true, maxAge: 3600 * 1000 }
        );
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });

        res.cookie(
          "accountInfo",
          JSON.stringify({
            firstName: accountData.firstName,
            lastName: accountData.lastName,
            accountType: accountData.accountType,
          }),
          {
            httpOnly: true,
            secure: true,
            maxAge: 3600 * 1000,
          }
        );
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );

      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
};

/* *********************************************** *
 *  Deliver Account Management View
 * *********************************************** */
accountController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  if (req.cookies.accountInfo) {
    const rawCookie = req.cookies.accountInfo;
    const accountData = JSON.parse(rawCookie);
    const accountType = accountData.accountType;
    const firstName = accountData.firstName;
    // res.locals.account_id = 
    let welcomeMessage = `
        <h2>Welcome ${firstName}</h2>
        <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
      `;
    if (accountType == "Admin" || accountType == "Employee") {
      welcomeMessage = `<h2>Welcome ${firstName}</h2>
      <p><a href="/account/update" title="Update Account" class="btn">Update Account Information</a></p>
      <h3>Inventory Management</h3>
      <p><a href="/inv" title="Manage Inventory" class="btn">Manage Inventory</a></p>
      `;
    }
    res.locals.loginLink = utilities.getHeaderLinks(req, res);
    res.render("account/management", {
      title: "Account Management",
      nav,
      welcomeMessage: welcomeMessage,
      errors: null,
    });
  } else {
    req.flash("message notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
};

/* *********************************************** *
 *  Deliver Account Update View
 * *********************************************** */
accountController.buildUpdate = async function (req, res, next) {};

/* *********************************************** *
 *  Process Account Update
 * *********************************************** */
accountController.processUpdate = async function (req, res) {};

module.exports = accountController;

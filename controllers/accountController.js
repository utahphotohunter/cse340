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
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
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
    res.locals.loginLink = utilities.getHeaderLinks(req, res);
    res.render("account/management", {
      title: "Account Management",
      nav,
      content: content,
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
accountController.buildUpdate = async function (req, res, next) {
  const accountData = utilities.readAccountCookie(req, res);
  const accountId = accountData.account_id;
  let nav = await utilities.getNav();
  res.locals.loginLink = utilities.getHeaderLinks(req, res);
  res.locals.firstName = accountData.account_firstname;
  res.locals.lastName = accountData.account_lastname;
  res.locals.email = accountData.account_email;
  res.render("./account/update", {
    title: "Account Update",
    nav,
    errors: null,
    accountId,
  });
};

/* *********************************************** *
 *  Process Account Update
 * *********************************************** */
accountController.updateAccount = async function (req, res) {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  const accountCurrent = utilities.readAccountCookie(req, res);

  const accountData = {
    account_id: accountCurrent.account_id,
    account_firstname: account_firstname,
    account_lastname: account_lastname,
    account_email: account_email,
    account_type: accountCurrent.account_type
  };

  console.log("================================")
  console.log(accountData)
  console.log("================================")

  utilities.clearAccountCookie(req, res);
  utilities.setAccountCookie(req, res, accountData);
  req.flash("notice", "Account Information Updated!");
  res.status(201).redirect("./");
};

module.exports = accountController;

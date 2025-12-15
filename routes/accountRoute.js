const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to build account management page
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

// Route to build login page
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to build registration page
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegistration)
);

// POST route for registration page
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to build account update page
router.get("/update", utilities.handleErrors(accountController.buildUpdate));

// POST route for updating account info
router.post(
  "/update/info",
  regValidate.checkAccountEmailUpdate,
  regValidate.updateInfoRules(),
  regValidate.checkUpdateInfoData,
  utilities.handleErrors(accountController.updateAccountInfo)
);

// POST route for updating account password
router.post(
  "/update/password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updateAccountPassword)
);

module.exports = router;

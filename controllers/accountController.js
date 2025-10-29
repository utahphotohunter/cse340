const utilities = require("../utilities/");
const accountController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  // req.flash("notice", flashMessage);
  res.render("./account/login", {
    title: "Login",
    nav,
  });
};

module.exports = accountController;

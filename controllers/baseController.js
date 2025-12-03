const utilities = require("../utilities/");
const baseController = {};

/* *********************************************** *
 *  Build Home page
 * *********************************************** */
baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.locals.loginLink = utilities.getHeaderLinks(req, res);
  res.render("index", {
    title: "Home",
    nav,
  });
};

module.exports = baseController;

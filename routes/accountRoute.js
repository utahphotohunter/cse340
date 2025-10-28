const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");

// Route to build login page
router.get("/login", accountController);

module.exports = router;

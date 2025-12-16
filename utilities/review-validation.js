// review validation logic
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const reviewModel = require("../models/review-model");
const validate = {};

module.exports = validate;

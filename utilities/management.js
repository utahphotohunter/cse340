let invModel = require("../models/inventory-model");
const Manager = {};

/* *********************************************** *
 *  Build the management view links
 * *********************************************** */
Manager.buildManagement = async function () {
  let managerOptions =
    '<section id="manager-options-view" class="container"><div>';
  managerOptions +=
    '<a href="/inv/manage/class" class="btn">Add Classification</a>';
  managerOptions += '<a href="/inv/manage/inv" class="btn">Add Inventory</a>';
  managerOptions += "</div></section>";

  return managerOptions;
};

/* *********************************************** *
 *  Build the add classification form
 * *********************************************** */
Manager.buildClassificationForm = async function () {
  // start section and form
  let form =
    '<section id="add-class-view" class="container form"><div class="container"><form id="addClassForm" action="/inv/manage/class" method="post">';
  // start section
  form += '<section class="container">';
  // label and input for classification_name
  form +=
    '<label for="classification_name">Add Classification</label><input type="text" name="classification_name" id="classificationName" placeholder="Enter classification name here." required/>';
  // article with input instructions
  form +=
    '<article class="container"><p>* Classification must not contain spaces or special characters.</p></article>';
  // end section
  form += "</section>";
  // submit button section
  form +=
    '<section class="submit-area container"><button type="submit" class="btn submit-btn">Submit</button></section>';
  // end form and section
  form += "</form></div></section>";

  return form;
};

/* *********************************************** *
 *  Build the classification drop-down
 * *********************************************** */
Manager.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += '<option value="">choose a classification</option>';
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += `>${row.classification_name}</option>`;
  });
  classificationList += "</select>";
  return classificationList;
};

module.exports = Manager;

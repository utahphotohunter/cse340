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

/* *********************************************** *
 *  Build the add inventory form
 * *********************************************** */
Manager.buildInventoryForm = async function () {
  let classificationList = await Manager.buildClassificationList();
  // start section and form
  let form =
    '<section id="add-inv-view" class="container form"><div class="container"><form id="addInvForm" action="/inv/manage/inv" method="post">';
  // section with classification drop-down
  form += `<section class="container"><h2>Classification</h2>${classificationList}</section>`;
  // start details section
  form += '<section class="container"><h2>Details</h2>';
  // label and input for inv_make
  form +=
    '<label for="inv_make">Make</label><input type="text" id="invMake" name="inv_make" placeholder="vehicle make" required />';
  // label and input for inv_model
  form +=
    '<label for="inv_model">Model</label><input type="text" id="invModel" name="inv_model" placeholder="vehicle model" required />';
  // label and textarea for inv_description
  form +=
    '<label for="inv_description">Description</label><textarea name="inv_description" id="invDescription" placeholder="vehicle description" required></textarea>';
  // end section
  form += "</section>";
  // start images section
  form += '<section class="container"><h2>Images</h2>';
  // label and input for inv_image
  form +=
    '<label for="inv_image">Image Path</label><input type="text" id="invImage" name="inv_image" value="/images/vehicles/no-image.png" required/>';
  // label and input for inv_thumbnail
  form +=
    '<label for="inv_thumbnail">Thumbnail Path</label><input type="text" id="invThumbnail" name="inv_thumbnail" value="/images/vehicles/no-image.png" required/>';
  // end section
  form += "</section>";
  // start information section
  form += '<section class="container"><h2>Information</h2>';
  // label and input for inv_price
  form +=
    '<label for="inv_price">Price</label><input type="number" id="invPrice" name="inv_price" placeholder="vehcile price" min="100" step="100" required/>';
  // label and input for inv_year
  form +=
    '<label for="inv_year">Year</label><input type="number" id="invYear" name="inv_year" placeholder="vehicle year" min="1900" max="2100" step="1"/>';
  // label and input for inv_miles
  form +=
    '<label for="inv_miles">Miles</label><input type="number" id="invMiles" name="inv_miles" placeholder="vehcile miles" min="0" required/>';
  // label and input for inv_color
  form +=
    '<label for="inv_color">Color</label><input type="text" id="invColor" name="inv_color" placeholder="vehicle color" required/>';
  // end section
  form += "</section>";
  // submit button section
  form +=
    '<section class="submit-area container"><button type="submit" class="btn submit-btn">Submit</button></section>';
  // end section and form
  form += "</form></div></section>";

  return form;
};

module.exports = Manager;

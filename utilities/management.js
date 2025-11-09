const Manager = {};

/* **************************************
 * Build the management view links
 * ************************************ */
Manager.buildManagement = async function () {
  let links = [];
  links.push('<a href="/inv/manage/class" class="btn">Add Classification</a>');
  links.push('<a href="/inv/manage/inv" class="btn">Add Inventory</a>');
  console.log(links);
  return links;
};

/* **************************************
 * Build the add classification form
 * ************************************ */
Manager.buildClassificationForm = async function () {
  let form = '<section id="add-class-view" class="container form">';
  form += '<div class="container">';
  form += '<form id="addClassForm" action="/inv/manage/class" method="post">';
  form += '<section class="container">';
  form += '<label for="classification_name">Add Classification</label>';
  form +=
    '<input type="text" name="classification_name" id="classificationName" placeholder="Enter classification name here." required/>';
  form += '<article class="container">';
  form +=
    "<p>* Classification must not contain spaces or special characters.</p>";
  form += "</article>";
  form += "</section>";
  form += '<section class="submit-area container">';
  form += '<button type="submit" class="btn submit-btn">Submit</button>';
  form += "</section>";
  form += "</form>";
  form += "</div>";
  form += "</section>";

  return form;
};

/* **************************************
 * Build the add inventory form
 * ************************************ */
Manager.buildInventoryForm = async function () {
  // logic for add-inventory form goes here
}






module.exports = Manager;

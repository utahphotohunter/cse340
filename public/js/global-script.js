let url = window.location.href;
let path = window.location.pathname;
let type = url[url.length - 1];
let target;
let identifier;
if (url.includes("/inv/type/")) {
  identifier = `nav-${type}`;
  target = document.getElementById(identifier);
  localStorage.setItem("wayfinder", identifier);
} else if (path === "/" || path === "") {
  identifier = "nav-0";
  target = document.getElementById(identifier);
  localStorage.setItem("wayfinder", identifier);
} else if (url.includes("inv/detail/")) {
  identifier = localStorage.getItem("wayfinder");
  target = document.getElementById(identifier);
}

target.classList.add("current");

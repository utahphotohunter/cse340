let url = window.location.href;
let path = window.location.pathname;
let type;
let target;
if (url.includes("/inv/type/")) {
  type = url[url.length - 1];
  target = document.getElementById(`nav-${type}`);
} else if (path === "/" || path === "") {
  target = document.getElementById("nav-0");
}

target.classList.add("current");

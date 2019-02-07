var nav;
var containers;
var nav_wrapper;

nav_wrapper = document.getElementById("nav_container");
nav = document.getElementById("mySidenav");
nav.style.left = "0px";
containers = document.getElementsByClassName("chart_wrapper");

Hammer(nav_wrapper).on("swipeleft", function() {
  slideIn();
});

Hammer(nav_wrapper).on("swiperight", function() {
  slideOut();
});

window.onkeyup = function(e) {
  var key = e.keyCode ? e.keyCode : e.which;
  if (key == 37) {
    slideIn();
  } else if (key == 39) {
    slideOut();
  }
};

function slideIn() {
  nav.style.left = "-120px";
}

function slideOut() {
  nav.style.left = "0px";
}

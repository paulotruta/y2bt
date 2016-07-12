Template.nav.rendered = function () {

	menu_close = false;

	if(is.mobile()) menu_close = true;

  $(".button-collapse").sideNav({
  	closeOnClick: menu_close
  });
};

$(function() {
  $nav = $('nav'),
  $blackOut = $('.black-out');

  drawerIn();

  $('.menu-icon').on('click', function(e) {
    drawerOut(e);
  });

  $('nav a').on('click', drawerIn);

  $blackOut.on('click', drawerIn)

  function drawerIn() {
    $nav.removeClass('drawer-out');
    $blackOut.removeClass('showing');
  }

  function drawerOut(event) {
    $nav.addClass('drawer-out');
    $blackOut.addClass('showing');
    event.preventDefault();
  }

});

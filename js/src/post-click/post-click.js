$(function() {
    $('.posts li').each(function() {
      $this = $(this);

      $this.css('cursor','pointer');

      $this.on('click', function() {
        document.location = $(this).find('a')[0].href;
      });
    });
});
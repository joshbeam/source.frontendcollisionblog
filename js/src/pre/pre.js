$(function() {
  $('pre').each(function() {
    $this = $(this);

    $this.html($this.html().trim());
  });
});
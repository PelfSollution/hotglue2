// Look for image with content to render dynamic caption .
/*jslint browser: true*/
/*jslint unparam: true*/

$(document).ready(function () {

  $('div.image').hide();
  var images = $('div.image').filter(function () {
    if ($(this).css('content').length > 0 && $(this).css('content') !== 'none') {
      $(this).addClass('pointer');
      return this;
    }
  });
  $(images).show();
  
  // Spinner options
  var opts = {
    lines: 9 // The number of lines to draw
	, length: 15 // The length of each line
	, width: 7 // The line thickness
	, radius: 14 // The radius of the inner circle
	, scale: 0.5 // Scales overall size of the spinner
	, corners: 1 // Corner roundness (0..1)
	, color: '#929292' // #rgb or #rrggbb or array of colors
	, opacity: 0.2 // Opacity of the lines
	, rotate: 42 // The rotation offset
	, direction: 1 // 1: clockwise, -1: counterclockwise
	, speed: 0.8 // Rounds per second
	, trail: 78 // Afterglow percentage
	, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
	, zIndex: 2e9 // The z-index (defaults to 2000000000)
	, className: 'spinner' // The CSS class to assign to the spinner
	, top: '50%' // Top position relative to parent
	, left: '50%' // Left position relative to parent
	, shadow: false // Whether to render a shadow
	, hwaccel: false // Whether to use hardware acceleration
	, position: 'fixed' // Element positioning
  };

  // Spinner initialization DON'T TOUCH !!!
  var target = document.getElementById('start.head');
  var spinner = new Spinner(opts).spin(target);

  var showCaption = function (element) {

    if ($(element).parent('a').length > 0) {
      return;
    }

    var content = $(element).css('content');

    if (content.length === 0 || content === 'none') {
      return;
    }

    if (content.charAt(0) === '\'' || content.charAt(0) === '"') {
      content = content.substr(1, content.length - 1).substr(0, content.length - 2);
    }

    content = content.replace(/%br%/g, '<br>');

    var container = '<div class="caption"><p></p></div>';

    if ($(element).find('.caption').length > 0) {
      $(element).find('.caption').remove();
    } else {
      $(container).appendTo($(element));
      $(element).find('.caption p').html(content);
    }

  };

  // Set styles before window load
  $.each($('.image'), function (index, val) {
    if (!$(val).find('.caption')) {
      $(val).css('visibility', 'hidden');
    }
  });

  $('.caption').css('cursor', 'default');

  $.each(images, function (index, val) {
    showCaption($(val));
    $(val).find('.caption').addClass('loading');
  });

  // After window load
  $(window).load(function () {
    spinner.stop();
    $('div.image').show();

    $('.image').css('visibility', 'visible');
    $('.caption').css('cursor', 'pointer');

    $.each(images, function (index, val) {
      showCaption($(val));
      $(val).find('.caption').removeClass('loading');
    });

    $(images).on('click', function () {
      showCaption(this);
    });
  });

});
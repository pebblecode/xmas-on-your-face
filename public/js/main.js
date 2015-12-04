$( document ).ready(function() {

  // ***************** toggle naughty & nice ************ //
  // *************************************************** //
  var nice = true;

  // hide span text when clicking form
  $('#select-nice').on('click', function() {
    setNice(true);
  });

  $('#select-naughty').on('click', function() {
    setNice(false);
  });

  var setNice = function(isNice) {
    //update selection variable

    console.log('setting nice to', isNice);
    nice = isNice;

    //clear classes
    $('#select-nice').attr('class', '');
    $('#select-naughty').attr('class', '');
    //highlight selected class

    if (nice) {
      $('#select-nice').attr('class', 'js-select-option');
    } else {
      $('#select-naughty').attr('class', 'js-select-option');
    }
  };

  // *********** on camera select load new page ********* //
  // *************************************************** //

  $('#shoot-photo').on('click', function(e) {
    e.preventDefault();

    console.log('are you nice?', nice);

    $.ajax({
      type: "POST",
      url: '/photo',
      data: {},
      success: function (data, status, xhr) {
        if (nice) {
          window.location.pathname = '/nice';
        } else {
          window.location.pathname = '/naughty';
        }

      }
    });
  });

  // **************** return to home page ************** //
  // *************************************************** //

  $('#start-col-change').on('click', function() {
    window.location.pathname = '/';
  });


}); //END ALL
/*
  Desarrollado por: JobalCorp - Sistemas y Marketing Digital
  Version: 1.0.1
*/

(function($) {
  'use strict';

/*=================================================
variable
=================================================*/

var $html = $('html');
var $body = $('body');

/*=================================================
IE10 viewport fix
=================================================*/

  (function() {
    'use strict';
    if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
      var msViewportStyle = document.createElement('style')
      msViewportStyle.appendChild(
        document.createTextNode(
          '@-ms-viewport{width:auto!important}'
        )
      )
      document.querySelector('head').appendChild(msViewportStyle)
    }
  })();

/*=================================================
platform detect
=================================================*/

  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  (isMobile) ? $body.addClass('is-mobile') : $body.addClass('non-mobile');

/*=================================================
preloader
=================================================*/

  function _preloader() {

    $('#preloader-img').fadeOut(__preloaderFadeOut);
    $('#preloader').delay(__preloaderDelay).fadeOut(__preloaderFadeOut, function() {
      _animation();
    });

  }

/*=================================================
set height
=================================================*/

  function _setHeight() {

    $('#intro').height($(window).height());

  }

/*=================================================
animation
=================================================*/

  function _animation() {
    if (!$html.hasClass('ie8') && !$html.hasClass('ie9')) {
      var wow = new WOW(
        {
          mobile: __mobileAnimation
        }
      );
      wow.init();
    }
  }

  function _mobileAnimation() {
    if (isMobile && __mobileAnimation == false) {
      $body.addClass('no-animation');
    }
  }

/*=================================================
header style toggle
=================================================*/

  function _toggle() {

    if (__headerStyle === 1) {
      _header();
    }
    if (__headerStyle === 2){
      _slideshow();
    }
    else if (__headerStyle === 3) {
      _video();
    }

  }

/*=================================================
static image header
=================================================*/

  function _header() {
    $.backstretch('assets/img/bg/intro.html');
  }

/*=================================================
slideshow header
=================================================*/

  function _slideshow() {

    var slideShowImageSet = [];
    for (var i = 1; i <= __imageAmount; i++) {
      slideShowImageSet.push('assets/img/bg/slideshow-' + (i < 10 ? '0' + i : i) + '.jpg');
    }

    $.backstretch(slideShowImageSet, {
      duration: __slideshowDuration, fade: __slideshowDelay
    });
  }

/*=================================================
youtube video header
=================================================*/

  function _video() {

    if (isMobile) {

      $body.addClass('youtube-video-mobile');
      $.backstretch('assets/img/bg/video-mobile.jpg');

    } else if ($html.hasClass('ie8')) {

      $.backstretch('assets/img/bg/video-desktop.jpg');

    } else {

      $body.addClass('youtube-video-desktop');
      var $bgVideo = $('#bg-video');
      var $play = $('#play');
      var $volume = $('#volume');

      $.backstretch('assets/img/bg/video-desktop.jpg');
      $play.addClass('ion-ios-pause');

      $bgVideo.attr('data-property', '{videoURL: __youtubeUrl, showControls: false, autoPlay: true, loop: __videoLoop, mute: __videoMute, startAt: __videoStart, stopAt: __videoEnd, quality: "default", containment: "body"}');
      $bgVideo.YTPlayer();

      $bgVideo.on('YTPEnd', function(e){
        if (__videoLoop) { // if loop set
          setTimeout(function() {
            $bgVideo.YTPPlay();
          }, 0); // wait seconds and then reply
        }
      });

      (__videoMute) ? $volume.addClass('ion-android-volume-off') : $volume.addClass('ion-android-volume-up');

      $play.on('click', function() {
        var $this = $(this);
        $this.toggleClass('ion-ios-play ion-ios-pause', function() {
          ($this.hasClass('ion-ios-pause')) ? $bgVideo.pauseYTP() : $bgVideo.playYTP();
        }());
      });

      $volume.on('click', function() {
        var $this = $(this);
        $this.toggleClass('ion-android-volume-off ion-android-volume-up', function() {
          ($this.hasClass('ion-android-volume-up')) ? $bgVideo.muteYTPVolume() : $bgVideo.unmuteYTPVolume();
        }());
      });
    }

  }

/*=================================================
audio
=================================================*/

  function _audioPlayer() {

    if (__audio) {

      if (isMobile) {
        var $audioPlayer = document.getElementById('audio-player'); // js
        var $play = $('#play');
        var $body = $('body');

        $body.addClass('audio-on');
        $play.addClass('ion-ios-play');
        $audioPlayer.pause();
        $play.on('click', function() {
          var $this = $(this);
          $this.toggleClass('ion-ios-play ion-ios-pause', function() {
            ($this.hasClass('ion-ios-play')) ? $audioPlayer.play() : $audioPlayer.pause();
          }());
        });
      }

      if (__headerStyle != 3 && !isMobile && !$html.hasClass('ie8')) {
        var $audioPlayer = document.getElementById('audio-player'); // js
        var $play = $('#play');
        var $body = $('body');

        $body.addClass('audio-on');
        $play.addClass('ion-ios-pause');
        $audioPlayer.play();
        $play.on('click', function() {
          var $this = $(this);
          $this.toggleClass('ion-ios-play ion-ios-pause', function() {
            ($this.hasClass('ion-ios-play')) ? $audioPlayer.play() : $audioPlayer.pause();
          }());
        });
      }
    }

  }

/*=================================================
intro module
=================================================*/

  function _introModule() {
    if (__module == 1) {
      _textRotate();
    } else
    if (__module == 2) {
      _countdown();
    }
  }

/*=================================================
text rotate
=================================================*/

  function _textRotate() {

    $('.rotate').textrotator({
      animation: __textRotateAnimation,
      separator: '|',
      speed: __textRotateSpeed
    });

    $body.addClass('text-rotate-class');

  }

/*=================================================
countdown
=================================================*/

  function _countdown() {

    var $countdownContainer = $('#countdown');

    $countdownContainer.downCount({
      date: __countdownDate,
      offset: __countdownTimezone
    });

    $body.addClass('countdown-class');

  }

/*=================================================
form validation
=================================================*/

  function _formValidation(emailAddress) {
    var emailRegex = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return emailRegex.test(emailAddress);
  }

/*=================================================
subscribe form
=================================================*/

  function _subscribe() {
    if (__mailChimp) {
      _mailChimp();
    } else {
      _subscribeForm();
    }
  }

  /* mailchimp */
  function _mailChimp() {

    var $form = $('#subscribe-form');
    var $subscribeEmail = $('#subscribe-email');

    $form.ajaxChimp({
      callback: _mailChimpStatus,
      language: 'eng',
      type: 'POST',
      url: __mailChimpUrl
    });

    function _mailChimpStatus (resp) {

      if (resp.result === 'error') {
        $subscribeEmail.focus();
        $('.subscribe-notice').addClass('visible');
      }
      else if (resp.result === 'success') {
        $form[0].reset();
        $subscribeEmail.blur();
        $('.subscribe-notice').addClass('visible');
      }

    }

  }

  /* php */
  function _subscribeForm() {

    var $form = $('#subscribe-form');
    var $subscribeEmail = $('#subscribe-email');

    $subscribeEmail.prop('type', 'text');

    $form.on('submit', function(e) {

      var subscribeEmailVal = $subscribeEmail.val();
      var $subscribeNotice = $('.subscribe-notice');
      var $submitButton = $form.find('button[type="submit"]');

      e.preventDefault();

      $submitButton.prop('disabled', true);

      if (!_formValidation(subscribeEmailVal)) {
        $subscribeNotice
        .stop(true)
        .hide()
        .addClass('visible')
        .html('<i class="icon fa fa-close error"></i> email address is invalid')
        .fadeIn();

        $submitButton.prop('disabled', false);
        $('#subscribe-email').focus();
      }
      else {
        $.ajax({
          type: 'POST',
          url: 'assets/php/subscribe.php',
          data: {
            email: subscribeEmailVal,
            emailAddress: __subscribeEmail
          },
          success: function() {
            $subscribeNotice
            .stop(true)
            .hide()
            .addClass('visible')
            .html('<i class="icon fa fa-check valid"></i> thank you for subscribing')
            .fadeIn();

            $submitButton.prop('disabled', false);
            $form[0].reset();
            $subscribeEmail.blur();

          }
        });
      }
      return false;

    });

  }

/*=================================================
contact form
=================================================*/

  function _contactForm() {

    var $form = $('#contact-form');

    $form.on('submit', function(e) {

      var $input = $form.find('input, textarea');
      var contactNameVal = $('#contact-name').val();
      var contactEmailVal = $('#contact-email').val();
      var contactMessageVal = $('#contact-message').val();
      var $contactNotice = $('.contact-notice');
      var $formNotice = $form.find('.form-notice');
      var $submitButton = $form.find('button[type="submit"]');

      e.preventDefault();

      $submitButton.prop('disabled', true);

      if (contactNameVal == '' || contactEmailVal == '' || contactMessageVal == '') {

        $contactNotice.stop(true).hide().html('<i class="icon fa fa-close error"></i> all fields are required').fadeIn(500);
        $formNotice
        .stop(true)
        .hide()
        .removeClass('fa fa-check valid-bg')
        .addClass('fa fa-close error-bg')
        .fadeIn(500, function() {
          $(this).delay(2500).fadeOut(function() {
            $submitButton.prop('disabled', false);
          });
        });

        $input.each(function() {
          if (this.value === '') {
            this.focus();
            return false;
          }
        });

      }

      else if (!_formValidation(contactEmailVal)) {

        $contactNotice
        .stop(true)
        .hide()
        .html('<i class="icon fa fa-close error"></i> email address is invalid')
        .fadeIn(500);
        $formNotice
        .stop(true)
        .hide()
        .removeClass('fa fa-check valid-bg')
        .addClass('fa fa-close error-bg')
        .fadeIn(500, function() {
          $(this).delay(2500).fadeOut(function() {
            $submitButton.prop('disabled', false);
          });
        });
        $('#contact-email').focus();

      }
      else {

        $.ajax({
          type: 'POST',
          url: 'assets/php/contact.php',
          data: {
            name: contactNameVal,
            email: contactEmailVal,
            message: contactMessageVal,
            emailAddress: __contactEmail
          },
          success: function() {

            $contactNotice
            .stop(true)
            .hide()
            .html('<i class="icon fa fa-check valid"></i> message have been sent')
            .fadeIn(500);
            $formNotice
            .stop(true)
            .hide()
            .removeClass('fa fa-close error-bg')
            .addClass('fa fa-check valid-bg')
            .fadeIn(500, function() {
              $(this).delay(2500).fadeOut(function() {
                $submitButton.prop('disabled', false);
              });
            });
            $form[0].reset();
            $input.blur();

          }
        });

      }
      return false;

    });
  }

/*=================================================
overlay
=================================================*/

  function _overlay() {
    var $overlays = $('.overlays');
    $overlays.css('opacity', __overlayOpacity);
    if (__overlayStyle == 1) {
      $overlays.addClass('overlay');
    }
    if (__overlayStyle == 2) {
      $overlays.addClass('gradient');
    }
  }

/*=================================================
disable section
=================================================*/

  function _disableSection() {

    for (var a in __disableSection) {
      if (__disableSection[a]) {
        var id = '#' + a;
        $(id).remove();
      }
    }

  }

/*=================================================
window on load
=================================================*/

  $(window).on('load', function() {

    _preloader();
    _setHeight();
    _toggle();

  });

/*=================================================
document on ready
=================================================*/

  $(document).on('ready', function() {

    _overlay();
    _introModule();
    _audioPlayer();
    _subscribe();
    _contactForm();
    _disableSection();
    _mobileAnimation();

  });

/*=================================================
window on resize
=================================================*/

  $(window).on('resize', function() {

    if (!isMobile) {
      _setHeight();
    }

  }).trigger('resize');

})(jQuery);
/*=================================================
true = yes/enable
flase = no/disable
1000 = 1 seconds
=================================================*/

/*=================================================
preloader
=================================================*/

var __preloaderFadeOut = 1200; // fadeout
var __preloaderDelay = 800; // delay

/*=================================================
animation
=================================================*/

var __mobileAnimation = false; // mobile animation

/*=================================================
overlay
=================================================*/

var __overlayStyle = 1; // 1 = normal, 2 = gradient
var __overlayOpacity = 0.9; // overlay opacity, 0 to 1

/*=================================================
header style
=================================================*/

var __headerStyle = 3; // 1 = static image, 2 = slideshow, 3 = youtube video

/*=================================================
slideshow
=================================================*/

var __imageAmount = 3; // image amount
var __slideshowDuration = 5000; // duration
var __slideshowDelay = 800; // delay

/*=================================================
youtube video
=================================================*/

var __youtubeUrl = 'https://www.youtube.com/watch?v=hXuAdTqhJYU'; // youtube video url

var __videoStart = -10; // start time (seconds)
var __videoEnd = 23; // end time (seconds)

var __videoLoop = true; // loop
var __videoMute = false; // mute on start

/*=================================================
audio
=================================================*/

var __audio = true; // audio toggle

/*=================================================
intro module
=================================================*/

var __module = 2; // 0 = disable, 1 = text rotate, 2 = countdown

/*=================================================
text rotate
=================================================*/

var __textRotateAnimation = 'dissolve'; // dissolve, fade, flip, flipUp, flipCube, flipCubeUp, spin
var __textRotateSpeed = 4000; // rotate speed (milliseconds)

/*=================================================
countdown
=================================================*/

var __countdown = true; // countdown toggle
var __countdownDate = "01/18/2016 23:59:59"; // 2015-12-24 23:59:59
var __countdownTimezone = "-8"; // timezone

/*=================================================
Contact and Subscribe
=================================================*/

var __contactEmail = 'email@example.com'; // contact email address
var __subscribeEmail = 'email@example.com'; // subscribe email address
var __mailChimp = false; // true = mailchimp form, false = php subscribe form
var __mailChimpUrl = 'MAILCHIMP_POST_URL_HERE.html'; // mailchimp post url

$.ajaxChimp.translations.eng = { // custom mailchimp message
  'submit': 'please wait',
  0: '<i class="icon fa fa-check"></i> we have sent you a confirmation email',
  1: '<i class="icon fa fa-close"></i> enter a valid e-mail address',
  2: '<i class="icon fa fa-close"></i> e-mail address is not valid',
  3: '<i class="icon fa fa-close"></i> e-mail address is not valid',
  4: '<i class="icon fa fa-close"></i> e-mail address is not valid',
  5: '<i class="icon fa fa-close"></i> e-mail address is not valid'
}

// dedault message for reference

// Submit Message
// 'submit': 'Submitting...'
// Mailchimp Responses
// 0: 'We have sent you a confirmation email'
// 1: 'Please enter a value'
// 2: 'An email address must contain a single @'
// 3: 'The domain portion of the email address is invalid (the portion after the @: )'
// 4: 'The username portion of the email address is invalid (the portion before the @: )'
// 5: 'This email address looks fake or invalid. Please enter a real email address'

/*=================================================
disable section, true = disable, false = enable
last value without comma
=================================================*/

var __disableSection = {
  feature : false, // feature
  subscribe : false, // subscribe
  contact : false // contact
};
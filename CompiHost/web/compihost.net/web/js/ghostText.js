// JavaScript Document


(function($){$.fn.ghostText = function() {
  return this.each(function(){
    var text = $(this).attr("placeholder");
    if(text!=""&&($(this).val()==""||$(this).val()==text)) {
      $(this).addClass("disabled");
      $(this).val(text);
      $(this).focus(function(){
        $(this).removeClass("disabled");
        if($(this).val()==text) {
          $(this).val("");
        }
      });
      $(this).blur(function(){
        if($(this).val()=="") {
          $(this).val(text);
          $(this).addClass("disabled");
        }
      });
    }
  });
};})(jQuery)

// JavaScript Document


(function($){
  $.fn.growing = function(options){
    var settings = $.extend({
       maxHeight: 400,
       minHeight: 40,
       buffer: 0
    }, options);
    return this.each(function(){
      var textarea = $(this); //cache the textarea
      var minh = textarea.height()>settings.minHeight?textarea.height():settings.minHeight;
      var w = parseInt(textarea.width()||textarea.css("width")); //get the width of the textarea
      var div = $("<div class='faketextarea' style='position:absolute;left:-10000px;width:" + w + "px;padding:" + textarea.css("padding") +";border:" + textarea.css("border") + ";'></div>");
      textarea.after(div);
      var resizeBox = function(){
        var html = textarea.val().replace(/(<|>)/g, '').replace(/n/g,"<br>|");
        if(html!=div.html()) {
          div.html(html);
          var h = div.height();
          prevh = textarea.height();
          var newh = h<=minh?minh:(h>settings.maxHeight?settings.maxHeight:h);
          newh += settings.buffer;
          if(newh>=settings.maxHeight) {
            textarea.css("overflow","auto");
          } else {
            textarea.css("overflow","hidden");
          }
          textarea.css({"height":newh+"px"});
        }
      };
      textarea.keydown(resizeBox);
      textarea.keyup(resizeBox);
      resizeBox();
    });
  };
})(jQuery);






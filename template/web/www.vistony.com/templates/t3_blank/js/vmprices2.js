
jQuery(function($) {
    // Add to cart and other scripts may check this variable and return while
    // the content is being updated.
    Virtuemart.isUpdatingContent = false;
    Virtuemart.updateContent = function(url) {
        if(Virtuemart.isUpdatingContent) return false;
        Virtuemart.isUpdatingContent = true;
        url += url.indexOf('&') == -1 ? '?tmpl=component' : '&tmpl=component';
        console.log("UpdateContent URI "+url);
        $.ajax({
            url: url,
            dataType: 'html',
            success: function(data) {
                var el = $(data).find(Virtuemart.containerSelector);
				if (! el.length) el = $(data).filter(Virtuemart.containerSelector);
				if (el.length) {
					Virtuemart.container.html(el.html());
                    Virtuemart.updateCartListener();
                    Virtuemart.updateDynamicUpdateListeners();
                    //Virtuemart.updateCartListener();

					if (Virtuemart.updateImageEventListeners) Virtuemart.updateImageEventListeners();
					if (Virtuemart.updateChosenDropdownLayout) Virtuemart.updateChosenDropdownLayout();
				}
				Virtuemart.isUpdatingContent = false;
				 // $('.product-custom select').styler().trigger('refresh');
				  $(function(){
				  $('.productdetails-view #accordion2').show().animate({opacity:1},800);
				  $('.productdetails-view .image_show').animate({opacity:1},1000);
				  $('.productdetails-view .example2').removeClass('loader'); // remove the loader when window gets loaded.
					$('.tabs_show').show().animate({opacity:1},1000);
				  Zoom();
				  sliderInit6();

				  //check_reviewform();
				  refresh_counter();
				  quick_ap();
				 // JCommentsInitializeForm();
				  $('a.ask-a-question, a.printModal, a.recommened-to-friend, a.manuModal').click(function(event){
				  //event.preventDefault();
				  $.facebox({
					iframe: $(this).attr('href'),
					rev: 'iframe|550|550'
					});
				  });
				});
			  $('.list_carousel').removeClass('loader');
			  $('.product-related #slider').show();
			  $('.product-related-products .hasTooltips, .product-related-products .add_wishlist,.product-related-products .add_compare').tooltip('hide');
			  $(function() {
					var steps = 5;
					var parentPos= $('.write-reviews .ratingbox').position();
					var boxWidth = $('.write-reviews .ratingbox').width();// nbr of total pixels
					var starSize = (boxWidth/steps);
					var ratingboxPos= $('.write-reviews .ratingbox').offset();
					var ratingbox=$('.write-reviews .ratingbox')
						$('.write-reviews .ratingbox').mousemove( function(e){
							var span = $(this).children();
							var dif = Math.floor(e.pageX-ratingbox.offset().left); 
							difRatio = Math.floor(dif/boxWidth* steps )+1; //step
							span.width(difRatio*starSize);
							$('#vote').val(difRatio);
							//console.log('note = ', difRatio);
							
						});
						$('.write-reviews .ratingbox').click(function(){
					    $('.button_vote').click();});
				});
			  window.addEvent('domready', function() {
				SqueezeBox.initialize({});
					SqueezeBox.assign($$('a.modal'), {
						parse: 'rel'
					});
				});
				Tabsresp();
            }
        });
        Virtuemart.isUpdatingContent = false;
    }
});


/** 
 *------------------------------------------------------------------------------
 * @package       T3 Framework for Joomla!
 *------------------------------------------------------------------------------
 * @copyright     Copyright (C) 2004-2013 JoomlArt.com. All Rights Reserved.
 * @license       GNU General Public License version 2 or later; see LICENSE.txt
 * @authors       JoomlArt, JoomlaBamboo, (contribute to this project at github 
 *                & Google group to become co-author)
 * @Google group: https://groups.google.com/forum/#!forum/t3fw
 * @Link:         http://t3-framework.org 
 *------------------------------------------------------------------------------
 */
  function centerBox2() {
      var boxWidth = 780;
    var winWidth = jQuery(window).width();
    var winHeight = jQuery(document).height();
    var scrollPos = jQuery(window).scrollTop();
     
     
    var disWidth = (winWidth - boxWidth) / 2
   // var disHeight = 200;
     
    jQuery('#quick_view_popup').css({'width' : boxWidth+'px', 'left' : disWidth+'px'});
     
    return false;       
} 
jQuery(window).resize(centerBox2);
//jQuery(window).scroll(centerBox2);
 

 jQuery(document).ready(function(){
	centerBox2(); 
if (notAnimate =='1'){							 
	jQuery('.module_banner1 .banneritem').addClass('display-none');
	jQuery('.module_banner1 .banneritem').viewportChecker({
		classToAdd: 'display-block animated bounceInDown', // Class to add to the elements when they are visible
		offset: 100 // The offset of the elements (let them appear earlier or later)
	});
	
		jQuery('.t3-footnav >div').addClass('display-none');
	jQuery('.t3-footnav >div:nth-child(1)').viewportChecker({
		classToAdd: 'display-block animated zoomInLeft', // Class to add to the elements when they are visible
		offset: 100 // The offset of the elements (let them appear earlier or later)
	});
	jQuery('.t3-footnav >div:nth-child(2)').viewportChecker({
		classToAdd: 'display-block animated zoomInRight', // Class to add to the elements when they are visible
		offset: 100 // The offset of the elements (let them appear earlier or later)
	});
	jQuery('.t3-footnav >div:nth-child(3)').viewportChecker({
		classToAdd: 'display-block animated zoomInLeft', // Class to add to the elements when they are visible
		offset: 100 // The offset of the elements (let them appear earlier or later)
	});
	jQuery('.t3-footnav >div:nth-child(4)').viewportChecker({
		classToAdd: 'display-block animated zoomInRight', // Class to add to the elements when they are visible
		offset: 100 // The offset of the elements (let them appear earlier or later)
	});
	jQuery('.t3-footnav >div:nth-child(5)').viewportChecker({
		classToAdd: 'display-block animated zoomInRight', // Class to add to the elements when they are visible
		offset: 100 // The offset of the elements (let them appear earlier or later)
	});
}

  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
  if(isMobile) {
    jQuery('.product-box').addClass('quick-tell-no');
	jQuery('.product-box').addClass('menu-tell-no');
	
   }else{
	   jQuery('.product-box').addClass('quick-tell-yes');
	   jQuery('body').addClass('menu-tell-yes');
	   }; 
 jQuery('#facebox .continue').live('click',function (e) {
	e.preventDefault();
	jQuery('#facebox').hide();
	jQuery('#facebox_overlay').remove();
	return false;
});
 jQuery('#comments-form-send').removeClass('btn');
	jQuery('.smile .hasTooltip').tooltip('hide');
	jQuery('ul li:last-child').addClass('lastItem');
	jQuery('ul li:first-child').addClass('firstItem');



var sticky_navigation_offset_top = jQuery('#t3-mainnav').offset().top;
// our function that decides weather the navigation bar should have "fixed" css position or not.
var sticky_navigation = function(){
var scroll_top = jQuery(window).scrollTop(); // our current vertical position from the top
// if we've scrolled more than the navigation, change its position to fixed to stick to top, otherwise change it back to relative
if (scroll_top > sticky_navigation_offset_top) {
	jQuery('#head-row').addClass("fixed");
	jQuery('#t3-mainnav').addClass("fadeInDown animated");
} else {
	jQuery('#head-row').removeClass("fixed");
	jQuery('#t3-mainnav').removeClass("fadeInDown animated");
}
};
// run our function on load
sticky_navigation();
// and run it again every time you scroll
jQuery(window).scroll(function() {
	if (jQuery('html').hasClass('desktop')){							   
		sticky_navigation();
	}
});



});
	jQuery(document).ready(function($){
		if(jQuery('.t3-aside .container').width()<750){
		$(this).find(".click").toggle(
			function(){
			$(this).addClass('mobile-open').next('.t3-aside .module-ct').slideToggle("slow"),{duration:'slow',easing:'linear'};																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																				 		},																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																					 	  function(){
			$(this).removeClass('mobile-open').next('.module-ct').slideToggle("slow"),{duration:'slow',easing:'linear'};																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																														    		
		  });
		}

	// hide #back-top first
	jQuery("#back-top").hide();
	
	// fade in #back-top
	jQuery(function () {
		//jQuery(window).scroll(function () {
			//if (jQuery(this).scrollTop() > 450) {
				//jQuery('#back-top').fadeIn();
			//} else {
			//	jQuery('#back-top').fadeOut();
			//}
		//});

		// scroll body to 0px on click
		jQuery('#back-top a').click(function () {
			jQuery('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});
	});
}); 
  jQuery(document).ready(function(){
	 jQuery('body').append('<div id="system_view_overlay" style="display:none"></div><div class="AjaxPreloaderC" style="display:none"></div><div id="system_view"></div>');
		if( jQuery("#mod_compare .vmproduct .clearfix").hasClass("modcompareprod")) {
          jQuery("#mod_compare .not_text").addClass('displayNone');
    	 }
		 if( jQuery("#mod_compare .vmproduct .clearfix").hasClass("modcompareprod")) {
			 jQuery("#mod_compare #butseldcomp").removeClass('displayNone');
		 }else { jQuery("#mod_compare #butseldcomp").addClass('displayNone');}
		 
		 if( jQuery("#mod_wishlists .vmproduct .clearfix").hasClass("modwishlistsprod")) {
          jQuery("#mod_wishlists .not_text").addClass('displayNone');
    	 }
		 if( jQuery("#mod_wishlists .vmproduct .clearfix").hasClass("modwishlistsprod")) {
			 jQuery("#mod_wishlists #butseldwish").removeClass('displayNone');
		 }else { jQuery("#mod_wishlists #butseldwish").addClass('displayNone');}
		 
	});
  
  
  function addToCompare(product_id) { 
  jQuery('#system_view_overlay').show();
	  jQuery('.AjaxPreloaderC').show();
	jQuery.ajax({
		url: 'index.php?option=com_comparelist&task=add',
		type: 'post',
		data: 'product_id=' + product_id,
		dataType: 'json',
		success: function(json){
			 jQuery('.AjaxPreloaderC').hide();
			  // jQuery('#system_view_overlay').hide();
			if(json){
				jQuery('#system_view').show().html('<div class="success"><div class="wrapper successprod_'+product_id+'"><div class="success_compare_img">' + json.img_prod2 + '</div><div class="success_compare_left">' + json.title + json.btnrem + '</div></div><div class="success_compare">' + json.message + '</div><div class="wrapper2">'+ json.btncompareback + json.btncompare +'</div></div><div class="system_view_close"></div>');
				jQuery('.success').fadeIn('slow');
				//jQuery('html, body').animate({ scrollTop: 0 }, 'slow'); 
				}
				if(json.product_ids>0){
					jQuery('.list_compare'+product_id+' a').addClass('go_to_compare active');
				}
				
				 if(json.totalcompare>0){
					 jQuery("#mod_compare #butseldcomp").removeClass('displayNone');
				}
				
				if(json.prod_name){
					jQuery('#mod_compare .vmproduct').append('<div id="compare_prod_'+product_id+'" class="modcompareprod clearfix">'+json.img_prod+json.prod_name+'</div>');
				}
				if( jQuery("#mod_compare .vmproduct .clearfix").hasClass("modcompareprod")) {
         			 jQuery("#mod_compare .not_text").addClass('displayNone');
    			 }

				 jQuery('#system_view_overlay, .system_view_close , #compare_continue').click(function () {
					jQuery('#system_view').hide();
					jQuery('#system_view_overlay').hide();
					//jQuery('.AjaxPreloader').hide();
                 });
			//alert(json.message);
				
			}
			
	});
}

 function removeCompare(remove_id) { 
	jQuery('#compare_cat'+remove_id+' a').removeClass('go_to_compare active');
	jQuery.ajax({
		url: 'index.php?option=com_comparelist&task=removed',
		type: 'post',
		data: 'remove_id=' + remove_id,
		dataType: 'json',
		success: function(json){
					 jQuery('.compare_prod_'+remove_id).remove();
					  jQuery('#compare_prod_'+remove_id).remove();
					  jQuery('.success .successprod_'+remove_id).remove();
					   jQuery('.success_compare span').remove();
					   jQuery('#system_view .success .success_compare').append('<span class="warning">'+json.rem+'</span>');
					 	jQuery('.list_compare'+remove_id+' a').removeClass('go_to_compare active');
					 if(json.totalrem<1){
						jQuery("#mod_compare .not_text").removeClass('displayNone');
						jQuery("#butseldcomp").addClass('displayNone');
						jQuery(".module-title.compare.no-products").addClass('displayBlock');
						jQuery(".browscompare_list").remove();
						
					}
			}
	});
}

  function addToWishlists(product_id) { 
  jQuery('#system_view_overlay').show();
	  jQuery('.AjaxPreloaderC').show();
	jQuery.ajax({
		url: 'index.php?option=com_wishlists&task=add',
		type: 'post',
		data: 'product_id=' + product_id,
		dataType: 'json',
		success: function(json){
			
			 jQuery('.AjaxPreloaderC').hide();
			  // jQuery('#system_view_overlay').hide();
			  jQuery('.list_wishlists'+product_id+' a').addClass('go_to_compare active');
			if(json){
				jQuery('#system_view').show().html('<div class="success"><div class="wrapper successprod_'+product_id+'"><div class="success_wishlists_img">' + json.img_prod2 + '</div><div class="success_wishlists_left">' + json.title + json.btnrem + '</div></div><div class="success_wishlists">' + json.message + '</div><div class="wrapper2">'+ json.btnwishlistsback + json.btnwishlists +'</div></div><div class="system_view_close"></div>');
				jQuery('.success').fadeIn('slow');
				//jQuery('html, body').animate({ scrollTop: 0 }, 'slow'); 
					
				}
			
				 
				 if(json.totalwishlists>0){
					 jQuery("#mod_wishlists #butseldwish").removeClass('displayNone');
				}
				
				if(json.prod_name){
					jQuery('#mod_wishlists .vmproduct').append('<div id="wishlists_prod_'+product_id+'" class="modwishlistsprod clearfix">'+json.img_prod+json.prod_name+'</div>');
				}
				if( jQuery("#mod_wishlists .vmproduct .clearfix").hasClass("modwishlistsprod")) {
         			 jQuery("#mod_wishlists .not_text").addClass('displayNone');
    				 }
				 jQuery('#system_view_overlay, .system_view_close , #wishlists_continue').click(function () {
					jQuery('#system_view').hide();
					jQuery('#system_view_overlay').hide();
					//jQuery('.AjaxPreloader').hide();
                 });
			//alert(json.message);
			}
	});
}

 function removeWishlists(remove_id) { 
	jQuery('#compare_cat'+remove_id+' a').removeClass('go_to_compare active');
	jQuery.ajax({
		url: 'index.php?option=com_wishlists&task=removed',
		type: 'post',
		data: 'remove_id=' + remove_id,
		dataType: 'json',
		success: function(json){
					  jQuery('#wishlists_prod_'+remove_id).remove();
					  jQuery('.success .successprod_'+remove_id).remove();
					   jQuery('.success_wishlists span').remove();
					   jQuery('#system_view .success .success_wishlists').append('<span class="warning">'+json.rem+'</span>');
					 	jQuery('.list_wishlists'+remove_id+' a').removeClass('go_to_compare active');
					 if(json.totalrem<1){
						jQuery("#mod_wishlists .not_text").removeClass('displayNone');
						jQuery("#butseldwish").addClass('displayNone');
						jQuery(".module-title.wishlists.no-products").addClass('displayBlock');
						jQuery(".category-wishlist").remove();
						
					}
			}
	});
}

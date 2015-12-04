  jQuery(document).ready(function() {
      
   $('.success-message').hide();
	$('.error-message').hide();
        
 /*Actualizar contacto*/
        $("#formdatos").submit(function(e) {
		e.preventDefault();
		
		var formdatos = $(this);
	    var postdata = formdatos.serialize();
	    $.ajax({
	        type: 'POST',
	        url: '../controlador/valida2.php',
	        data: postdata,
	        dataType: 'json',
	        success: function(json) {
	            if(json.valid == 0) {
	                $('.success-message').hide();
	                $('.error-message').hide();
	                $('.error-message').html(json.message);
	                $('.error-message').fadeIn(1000);
                        $('.error-message').fadeOut(3000);
	            }
	            else {
	                $('.error-message').hide();
	                $('.success-message').hide();
	               
	                $('.success-message').html(json.message);
	                $('.success-message').fadeIn(1000);
                        $('.success-message').fadeOut(3000);
	            }
	        }
	    });
           
	});

  });


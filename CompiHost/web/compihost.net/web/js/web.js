// JavaScript Document



function paso3(codigo,precio,tiempo,asunto){
var datos='paso=3&precio='+precio+'&codigo='+codigo+'&tiempo='+tiempo+'&asunto='+asunto;
//alert(datos);
	redirec('otro','conf-web.php',datos);
	
}





function solicitar(){
	
   if($("#mail1").val()==''){
	 alert("ingrese su mail1"); 
	 $("#mail1").focus();
	 return false; 
	}
 
   if($("#mail2").val()==''){
	 alert("ingrese su mail2"); 
	 $("#mail2").focus();
	 return false; 
	}
	
    if($("#mail1").val()==''){
	 alert("ingrese su mail1"); 
	 $("#mail1").focus();
	 return false; 
	}
	
    if($("#datos").val()==''){
	 alert("ingrese sus datos"); 
	 $("#datos").focus();
	 return false; 
	}	
	
	redirec('otro','conf-web.php','paso=solicitar&'+$("#fpaso3").serialize());
	//alert($("#fpaso3").serialize());
	
}
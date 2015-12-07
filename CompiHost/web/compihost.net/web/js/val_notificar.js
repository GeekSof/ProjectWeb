// JavaScript Document

function vacio(q) {  
        for ( i = 0; i < q.length; i++ ) {  
                if ( q.charAt(i) != " " ) {  
                        return true  ;
                }  
        }  
        return false; 
}  
  
function email(m)
{  
        var b=/^[^@\s]+@[^@\.\s]+(\.[^@\.\s]+)+$/ ; 
        return b.test(m);  
}  

function nombre(m)
{  
        var b="Nombre :" ; 
        if (m == b || m == "")
		{
			return false;  
			}
		else
		{
			return true;
			}
}  

function email_vacio(m)
{  
        var b="Nombre :" ; 
        if (m == b || m == "")
		{
			return false;  
			}
		else
		{
			return true;
			}
} 



function asunto(m)
{  
        var b="Asunto :" ; 
        if (m == b || m == "")
		{
			return false;  
			}
		else
		{
			return true;
			}
}

function mensaje(m)
{  
        var b="Mensaje ..." ; 
        if (m == b || m == "")
		{
			return false;  
			}
		else
		{
			return true;
			}
}

function valida(F) {  
          
         if( nombre(F.nombre.value) == false) 
		{  
                alert("El campo NOMBRE es obligatorio.")  
				F.nombre.focus();
                return false;  
        }
        if( email_vacio(F.email.value) == false ) 
		{  
                alert("El campo E-MAIL es obligatorio.")  
				F.email.focus();
                return false;  
        } 
		if( email(F.email.value) == false ) 
		{  
                alert("El E-MAIL ingresado no es valido.")  
				F.email.focus();
                return false;  
        }
        if( asunto(F.asunto.value) == false ) 
		{  
                alert("El campo ASUNTO es obligatorio.")  
				F.asunto.focus();
                return false;  
        } 
        if( mensaje(F.mensaje.value) == false ) 
		{  
                alert("El campo MENSAJE es obligatorio.")  
				F.mensaje.focus();
                return false;  
        } 
		//enviar = /\.(gif|jpg|png|ico|bmp)$/i.test(f.value);
        if(!( /\.(gif|jpg|png|ico|bmp)$/i.test(document.getElementById('archivo').value))) 
		{  
		        alert("solo imagenes con extension:  .gif | .jpg | .jpeg | .png | .bmp | .ico");
                return false;  
        } 		
		alert("Su mensaje ha sido enviado con exito.");
          
}  